import { HTTP_METHODS } from 'constants/api'
import { apiRoutes } from 'routes'
import { buildUrl } from 'utils/url'
import { apiFileRequest, apiRequest } from './client'

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

const download = (id) =>
  apiFileRequest(buildUrl(apiRoutes.exports.download, { id }))

const exportsApi = { list, create, download }

export default exportsApi
