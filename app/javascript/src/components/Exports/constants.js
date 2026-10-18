export const EXPORT_STATUS_STYLES = {
  queued: 'bg-muted text-muted-foreground ring-border',
  processing: 'bg-accent text-accent-foreground ring-primary/20',
  completed: 'bg-success-surface text-success ring-success/20',
  failed: 'bg-destructive-surface text-destructive ring-destructive/20',
  cancelled: 'bg-muted text-muted-foreground ring-border',
}

export const toastId = (id) => `export-${id}`

export const DOWNLOADED_TOAST_DURATION_MS = 6000

export const DOWNLOAD_PHASES = { pending: 'pending', done: 'done' }
