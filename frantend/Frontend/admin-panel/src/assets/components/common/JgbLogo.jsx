export default function JgbLogo({ className = 'h-10', variant = 'light' }) {
  const isLight = variant === 'light' // for dark backgrounds (white text)
  
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official JGB Logo Image */}
      <img
        src="/images/jgb-logo.jpg"
        alt="JGB Trading Private Limited"
        className="h-11 w-11 shrink-0 rounded-xl object-contain bg-white shadow-md border border-slate-700/40"
      />

      {/* Typography */}
      <div className="flex flex-col justify-center leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`text-xl font-black tracking-wider ${isLight ? 'text-white' : 'text-blue-950'}`}>
            JGB TRADING
          </span>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isLight ? 'text-orange-400' : 'text-orange-600'}`}>
          PRIVATE LIMITED
        </span>
      </div>
    </div>
  )
}
