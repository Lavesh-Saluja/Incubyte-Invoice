json.settings do
  json.notice_period_days @notice_period_days
  json.notice_period_max_days Employee::NOTICE_PERIOD_MAX_DAYS
end
