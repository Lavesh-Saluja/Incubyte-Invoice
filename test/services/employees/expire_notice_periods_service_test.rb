require "test_helper"

class Employees::ExpireNoticePeriodsServiceTest < ActiveSupport::TestCase
  test "makes employees whose notice period has ended inactive and leaves the rest alone" do
    ended = create(:employee, :on_notice, notice_period_started_at: 31.days.ago, notice_period_ends_at: 1.day.ago)
    ongoing = create(:employee, :on_notice)
    active = create(:employee)

    Employees::ExpireNoticePeriodsService.new.process!

    assert ended.reload.inactive?
    assert ongoing.reload.notice_period?
    assert active.reload.active?
  end
end
