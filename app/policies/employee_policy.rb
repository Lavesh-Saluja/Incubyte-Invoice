class EmployeePolicy < ApplicationPolicy
  def index?
    user&.hr?
  end

  def show?
    user&.hr?
  end

  def create?
    user&.hr?
  end

  def update?
    user&.hr?
  end

  def start_notice_period?
    user&.hr?
  end

  def remove_notice_period?
    user&.hr?
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      user&.hr? ? scope.all : scope.none
    end
  end
end
