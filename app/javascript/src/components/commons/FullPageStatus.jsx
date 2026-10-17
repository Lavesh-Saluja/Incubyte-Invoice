// Centered status message for whole-page states such as checking the session.
const FullPageStatus = ({ children }) => (
  <p
    role="status"
    className="flex min-h-svh items-center justify-center text-muted-foreground"
  >
    {children}
  </p>
)

export default FullPageStatus
