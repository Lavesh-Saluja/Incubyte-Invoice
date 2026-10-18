import { HTTP_METHODS } from 'constants/api'
import { apiRoutes } from 'routes'
import { apiRequest } from './client'

const list = async ({ signal } = {}) => {
  const { departments } = await apiRequest(apiRoutes.departments, { signal })
  return departments
}

const create = async ({ name }) => {
  const { department } = await apiRequest(apiRoutes.departments, {
    method: HTTP_METHODS.POST,
    body: { department: { name } },
  })
  return department
}

const departmentsApi = { list, create }

export default departmentsApi
