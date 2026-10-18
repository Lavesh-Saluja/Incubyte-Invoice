module EmployeeImports
  class InvalidImportError < StandardError
    attr_reader :result

    def initialize(result)
      @result = result
      super(I18n.t("employee_imports.errors.not_imported"))
    end
  end
end
