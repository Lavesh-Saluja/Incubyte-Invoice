import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import 'common/i18n'

// The version footer on every page calls the health check; tests opt in to other answers.
vi.mock('apis/health', () => ({
  default: { live: vi.fn(() => Promise.resolve({ status: 'ok' })) },
}))

// Signed out by default; tests sign in with vi.mocked(sessionApi.current).mockResolvedValue(user).
vi.mock('apis/session', () => ({
  default: {
    current: vi.fn(() => Promise.resolve(null)),
    login: vi.fn(),
    logout: vi.fn(() => Promise.resolve()),
  },
}))

afterEach(() => cleanup())
