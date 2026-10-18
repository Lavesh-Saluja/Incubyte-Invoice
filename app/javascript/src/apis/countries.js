import { apiRoutes } from 'routes'
import { apiRequest } from './client'

const list = async ({ signal } = {}) => {
  const { countries } = await apiRequest(apiRoutes.countries, { signal })
  return countries
}

const countriesApi = { list }

export default countriesApi
