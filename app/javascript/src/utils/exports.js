import exportsApi from 'apis/exports'
import { ACTIVE_EXPORT_STATUSES } from 'constants/exports'

const startedHere = new Set()

export const markStartedHere = (id) => startedHere.add(id)

export const wasStartedHere = (id) => startedHere.has(id)

export const forgetStartedHere = (id) => startedHere.delete(id)

export const isActiveExport = ({ status }) =>
  ACTIVE_EXPORT_STATUSES.includes(status)

export const downloadExport = async ({ id, filename }) => {
  const blob = await exportsApi.download(id)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url))
}
