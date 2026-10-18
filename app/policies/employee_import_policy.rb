class EmployeeImportPolicy < ApplicationPolicy
  def template?
    user&.hr?
  end

  def preview?
    user&.hr?
  end

  def create?
    user&.hr?
  end
end
