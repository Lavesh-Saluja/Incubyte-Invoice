import { t } from 'i18next'

export const exportTitle = ({ filters }) => {
  const parts = [
    filters.status && t(`employees.status.${filters.status}`),
    filters.department,
    filters.country,
    filters.q && t('exports.searchLabel', { q: filters.q }),
  ].filter(Boolean)

  return parts.length > 0 ? parts.join(' · ') : t('exports.allEmployees')
}
