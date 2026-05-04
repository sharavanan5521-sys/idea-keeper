/**
 * Full-screen loading state while Firebase Auth initializes.
 */
export function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 text-gray-400">
      <div
        className="h-10 w-10 rounded-full border-2 border-gray-700 border-t-purple-500 animate-spin"
        aria-hidden
      />
      <p className="text-sm">{message}</p>
    </div>
  )
}
