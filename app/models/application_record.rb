class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  # UUID primary keys are random, so `first`/`last` order by creation time instead.
  self.implicit_order_column = :created_at
end
