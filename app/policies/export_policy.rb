class ExportPolicy < ApplicationPolicy
  def index?
    user&.hr?
  end

  def create?
    user&.hr?
  end

  def show?
    owner?
  end

  def download?
    owner?
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      user&.hr? ? scope.where(user:) : scope.none
    end
  end

  private
    def owner?
      user&.hr? && record.user_id == user.id
    end
end
