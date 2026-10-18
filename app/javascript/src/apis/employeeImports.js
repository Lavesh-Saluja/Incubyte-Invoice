import { HTTP_METHODS } from 'constants/api'
import { IMPORT_FILE_FIELD } from 'constants/employeeImports'
import { apiRoutes } from 'routes'
import { apiFileRequest, apiRequest } from './client'

const formWith = (file) => {
  const form = new FormData()
  form.append(IMPORT_FILE_FIELD, file)
  return form
}

const preview = async (file) => {
  const { import: result } = await apiRequest(
    apiRoutes.employeeImports.preview,
    { method: HTTP_METHODS.POST, body: formWith(file) },
  )
  return result
}

const create = async (file) => {
  const { import: result } = await apiRequest(
    apiRoutes.employeeImports.create,
    { method: HTTP_METHODS.POST, body: formWith(file) },
  )
  return result
}

const template = () => apiFileRequest(apiRoutes.employeeImports.template)

const employeeImportsApi = { preview, create, template }

export default employeeImportsApi
