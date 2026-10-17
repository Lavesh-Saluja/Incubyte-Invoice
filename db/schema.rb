# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_10_17_172316) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "employees", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.bigserial "employee_number", null: false
    t.string "employee_code", null: false
    t.string "first_name", limit: 100, null: false
    t.string "last_name", limit: 100, null: false
    t.string "email", null: false
    t.string "department", null: false
    t.string "job_title", null: false
    t.string "country", null: false
    t.string "status", default: "active", null: false
    t.datetime "notice_period_started_at"
    t.datetime "notice_period_ends_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index "lower((email)::text)", name: "index_employees_on_lower_email", unique: true
    t.index ["employee_code"], name: "index_employees_on_employee_code", unique: true
    t.index ["employee_number"], name: "index_employees_on_employee_number", unique: true
    t.index ["status"], name: "index_employees_on_status"
    t.check_constraint "status::text = ANY (ARRAY['active'::character varying, 'notice_period'::character varying, 'inactive'::character varying]::text[])", name: "employees_status_allowed"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", limit: 100, null: false
    t.string "email", null: false
    t.string "role", default: "hr", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index "lower((email)::text)", name: "index_users_on_lower_email", unique: true
    t.check_constraint "role::text = 'hr'::text", name: "users_role_allowed"
  end
end
