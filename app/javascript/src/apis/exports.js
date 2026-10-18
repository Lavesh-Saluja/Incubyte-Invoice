import { API_BASE_URL, HTTP_METHODS } from 'constants/api'
import { apiRoutes } from 'routes'
import { buildUrl } from 'utils/url'
import { apiRequest } from './client'

const list = async ({ signal } = {}) => {
  const { exports } = await apiRequest(apiRoutes.exports.index, { signal })
  return exports
}

const create = async (filters) => {
  const { export: created } = await apiRequest(apiRoutes.exports.index, {
    method: HTTP_METHODS.POST,
    body: { export: { filters } },
  })
  return created
}

const downloadUrl = (id) =>
  `${API_BASE_URL}${buildUrl(apiRoutes.exports.download, { id })}`

const exportsApi = { list, create, downloadUrl }

export default exportsApi
