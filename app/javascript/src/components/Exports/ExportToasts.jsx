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
import { DOWNLOADED_TOAST_DURATION_MS, toastId } from './constants'
import ExportToast from './ExportToast'

const ExportToasts = () => {
  const { data: items = [] } = useFetchExports()
  const { mutate: createExport } = useCreateExport()
  const shown = useRef(new Set())
  const downloaded = useRef(new Set())

  useEffect(() => {
    const retry = (item) =>
      createExport(item.filter_values, {
        onSuccess: (created) => markStartedHere(created.id),
        onError: (error) => toast.error(getErrorMessage(error)),
      })

    items.forEach((item) => {
      const id = toastId(item.id)
      const tracked = isActiveExport(item) || shown.current.has(item.id)

      if (item.status === 'cancelled') {
        toast.dismiss(id)
        shown.current.delete(item.id)
        return
      }
      if (!tracked) return

      shown.current.add(item.id)
      if (item.status === 'completed' && wasStartedHere(item.id)) {
        forgetStartedHere(item.id)
        downloaded.current.add(item.id)
        downloadExport(item.id)
      }
      if (item.status === 'failed') forgetStartedHere(item.id)

      const autoDownloaded = downloaded.current.has(item.id)
      toast.custom(
        () => (
          <ExportToast
            item={item}
            autoDownloaded={autoDownloaded}
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
          duration: autoDownloaded ? DOWNLOADED_TOAST_DURATION_MS : Infinity,
        },
      )
    })
  }, [items, createExport])

  return null
}

export default ExportToasts
