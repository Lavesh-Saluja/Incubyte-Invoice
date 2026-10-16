require "test_helper"

class SampleItemTest < ActiveSupport::TestCase
  test "is valid with a name and optional description" do
    assert build(:sample_item).valid?
    assert build(:sample_item, :without_description).valid?
  end

  test "requires a name" do
    item = build(:sample_item, name: nil)

    assert_not item.valid?
    assert_includes item.errors[:name], "can't be blank"
  end

  test "rejects a whitespace-only name" do
    item = build(:sample_item, name: "   ")

    assert_not item.valid?
    assert_includes item.errors[:name], "can't be blank"
  end

  test "strips surrounding whitespace from the name" do
    assert_equal "Mug", build(:sample_item, name: "  Mug  ").name
  end

  test "defaults quantity to 1" do
    assert_equal 1, SampleItem.new.quantity
  end

  test "requires quantity to be a whole number from 0 to the maximum" do
    assert build(:sample_item, quantity: 0).valid?
    assert build(:sample_item, quantity: SampleItem::MAX_QUANTITY).valid?

    [ -1, SampleItem::MAX_QUANTITY + 1, 1.5, nil ].each do |quantity|
      assert_not build(:sample_item, quantity:).valid?, "#{quantity.inspect} should be invalid"
    end
  end

  test "limits name and description length" do
    item = build(:sample_item, name: "a" * 101, description: "b" * 1001)

    assert_not item.valid?
    assert_includes item.errors[:name], "is too long (maximum is 100 characters)"
    assert_includes item.errors[:description], "is too long (maximum is 1000 characters)"
  end
end
