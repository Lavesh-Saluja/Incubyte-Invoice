// buildUrl('/employees/:id', { id: 5 }) => '/employees/5'
export const buildUrl = (route, params = {}) =>
  route.replace(/:(\w+)/g, (placeholder, key) =>
    key in params ? encodeURIComponent(params[key]) : placeholder,
  )
