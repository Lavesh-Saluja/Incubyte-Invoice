import { t } from 'i18next'
import { describe, expect, it } from 'vitest'
import {
  DESCRIPTION_MAX_LENGTH,
  NAME_MAX_LENGTH,
  QUANTITY_MAX,
  QUANTITY_MIN,
} from './constants'
import { toPayload, validateSampleItem } from './utils'

describe('validateSampleItem', () => {
  it('accepts a name with an optional description', () => {
    expect(
      validateSampleItem({ name: 'Lamp', description: '', quantity: '1' }),
    ).toEqual({})
  })

  it('requires a non-blank name', () => {
    expect(
      validateSampleItem({ name: '   ', description: '', quantity: '1' }),
    ).toEqual({
      name: [t('sampleItems.validation.nameRequired')],
    })
  })

  it('enforces the length limits', () => {
    const errors = validateSampleItem({
      name: 'a'.repeat(NAME_MAX_LENGTH + 1),
      description: 'b'.repeat(DESCRIPTION_MAX_LENGTH + 1),
      quantity: '1',
    })

    expect(Object.keys(errors)).toEqual(['name', 'description'])
  })

  it.each(['', '-1', '1.5', 'abc', String(QUANTITY_MAX + 1)])(
    'rejects the quantity %j',
    (quantity) => {
      expect(
        validateSampleItem({ name: 'Lamp', description: '', quantity }),
      ).toEqual({
        quantity: [
          t('sampleItems.validation.quantityInvalid', {
            min: QUANTITY_MIN,
            max: QUANTITY_MAX,
          }),
        ],
      })
    },
  )

  it.each([String(QUANTITY_MIN), String(QUANTITY_MAX)])(
    'accepts the boundary quantity %s',
    (quantity) => {
      expect(
        validateSampleItem({ name: 'Lamp', description: '', quantity }),
      ).toEqual({})
    },
  )
})

describe('toPayload', () => {
  it('trims values, sends a blank description as null and a numeric quantity', () => {
    expect(
      toPayload({ name: '  Lamp ', description: '  ', quantity: ' 3 ' }),
    ).toEqual({
      name: 'Lamp',
      description: null,
      quantity: 3,
    })
  })
})
