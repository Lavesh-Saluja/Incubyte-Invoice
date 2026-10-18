class PaySummaryPolicy < ApplicationPolicy
  def show?
    user&.hr?
  end
end
