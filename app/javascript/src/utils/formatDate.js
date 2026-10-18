import { DATE_FORMAT, DATE_TIME_FORMAT } from 'constants'

const dateFormatter = new Intl.DateTimeFormat(undefined, DATE_FORMAT)

export const formatDate = (value) => dateFormatter.format(new Date(value))

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, DATE_TIME_FORMAT)

export const formatDateTime = (value) =>
  dateTimeFormatter.format(new Date(value))
