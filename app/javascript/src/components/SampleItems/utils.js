import { t } from 'i18next'
import {
  DESCRIPTION_MAX_LENGTH,
  INITIAL_FORM_VALUES,
  NAME_MAX_LENGTH,
  QUANTITY_MAX,
  QUANTITY_MIN,
  WHOLE_NUMBER_PATTERN,
} from './constants'

export const toFormValues = (item) =>
  item
    ? {
        name: item.name,
        description: item.description ?? '',
        quantity: String(item.quantity),
      }
    : INITIAL_FORM_VALUES

export const toPayload = ({ name, description, quantity }) => ({
  name: name.trim(),
  description: description.trim() || null,
  quantity: Number(quantity.trim()),
})

const isValidQuantity = (quantity) => {
  const trimmed = quantity.trim()
  if (!WHOLE_NUMBER_PATTERN.test(trimmed)) return false

  const value = Number(trimmed)
  return value >= QUANTITY_MIN && value <= QUANTITY_MAX
}

export const validateSampleItem = ({ name, description, quantity }) => {
  const errors = {}
  const trimmedName = name.trim()

  if (!trimmedName) {
    errors.name = [t('sampleItems.validation.nameRequired')]
  } else if (trimmedName.length > NAME_MAX_LENGTH) {
    errors.name = [
      t('sampleItems.validation.nameTooLong', { count: NAME_MAX_LENGTH }),
    ]
  }

  if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = [
      t('sampleItems.validation.descriptionTooLong', {
        count: DESCRIPTION_MAX_LENGTH,
      }),
    ]
  }

  if (!isValidQuantity(quantity)) {
    errors.quantity = [
      t('sampleItems.validation.quantityInvalid', {
        min: QUANTITY_MIN,
        max: QUANTITY_MAX,
      }),
    ]
  }

  return errors
}

export const hasErrors = (errors) => Object.keys(errors).length > 0

export const errorId = (fieldId) => `${fieldId}-error`
