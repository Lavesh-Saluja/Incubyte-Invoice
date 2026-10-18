module EmployeeImports
  Result = Data.define(:rows, :file_errors) do
    def errors
      file_errors + rows.flat_map(&:errors)
    end

    def total_rows
      rows.size
    end

    def invalid_rows
      rows.count(&:invalid?)
    end

    def valid_rows
      total_rows - invalid_rows
    end

    def valid?
      file_errors.empty? && rows.any? && invalid_rows.zero?
    end
  end
end
