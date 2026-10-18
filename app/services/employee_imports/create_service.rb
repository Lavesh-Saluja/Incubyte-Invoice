module EmployeeImports
  class CreateService
    LOCK_KEY = 4_810_237

    attr_reader :file

    def initialize(file)
      @file = file
    end

    def process!
      Employee.transaction do
        Employee.connection.execute("SELECT pg_advisory_xact_lock(#{LOCK_KEY})")
        result = PreviewService.new(file).process!
        raise InvalidImportError.new(result) unless result.valid?

        result.rows.each_slice(Schema::BATCH_SIZE) { |batch| insert(batch) }
        result
      end
    end

    private
      def insert(rows)
        ids = Employee.insert_all!(rows.map(&:employee_attributes), returning: %w[id employee_code])
          .to_a.to_h { |inserted| [ inserted["employee_code"], inserted["id"] ] }

        Salary.insert_all!(rows.map { |row| row.salary_attributes.merge("employee_id" => ids.fetch(row.employee_code)) })
      end
  end
end
