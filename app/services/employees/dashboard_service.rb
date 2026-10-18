module Employees
  class DashboardService
    LEAVING_SOON_DAYS = 10
    TOP_DEPARTMENTS = 10

    Dashboard = Data.define(:counts, :departments, :upcoming_departures)

    attr_reader :scope

    def initialize(scope)
      @scope = scope
    end

    def process!
      ExpireNoticePeriodsService.new.process!

      Dashboard.new(counts:, departments:, upcoming_departures:)
    end

    private
      def counts
        by_status = scope.group(:status).count
        active = by_status.fetch("active", 0)
        notice_period = by_status.fetch("notice_period", 0)

        {
          current_headcount: active + notice_period,
          active:,
          notice_period:,
          inactive: by_status.fetch("inactive", 0),
          leaving_soon: leaving_soon.count
        }
      end

      def departments
        Departments::StatsService.new(Department.all).process!
          .select { |row| row[:current].positive? }
          .first(TOP_DEPARTMENTS)
      end

      def upcoming_departures
        leaving_soon.includes(:department).order(:notice_period_ends_at, :employee_number)
      end

      def leaving_soon
        scope.notice_period.where(notice_period_ends_at: Time.current..LEAVING_SOON_DAYS.days.from_now)
      end
  end
end
