class ConvertEmployeeCountriesToCodes < ActiveRecord::Migration[8.1]
  def up
    select_values("SELECT DISTINCT country FROM employees").each do |name|
      code = (ISO3166::Country[name.strip.upcase] || ISO3166::Country.find_country_by_any_name(name.strip))&.alpha2
      if code
        execute "UPDATE employees SET country = #{quote(code)} WHERE country = #{quote(name)}"
      else
        say "Unknown country #{name.inspect} left unchanged; fix it from the employee form"
      end
    end
  end

  def down
    select_values("SELECT DISTINCT country FROM employees").each do |code|
      name = ISO3166::Country[code]&.common_name
      execute "UPDATE employees SET country = #{quote(name)} WHERE country = #{quote(code)}" if name
    end
  end
end
