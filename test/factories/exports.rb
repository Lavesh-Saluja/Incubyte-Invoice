FactoryBot.define do
  factory :export do
    user
    filters { {} }

    trait :processing do
      status { :processing }
      total_rows { 1000 }
      processed_rows { 500 }
    end

    trait :completed do
      status { :completed }
      total_rows { 2 }
      processed_rows { 2 }
      completed_at { Time.current }
      after(:create) do |export|
        create(:export_file, export:)
      end
    end
  end

  factory :export_file do
    export
    content { "Employee code\nINC-1\n" }
    content_type { "text/csv" }
    byte_size { content.bytesize }
  end
end
