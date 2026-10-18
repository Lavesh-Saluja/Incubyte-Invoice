import { CURRENCY_LOCALES } from 'constants'

const formatter = (currency, options = {}) =>
  new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  })

export const formatCurrency = (amount, currency, options) =>
  formatter(currency, options).format(Number(amount))

export const currencySymbol = (currency) =>
  formatter(currency)
    .formatToParts(0)
    .find(({ type }) => type === 'currency')?.value ?? currency
