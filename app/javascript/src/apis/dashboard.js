import { apiRoutes } from 'routes'
import { apiRequest } from './client'

const show = async ({ signal } = {}) => {
  const { dashboard } = await apiRequest(apiRoutes.dashboard, { signal })
  return dashboard
}

const dashboardApi = { show }

export default dashboardApi
