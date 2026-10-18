// Every page path and API endpoint lives here. Never hard-code a path elsewhere;
// build concrete URLs with buildUrl from utils/url.

export const routes = {
  root: '/',
  login: '/login',
  departments: {
    index: '/departments',
  },
  exports: {
    index: '/exports',
  },
  pay: {
    index: '/pay',
  },
  employees: {
    index: '/employees',
    new: '/employees/new',
    import: '/employees/import',
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
  employeeImports: {
    create: '/api/employee_imports',
    preview: '/api/employee_imports/preview',
    template: '/api/employee_imports/template',
  },
  settings: '/api/settings',
  dashboard: '/api/dashboard',
  paySummary: '/api/pay_summary',
  departments: '/api/departments',
  exports: {
    index: '/api/exports',
    show: '/api/exports/:id',
    download: '/api/exports/:id/download',
  },
  selectOptions: {
    countries: '/api/select_options/countries',
    departments: '/api/select_options/departments',
  },
}
