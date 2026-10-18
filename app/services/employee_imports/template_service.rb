require "csv"

module EmployeeImports
  class TemplateService
    def process!
      CSV.generate { |csv| csv << Schema::COLUMNS << Schema::EXAMPLE_ROW }
    end
  end
end
