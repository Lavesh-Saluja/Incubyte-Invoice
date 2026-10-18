import { Loader2 } from 'lucide-react'
import { cn } from 'cn'

const Spinner = ({ label, className }) => (
  <div
    role="status"
    className={cn('flex items-center justify-center py-16', className)}
  >
    <Loader2 aria-hidden="true" className="size-8 animate-spin text-primary" />
    <span className="sr-only">{label}</span>
  </div>
)

export default Spinner
