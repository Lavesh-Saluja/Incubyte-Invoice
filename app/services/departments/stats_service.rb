module Departments
  class StatsService
    attr_reader :scope

    def initialize(scope)
      @scope = scope
    end

    def process!
      counts = Employee.where(department: scope).group(:department_id, :status).count

      scope.map { |department|
        active, notice_period, inactive = %w[active notice_period inactive].map do |status|
          counts.fetch([ department.id, status ], 0)
        end
        { id: department.id, name: department.name, active:, notice_period:, inactive:, current: active + notice_period }
      }.sort_by { |row| [ -row[:current], row[:name].downcase ] }
    end
  end
end
