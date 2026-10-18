import { DATE_FORMAT } from 'constants'

const dateFormatter = new Intl.DateTimeFormat(undefined, DATE_FORMAT)

export const formatDate = (value) => dateFormatter.format(new Date(value))
