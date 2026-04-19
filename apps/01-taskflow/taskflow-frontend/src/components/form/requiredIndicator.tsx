export default function RequiredIndicator() {
  return (
    <>
      <span aria-hidden="true" className="text-destructive">
        *
      </span>
      <span className="sr-only">required</span>
    </>
  )
}
