import { apiRoutes } from 'routes'
import { apiRequest } from './client'

const countries = async ({ inUse = false } = {}, { signal } = {}) => {
  const query = inUse ? `?${new URLSearchParams({ in_use: true })}` : ''
  const { countries: list } = await apiRequest(
    `${apiRoutes.selectOptions.countries}${query}`,
    { signal },
  )
  return list
}

const departments = async ({ signal } = {}) => {
  const { departments: list } = await apiRequest(
    apiRoutes.selectOptions.departments,
    { signal },
  )
  return list
}

const selectOptionsApi = { countries, departments }

export default selectOptionsApi
