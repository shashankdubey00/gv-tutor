export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex flex-col items-center justify-center">
      <div className="relative">
        {/* Outer spinning ring - Cyan */}
        <div className="w-24 h-24 border-4 border-cyan-500/20 rounded-full"></div>
        
        {/* Middle spinning ring - Cyan */}
        <div 
          className="absolute top-0 left-0 w-24 h-24 border-4 border-transparent border-t-cyan-500 border-r-cyan-500 rounded-full animate-spin"
          style={{ animationDuration: '1s' }}
        ></div>
        
        {/* Inner spinning ring - Green (reverse) */}
        <div 
          className="absolute top-2 left-2 w-20 h-20 border-4 border-transparent border-t-green-500 border-l-green-500 rounded-full animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
        ></div>
        
        {/* Center pulsing dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full animate-pulse shadow-lg shadow-cyan-500/50"></div>
      </div>
      
      {/* Loading text with fade animation */}
      <div className="mt-8">
        <p className="text-white/80 text-base font-medium animate-pulse">
          Loading...
        </p>
      </div>
      
      {/* Optional: Animated dots */}
      <div className="flex gap-2 mt-4">
        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
}

