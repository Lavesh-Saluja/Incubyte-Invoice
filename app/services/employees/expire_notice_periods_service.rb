module Employees
  class ExpireNoticePeriodsService
    def process!
      Employee.with_expired_notice_period.update_all(status: Employee.statuses[:inactive], updated_at: Time.current)
    end
  end
end
