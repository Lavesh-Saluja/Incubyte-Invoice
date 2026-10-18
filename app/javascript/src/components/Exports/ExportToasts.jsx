import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useCreateExport, useFetchExports } from 'hooks/reactQuery/useExports'
import { getErrorMessage } from 'utils/errors'
import {
  downloadExport,
  forgetStartedHere,
  isActiveExport,
  markStartedHere,
  wasStartedHere,
} from 'utils/exports'
import {
  DOWNLOAD_PHASES,
  DOWNLOADED_TOAST_DURATION_MS,
  toastId,
} from './constants'
import ExportToast from './ExportToast'

const ExportToasts = () => {
  const { data: items = [] } = useFetchExports()
  const { mutate: createExport } = useCreateExport()
  const shown = useRef(new Set())
  const downloads = useRef(new Map())

  useEffect(() => {
    const retry = (item) =>
      createExport(item.filter_values, {
        onSuccess: (created) => markStartedHere(created.id),
        onError: (error) => toast.error(getErrorMessage(error)),
      })

    const show = (item) => {
      const id = toastId(item.id)
      const download = downloads.current.get(item.id)
      toast.custom(
        () => (
          <ExportToast
            item={item}
            download={download}
            onDownload={() => startDownload(item)}
            onDismiss={() => toast.dismiss(id)}
            onRetry={() => {
              toast.dismiss(id)
              retry(item)
            }}
          />
        ),
        {
          id,
          unstyled: true,
          duration:
            download === DOWNLOAD_PHASES.done
              ? DOWNLOADED_TOAST_DURATION_MS
              : Infinity,
        },
      )
    }

    const startDownload = async (item) => {
      if (downloads.current.get(item.id) === DOWNLOAD_PHASES.pending) return

      downloads.current.set(item.id, DOWNLOAD_PHASES.pending)
      show(item)
      try {
        await downloadExport(item)
        downloads.current.set(item.id, DOWNLOAD_PHASES.done)
      } catch (error) {
        downloads.current.delete(item.id)
        toast.error(getErrorMessage(error))
      }
      if (shown.current.has(item.id)) show(item)
    }

    items.forEach((item) => {
      const tracked = isActiveExport(item) || shown.current.has(item.id)

      if (item.status === 'cancelled') {
        toast.dismiss(toastId(item.id))
        shown.current.delete(item.id)
        return
      }
      if (!tracked) return

      shown.current.add(item.id)
      if (item.status === 'failed') forgetStartedHere(item.id)
      if (item.status === 'completed' && wasStartedHere(item.id)) {
        forgetStartedHere(item.id)
        startDownload(item)
        return
      }
      if (downloads.current.get(item.id) !== DOWNLOAD_PHASES.pending) show(item)
    })
  }, [items, createExport])

  return null
}

export default ExportToasts
