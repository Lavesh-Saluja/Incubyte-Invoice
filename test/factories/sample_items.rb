FactoryBot.define do
  factory :sample_item do
    name { Faker::Commerce.product_name }
    description { Faker::Lorem.sentence }
    quantity { Faker::Number.between(from: 1, to: 20) }

    trait :without_description do
      description { nil }
    end
  end
end
