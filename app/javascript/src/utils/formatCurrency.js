export const formatCurrency = (amount, currency) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(
    Number(amount),
  )
