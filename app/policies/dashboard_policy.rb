class DashboardPolicy < ApplicationPolicy
  def show?
    user&.hr?
  end
end
