import { Download } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import employeeImportsApi from 'apis/employeeImports'
import LoadingButton from 'components/commons/LoadingButton'
import { IMPORT_TEMPLATE_FILENAME } from 'constants/employeeImports'
import { getErrorMessage } from 'utils/errors'
import { saveFile } from 'utils/saveFile'

const TemplateButton = () => {
  const { t } = useTranslation()
  const [downloading, setDownloading] = useState(false)

  const downloadTemplate = async () => {
    setDownloading(true)
    try {
      saveFile(await employeeImportsApi.template(), IMPORT_TEMPLATE_FILENAME)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setDownloading(false)
    }
  }

  return (
    <LoadingButton
      variant="outline"
      onClick={downloadTemplate}
      loading={downloading}
    >
      <Download />
      {t('employeeImport.prepare.template')}
    </LoadingButton>
  )
}

export default TemplateButton
