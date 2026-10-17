FactoryBot.define do
  factory :user do
    name { Faker::Name.name }
    sequence(:email) { |n| "hr#{n}@acme.test" }
    password { "correct-horse-battery" }
    role { :hr }
  end
end
