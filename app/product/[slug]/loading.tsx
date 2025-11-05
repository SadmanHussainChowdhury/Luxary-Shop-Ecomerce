export default function LoadingProduct() {
  return (
    <div className="container-responsive py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="aspect-[4/3] w-full animate-pulse bg-ink-100" />
        </div>
        <div>
          <div className="h-8 w-2/3 animate-pulse rounded bg-ink-100" />
          <div className="mt-3 h-4 w-full animate-pulse rounded bg-ink-100" />
          <div className="mt-3 h-4 w-5/6 animate-pulse rounded bg-ink-100" />
          <div className="mt-6 h-10 w-32 animate-pulse rounded bg-ink-100" />
        </div>
      </div>
    </div>
  )
}


