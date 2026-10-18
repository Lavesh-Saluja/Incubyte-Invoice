// Every page path and API endpoint lives here. Never hard-code a path elsewhere;
// build concrete URLs with buildUrl from utils/url.

export const routes = {
  root: '/',
  login: '/login',
  departments: {
    index: '/departments',
  },
  employees: {
    index: '/employees',
    new: '/employees/new',
    show: '/employees/:id',
    edit: '/employees/:id/edit',
  },
  notFound: '*',
}

export const apiRoutes = {
  health: {
    live: '/api/health/live',
  },
  session: '/api/session',
  employees: {
    index: '/api/employees',
    show: '/api/employees/:id',
    noticePeriod: '/api/employees/:id/notice_period',
  },
  settings: '/api/settings',
  dashboard: '/api/dashboard',
  departments: '/api/departments',
  selectOptions: {
    countries: '/api/select_options/countries',
    departments: '/api/select_options/departments',
  },
}
