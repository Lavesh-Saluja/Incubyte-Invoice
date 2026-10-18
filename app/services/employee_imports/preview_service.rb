module EmployeeImports
  class PreviewService
    attr_reader :file

    def initialize(file)
      @file = file
    end

    def process!
      parsed = ParseService.new(file).process!
      return Result.new(rows: [], file_errors: parsed.errors) if parsed.errors.any?

      ValidateService.new(parsed.rows).process!
    end
  end
end
