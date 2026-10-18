require "test_helper"

class ExportPolicyTest < ActiveSupport::TestCase
  test "lets HR users list and create exports, and only the owner view or download one" do
    owner = create(:user)
    export = create(:export, user: owner)

    assert ExportPolicy.new(owner, Export).index?
    assert ExportPolicy.new(owner, Export).create?
    assert ExportPolicy.new(owner, export).show?
    assert ExportPolicy.new(owner, export).download?
    assert_not ExportPolicy.new(create(:user), export).download?
    assert_not ExportPolicy.new(nil, export).show?
  end

  test "scopes users to their own exports" do
    mine = create(:export)
    create(:export)

    assert_equal [ mine ], ExportPolicy::Scope.new(mine.user, Export).resolve.to_a
    assert_empty ExportPolicy::Scope.new(nil, Export).resolve
  end
end
