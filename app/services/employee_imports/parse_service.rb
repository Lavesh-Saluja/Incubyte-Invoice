require "csv"

module EmployeeImports
  class ParseService
    Parsed = Data.define(:rows, :errors)
    ParsedRow = Data.define(:number, :values, :field_count)

    BYTE_ORDER_MARK = "\u{FEFF}".freeze
    NULL_BYTE = "\u0000".freeze

    attr_reader :file

    def initialize(file)
      @file = file
    end

    def process!
      return failure(:invalid_file) unless file.respond_to?(:read) && file.respond_to?(:original_filename)
      return failure(:invalid_extension) unless File.extname(file.original_filename.to_s).casecmp?(".csv")
      return failure(:too_large, max: ActiveSupport::NumberHelper.number_to_human_size(Schema::MAX_FILE_SIZE)) if file.size > Schema::MAX_FILE_SIZE

      file.rewind
      content = file.read.force_encoding(Encoding::UTF_8)
      return failure(:invalid_encoding) if !content.valid_encoding? || content.include?(NULL_BYTE)

      parse(content.delete_prefix(BYTE_ORDER_MARK))
    rescue CSV::MalformedCSVError => error
      failure(:malformed, line: error.line_number)
    end

    private
      def parse(content)
        csv = CSV.new(content)
        headers = csv.shift
        headers = csv.shift while headers&.all?(&:blank?)
        return failure(:empty) if headers.nil?

        columns = headers.map { |header| header.to_s.strip.downcase }
        header_errors = header_errors(columns)
        return Parsed.new(rows: [], errors: header_errors) if header_errors.any?

        rows = []
        csv.each do |fields|
          next if fields.all?(&:blank?)
          return failure(:too_many_rows, max: Schema::MAX_ROWS) if rows.size >= Schema::MAX_ROWS

          rows << ParsedRow.new(number: csv.lineno, values: columns.zip(fields).to_h, field_count: fields.size)
        end
        return failure(:no_rows) if rows.empty?

        Parsed.new(rows:, errors: [])
      end

      def header_errors(columns)
        missing = (Schema::COLUMNS - columns).map { |column| header_error(:missing_header, column) }
        duplicated = columns.tally.select { |_, count| count > 1 }.keys.map { |column| header_error(:duplicate_header, column) }
        unexpected = (columns - Schema::COLUMNS).uniq.map { |column| header_error(:unexpected_header, column.presence) }
        missing + duplicated + unexpected
      end

      def header_error(key, column)
        RowError.new(row: 1, column:, message: I18n.t("employee_imports.errors.#{key}", column: column || I18n.t("employee_imports.blank_header")))
      end

      def failure(key, **options)
        Parsed.new(rows: [], errors: [ RowError.new(row: nil, column: nil, message: I18n.t("employee_imports.errors.#{key}", **options)) ])
      end
  end
end
