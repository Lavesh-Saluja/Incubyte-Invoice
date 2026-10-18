class DepartmentPolicy < ApplicationPolicy
  def index?
    user&.hr?
  end

  def create?
    user&.hr?
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      user&.hr? ? scope.all : scope.none
    end
  end
end
