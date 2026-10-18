import exportsApi from 'apis/exports'
import { ACTIVE_EXPORT_STATUSES } from 'constants/exports'

const startedHere = new Set()

export const markStartedHere = (id) => startedHere.add(id)

export const wasStartedHere = (id) => startedHere.has(id)

export const forgetStartedHere = (id) => startedHere.delete(id)

export const isActiveExport = ({ status }) =>
  ACTIVE_EXPORT_STATUSES.includes(status)

export const downloadExport = (id) => {
  const link = document.createElement('a')
  link.href = exportsApi.downloadUrl(id)
  link.download = ''
  document.body.append(link)
  link.click()
  link.remove()
}
