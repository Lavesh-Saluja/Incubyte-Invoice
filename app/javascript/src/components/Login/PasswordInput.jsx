import { Eye, EyeOff, Lock } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'

const PasswordInput = (props) => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const Icon = visible ? EyeOff : Eye

  return (
    <div className="relative">
      <Lock
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type={visible ? 'text' : 'password'}
        autoComplete="current-password"
        className="px-9"
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground"
        onClick={() => setVisible((current) => !current)}
        aria-label={t(visible ? 'login.hidePassword' : 'login.showPassword')}
        aria-pressed={visible}
      >
        <Icon />
      </Button>
    </div>
  )
}

export default PasswordInput
