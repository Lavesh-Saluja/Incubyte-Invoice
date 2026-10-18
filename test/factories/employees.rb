FactoryBot.define do
  factory :employee do
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    sequence(:email) { |n| "employee#{n}@acme.test" }
    department
    job_title { Faker::Job.title }
    country { %w[IN DE US SG].sample }

    trait :on_notice do
      status { :notice_period }
      notice_period_started_at { Time.current }
      notice_period_ends_at { 1.month.from_now }
    end

    trait :with_salary do
      after(:create) { |employee| create(:salary, employee:) }
    end

    trait :inactive do
      status { :inactive }
    end
  end
end
