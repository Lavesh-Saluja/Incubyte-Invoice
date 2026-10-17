import { HTTP_METHODS, HTTP_STATUS } from 'constants/api'
import { apiRoutes } from 'routes'
import { ApiError, apiRequest } from './client'

// The session is an HttpOnly cookie set by Rails; the browser sends it automatically.

// The signed-in user, or null when nobody is signed in (401).
const current = async ({ signal } = {}) => {
  try {
    const { user } = await apiRequest(apiRoutes.session, { signal })
    return user
  } catch (error) {
    if (error instanceof ApiError && error.status === HTTP_STATUS.UNAUTHORIZED)
      return null
    throw error
  }
}

const login = async ({ email, password }) => {
  const { user } = await apiRequest(apiRoutes.session, {
    method: HTTP_METHODS.POST,
    body: { session: { email, password } },
  })
  return user
}

const logout = () =>
  apiRequest(apiRoutes.session, { method: HTTP_METHODS.DELETE })

const sessionApi = { current, login, logout }

export default sessionApi
