import exportsApi from 'apis/exports'
import { ACTIVE_EXPORT_STATUSES } from 'constants/exports'
import { saveFile } from 'utils/saveFile'

const startedHere = new Set()

export const markStartedHere = (id) => startedHere.add(id)

export const wasStartedHere = (id) => startedHere.has(id)

export const forgetStartedHere = (id) => startedHere.delete(id)

export const isActiveExport = ({ status }) =>
  ACTIVE_EXPORT_STATUSES.includes(status)

export const downloadExport = async ({ id, filename }) =>
  saveFile(await exportsApi.download(id), filename)
