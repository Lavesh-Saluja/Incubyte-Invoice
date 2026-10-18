import { routes } from 'routes'
import { withQuery } from 'utils/url'

export const employeesLink = (filters) =>
  Object.keys(filters).length === 0
    ? routes.employees.index
    : withQuery(routes.employees.index, filters)
