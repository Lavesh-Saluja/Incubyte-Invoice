import { DAY_IN_MS } from 'components/Employees/constants'
import { routes } from 'routes'
import { withQuery } from 'utils/url'

export const employeesLink = (filters) =>
  Object.keys(filters).length === 0
    ? routes.employees.index
    : withQuery(routes.employees.index, filters)

const startOfDay = (value) => {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

export const calendarDaysUntil = (value, from) =>
  Math.max(0, Math.round((startOfDay(value) - startOfDay(from)) / DAY_IN_MS))
