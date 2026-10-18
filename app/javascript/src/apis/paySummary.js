import { apiRoutes } from 'routes'
import { withQuery } from 'utils/url'
import { apiRequest } from './client'

const show = async ({ country } = {}, { signal } = {}) => {
  const path = country
    ? withQuery(apiRoutes.paySummary, { country })
    : apiRoutes.paySummary
  const { pay_summary: summary } = await apiRequest(path, { signal })
  return summary
}

const paySummaryApi = { show }

export default paySummaryApi
