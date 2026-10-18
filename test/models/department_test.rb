require "test_helper"

class DepartmentTest < ActiveSupport::TestCase
  def errors_for(department, attribute)
    department.validate
    department.errors[attribute]
  end

  test "is valid with a name" do
    assert build(:department).valid?
  end

  test "uses a UUID primary key" do
    assert_match(/\A\h{8}-\h{4}-\h{4}-\h{4}-\h{12}\z/, create(:department).id)
  end

  test "requires a name of at most 100 characters" do
    assert_includes errors_for(build(:department, name: "  "), :name), "can't be blank"
    assert_includes errors_for(build(:department, name: "a" * 101), :name), "is too long (maximum is 100 characters)"
  end

  test "trims the name and collapses repeated spaces" do
    assert_equal "Sales Operations", create(:department, name: "  Sales   Operations ").name
  end

  test "rejects a name already used in any case" do
    create(:department, name: "Finance")

    assert_includes errors_for(build(:department, name: " finance "), :name), "has already been taken"
  end

  test "the database rejects duplicate names that bypass the model" do
    create(:department, name: "Finance")

    assert_raises(ActiveRecord::RecordNotUnique) do
      Department.insert_all!([ { name: "FINANCE" } ])
    end
  end

  test "has many employees" do
    department = create(:department)
    employees = create_list(:employee, 2, department:)

    assert_equal employees.sort_by(&:id), department.employees.sort_by(&:id)
  end

  test "cannot be deleted while it has employees" do
    department = create(:employee).department

    assert_not department.destroy
    assert_includes department.errors[:base], "Cannot delete record because dependent employees exist"
  end
end
