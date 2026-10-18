import { HTTP_METHODS } from 'constants/api'
import { apiRoutes } from 'routes'
import { buildUrl } from 'utils/url'
import { apiRequest } from './client'

const list = ({ page, perPage }, { signal } = {}) => {
  const query = new URLSearchParams({ page, per_page: perPage })
  return apiRequest(`${apiRoutes.employees.index}?${query}`, { signal })
}

const show = async (id, { signal } = {}) => {
  const { employee } = await apiRequest(
    buildUrl(apiRoutes.employees.show, { id }),
    { signal },
  )
  return employee
}

const create = async (payload) => {
  const { employee } = await apiRequest(apiRoutes.employees.index, {
    method: HTTP_METHODS.POST,
    body: { employee: payload },
  })
  return employee
}

const update = async ({ id, payload }) => {
  const { employee } = await apiRequest(
    buildUrl(apiRoutes.employees.show, { id }),
    { method: HTTP_METHODS.PATCH, body: { employee: payload } },
  )
  return employee
}

const startNoticePeriod = async ({ id, days }) => {
  const { employee } = await apiRequest(
    buildUrl(apiRoutes.employees.noticePeriod, { id }),
    { method: HTTP_METHODS.POST, body: { notice_period: { days } } },
  )
  return employee
}

const removeNoticePeriod = async (id) => {
  const { employee } = await apiRequest(
    buildUrl(apiRoutes.employees.noticePeriod, { id }),
    { method: HTTP_METHODS.DELETE },
  )
  return employee
}

const employeesApi = {
  list,
  show,
  create,
  update,
  startNoticePeriod,
  removeNoticePeriod,
}

export default employeesApi
