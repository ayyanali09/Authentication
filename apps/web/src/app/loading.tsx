export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-deep-black px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-electric-blue via-purple-accent to-yellow-accent" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase text-white/52">
          Loading DURON
        </p>
      </div>
    </div>
  );
}
