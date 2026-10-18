require "csv"

module Exports
  class GenerateService
    TEMPFILE_PREFIX = "acme-export"

    attr_reader :export

    def initialize(export)
      @export = export
    end

    def process!
      return unless export.active?

      employee_ids = Employees::FilterService.new(Employee.all, export.filters).process!.pluck(:id)
      export.update!(status: :processing, started_at: Time.current, total_rows: employee_ids.size, processed_rows: 0)

      with_tempfile do |file|
        write_csv(file, employee_ids)
        next if cancelled?

        store(file)
        export.update!(status: :completed, completed_at: Time.current)
      end
    rescue StandardError => error
      Rails.logger.error("Export #{export.id} failed: #{error.class}: #{error.message}")
      export.update!(status: :failed, error_message: I18n.t("exports.errors.failed"), completed_at: Time.current) unless cancelled?
    end

    private
      def write_csv(file, employee_ids)
        csv = CSV.new(file)
        csv << CsvRow.headers

        employee_ids.each_slice(Export::BATCH_SIZE).with_index(1) do |ids, batch|
          return if cancelled?

          employees = Employee.where(id: ids).includes(:department, :salary).index_by(&:id)
          ids.each { |id| csv << CsvRow.new(employees[id]).to_a if employees[id] }
          export.update_columns(processed_rows: [ batch * Export::BATCH_SIZE, employee_ids.size ].min, updated_at: Time.current)
        end
      end

      def store(file)
        file.flush
        content = File.binread(file.path)
        ExportFile.create!(export:, content:, content_type: "text/csv", byte_size: content.bytesize)
      end

      def with_tempfile
        file = Tempfile.new([ TEMPFILE_PREFIX, ".csv" ], binmode: true)
        yield file
      ensure
        file&.close!
      end

      def cancelled?
        Export.where(id: export.id).pick(:status) == "cancelled"
      end
  end
end
