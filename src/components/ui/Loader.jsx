export default function Loader({ size = 'md', text = 'Loading...' }) {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative">
        <div className={`${sizes[size]} rounded-full border-2 border-[#1F7A8C]/20 border-t-[#1F7A8C] animate-spin`} />
        <div className={`absolute inset-1 rounded-full border-2 border-[#BFDBF7]/20 border-b-[#BFDBF7] animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </div>
      {text && <p className="text-sm text-[#BFDBF7]/50 animate-pulse">{text}</p>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-[#022B3A] flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="w-20 h-20 rounded-full border-2 border-[#1F7A8C]/20 border-t-[#1F7A8C] animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-[#BFDBF7]/20 border-b-[#BFDBF7] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl">🩸</span>
          </div>
        </div>
        <p className="text-[#BFDBF7]/60 text-sm font-medium">BloodLink</p>
        <p className="text-[#BFDBF7]/30 text-xs mt-1">Loading...</p>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-[#033A4E]/60 border border-[#1F7A8C]/10 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#1F7A8C]/20 shimmer" />
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-[#1F7A8C]/20 rounded-lg shimmer w-3/4" />
          <div className="h-3 bg-[#1F7A8C]/10 rounded-lg shimmer w-1/2" />
          <div className="h-3 bg-[#1F7A8C]/10 rounded-lg shimmer w-2/3" />
        </div>
      </div>
    </div>
  );
}
