module EmployeeImports
  class ValidateService
    attr_reader :parsed_rows, :effective_from

    def initialize(parsed_rows, effective_from: Date.current)
      @parsed_rows = parsed_rows
      @effective_from = effective_from
    end

    def process!
      rows = parsed_rows.map { |parsed_row| Row.new(parsed_row, departments:, effective_from:).validate }
      flag_repeated(rows, "employee_code", &:employee_code)
      flag_repeated(rows, "email", &:email)
      flag_existing(rows, "employee_code", existing_codes(rows), &:employee_code)
      flag_existing(rows, "email", existing_emails(rows), &:email)

      Result.new(rows:, file_errors: [])
    end

    private
      def departments
        @departments ||= Department.all.index_by { |department| department.name.downcase }
      end

      def flag_repeated(rows, column)
        rows.group_by { |row| yield(row) }.except(nil).each_value do |group|
          next if group.one?

          group.each do |row|
            others = (group - [ row ]).map(&:number).join(", ")
            row.add_error(column, :repeated_in_file, rows: others)
          end
        end
      end

      def flag_existing(rows, column, existing)
        rows.each do |row|
          value = yield(row)
          row.add_error(column, :already_exists) if value && existing.include?(value) && !row.error_on?(column)
        end
      end

      def existing_codes(rows)
        codes = rows.filter_map(&:employee_code)
        Employee.where(employee_code: codes).pluck(:employee_code).to_set
      end

      def existing_emails(rows)
        emails = rows.filter_map(&:email)
        return Set.new if emails.empty?

        Employee.where("lower(email) IN (?)", emails).pluck(Arel.sql("lower(email)")).to_set
      end
  end
end
