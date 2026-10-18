module Employees
  class SeedService
    EMAIL_DOMAIN = "seed.acme.test"
    BATCH_SIZE = 1_000
    RANDOM_SEED = 10_000
    HISTORY_YEARS = 6
    NOTICE_DAYS = [ 30, 45, 60, 90 ].freeze
    MIN_TENURE_DAYS = 60

    COUNTRIES = {
      "IN" => { weight: 35, ctc: 500_000..4_500_000, pf_percent: 12 },
      "US" => { weight: 18, ctc: 60_000..240_000, pf_percent: 5 },
      "GB" => { weight: 9, ctc: 35_000..140_000, pf_percent: 5 },
      "DE" => { weight: 8, ctc: 45_000..150_000, pf_percent: 9 },
      "SG" => { weight: 6, ctc: 50_000..220_000, pf_percent: 17 },
      "AE" => { weight: 5, ctc: 120_000..700_000, pf_percent: 0 },
      "CA" => { weight: 5, ctc: 60_000..190_000, pf_percent: 5 },
      "AU" => { weight: 5, ctc: 70_000..210_000, pf_percent: 11 },
      "JP" => { weight: 4, ctc: 4_500_000..16_000_000, pf_percent: 9 },
      "BR" => { weight: 5, ctc: 70_000..420_000, pf_percent: 8 }
    }.freeze

    DEPARTMENTS = {
      "Engineering" => { weight: 30, pay_percent: 125, titles: [ "Software Engineer", "Senior Software Engineer", "Staff Engineer", "QA Engineer", "Engineering Manager" ] },
      "Sales" => { weight: 18, pay_percent: 100, titles: [ "Sales Development Representative", "Account Executive", "Sales Manager" ] },
      "Customer Support" => { weight: 14, pay_percent: 70, titles: [ "Support Specialist", "Senior Support Specialist", "Support Team Lead" ] },
      "Operations" => { weight: 12, pay_percent: 85, titles: [ "Operations Analyst", "Operations Manager", "Facilities Coordinator" ] },
      "Marketing" => { weight: 10, pay_percent: 95, titles: [ "Marketing Specialist", "Content Strategist", "Marketing Manager" ] },
      "Finance" => { weight: 8, pay_percent: 105, titles: [ "Accountant", "Financial Analyst", "Finance Manager" ] },
      "HR" => { weight: 5, pay_percent: 90, titles: [ "HR Generalist", "Recruiter", "HR Business Partner" ] },
      "Legal" => { weight: 3, pay_percent: 130, titles: [ "Legal Counsel", "Compliance Officer" ] }
    }.freeze

    FIRST_NAMES = %w[
      Aarav Aditi Ananya Arjun Diya Ishaan Kavya Meera Priya Rohan Sanjay Vikram
      James Emily Michael Sarah David Olivia Daniel Grace Ethan Chloe Noah Ava
      Lukas Hannah Felix Lena Oliver Amelia Liam Sophie Mateo Camila Lucas Beatriz
      Wei Mei Jun Hana Haruto Yui Kenji Sakura Omar Aisha Yusuf Fatima
    ].freeze

    LAST_NAMES = %w[
      Sharma Patel Iyer Reddy Gupta Nair Singh Mehta Smith Johnson Williams Brown
      Taylor Wilson Clarke Evans Müller Schmidt Fischer Weber Tan Lim Ng Wong
      Sato Suzuki Tanaka Watanabe Silva Santos Oliveira Costa Khan Hassan Rahman Ali
      Martin Roy Lee Chen
    ].freeze

    attr_reader :count, :random

    def initialize(count: 10_000, random: Random.new(RANDOM_SEED))
      @count = count
      @random = random
    end

    def process!
      existing = seeded.count
      missing = count - existing
      return 0 unless missing.positive?

      departments = DEPARTMENTS.keys.index_with { |name| find_or_create_department(name) }
      first_index = existing + 1

      Employee.transaction do
        Employee.next_employee_numbers(missing).each_slice(BATCH_SIZE).with_index do |numbers, batch|
          rows = numbers.each_with_index.map do |number, offset|
            build_row(number, first_index + (batch * BATCH_SIZE) + offset, departments)
          end
          insert(rows)
        end
      end
      missing
    end

    private
      def seeded
        Employee.where("email LIKE ?", "%@#{EMAIL_DOMAIN}")
      end

      def find_or_create_department(name)
        Department.where("lower(name) = ?", name.downcase).first || Department.create!(name:)
      end

      def build_row(number, index, departments)
        country = pick(COUNTRIES)
        department = pick(DEPARTMENTS)
        joined_at = random.rand(HISTORY_YEARS * 365).days.ago.change(hour: 9)
        first_name, last_name = FIRST_NAMES.sample(random:), LAST_NAMES.sample(random:)

        employee = {
          employee_number: number,
          employee_code: Employee.code_for(number, year: joined_at.year),
          first_name:,
          last_name:,
          email: "#{first_name}.#{last_name}.#{index}@#{EMAIL_DOMAIN}".unicode_normalize(:nfkd).encode("ASCII", undef: :replace, replace: "").downcase,
          job_title: DEPARTMENTS[department][:titles].sample(random:),
          department_id: departments[department].id,
          country:,
          created_at: joined_at,
          updated_at: joined_at
        }.merge(lifecycle(joined_at))

        { employee:, salary: salary(country, department, joined_at, employee[:notice_period_ends_at]) }
      end

      def lifecycle(joined_at)
        roll = random.rand
        tenure_days = (Date.current - joined_at.to_date).to_i
        return active if roll < 0.86 || tenure_days < MIN_TENURE_DAYS

        if roll < 0.93
          started_at = random.rand(0..25).days.ago
          { status: "notice_period", notice_period_started_at: started_at,
            notice_period_ends_at: started_at + NOTICE_DAYS.sample(random:).days }
        else
          ends_at = random.rand(1..(tenure_days - NOTICE_DAYS.first)).days.ago
          { status: "inactive", notice_period_started_at: ends_at - NOTICE_DAYS.first.days, notice_period_ends_at: ends_at }
        end
      end

      def active
        { status: "active", notice_period_started_at: nil, notice_period_ends_at: nil }
      end

      def salary(country, department, joined_at, left_at)
        ctc = BigDecimal(random.rand(COUNTRIES[country][:ctc]) * DEPARTMENTS[department][:pay_percent] / 100).round(-3)
        base = (ctc * random.rand(55..70) / 100).round(2)
        pf = (base * COUNTRIES[country][:pf_percent] / 100).round(2)
        last_change = [ left_at&.to_date, Date.current ].compact.min

        {
          currency: Employee::COUNTRIES.fetch(country).currency_code,
          annual_ctc: ctc,
          annual_base_pay: base,
          annual_pf: pf,
          annual_other_components: ctc - base - pf,
          effective_from: random.rand(joined_at.to_date..last_change)
        }
      end

      def pick(options)
        target = random.rand(options.sum { |_, option| option[:weight] })
        options.each do |key, option|
          return key if (target -= option[:weight]).negative?
        end
      end

      def insert(rows)
        ids = Employee.insert_all!(rows.pluck(:employee), returning: %w[id employee_number])
          .to_a.to_h { |inserted| [ inserted["employee_number"], inserted["id"] ] }

        Salary.insert_all!(rows.map { |row| row[:salary].merge(employee_id: ids.fetch(row[:employee][:employee_number])) })
      end
  end
end
