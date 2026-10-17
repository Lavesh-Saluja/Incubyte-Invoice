const numberFormatter = new Intl.NumberFormat()

export const formatNumber = (value) => numberFormatter.format(value)
