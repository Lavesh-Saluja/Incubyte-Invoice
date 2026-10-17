const FullPageStatus = ({ children }) => (
  <p
    role="status"
    className="flex min-h-svh items-center justify-center text-muted-foreground"
  >
    {children}
  </p>
)

export default FullPageStatus
