require "test_helper"

class EmployeeImportPolicyTest < ActiveSupport::TestCase
  test "lets only signed-in HR users download the template, preview and import" do
    hr = EmployeeImportPolicy.new(create(:user), :employee_import)
    guest = EmployeeImportPolicy.new(nil, :employee_import)

    assert [ hr.template?, hr.preview?, hr.create? ].all?
    assert_not [ guest.template?, guest.preview?, guest.create? ].any?
  end
end
