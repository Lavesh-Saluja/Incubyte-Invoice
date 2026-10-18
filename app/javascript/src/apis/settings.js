import { apiRoutes } from 'routes'
import { apiRequest } from './client'

const show = async ({ signal } = {}) => {
  const { settings } = await apiRequest(apiRoutes.settings, { signal })
  return settings
}

const settingsApi = { show }

export default settingsApi
