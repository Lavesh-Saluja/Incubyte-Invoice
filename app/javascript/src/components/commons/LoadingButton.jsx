import { Loader2 } from 'lucide-react'
import { cn } from 'cn'
import { Button } from 'components/ui/button'

const LoadingButton = ({
  loading = false,
  disabled,
  className,
  children,
  ...props
}) => (
  <Button
    disabled={disabled || loading}
    aria-busy={loading}
    className={cn('relative', className)}
    {...props}
  >
    <span
      className={cn('inline-flex items-center gap-2', loading && 'invisible')}
    >
      {children}
    </span>
    {loading && (
      <Loader2 aria-hidden="true" className="absolute animate-spin" />
    )}
  </Button>
)

export default LoadingButton
