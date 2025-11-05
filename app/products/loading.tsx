export default function LoadingProducts() {
  return (
    <div className="container-responsive py-10">
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-ink-100" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="aspect-square w-full animate-pulse bg-ink-100" />
            <div className="p-4">
              <div className="h-5 w-2/3 animate-pulse rounded bg-ink-100" />
              <div className="mt-3 h-9 w-full animate-pulse rounded-xl bg-ink-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


