import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden text-center px-4 py-16">
      
      {/* Decorative gradient background circles */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-indigo-200/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-pink-200/50 blur-3xl pointer-events-none" />

      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm z-10">
        Create Your Own <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">Fashion</span>
      </h1>
      <p className="max-w-[42rem] leading-normal text-slate-600 sm:text-xl sm:leading-8 mb-10 z-10">
        Upload your design, explore community creations, or describe your vision and let our AI bring it to life on premium garments.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-16 z-10 w-full sm:w-auto">
        <Link href="/upload" className="inline-flex h-12 items-center justify-center rounded-full bg-indigo-600 px-8 text-sm font-medium text-white shadow hover:bg-indigo-700 transition-colors">
          Start Designing Now
        </Link>
        <Link href="/explore" className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-8 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-100 hover:text-slate-900 transition-colors">
          Explore Designs
        </Link>
      </div>
      
      {/* Three Pathways Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full z-10 mt-10">
        <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 text-xl">🎨</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Design</h3>
          <p className="text-slate-500 text-sm">Have your own artwork? Upload it in seconds and preview it on any garment.</p>
        </div>
        <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 text-xl">🌍</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Explore Community</h3>
          <p className="text-slate-500 text-sm">Discover trending styles and graphics made by other creators from around the world.</p>
        </div>
        <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 text-xl z-10">✨</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 z-10">AI Generation</h3>
          <span className="absolute top-2 right-2 bg-gradient-to-r from-amber-200 to-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm z-10">PREMIUM</span>
          <p className="text-slate-500 text-sm z-10">Describe what you want to see, and let Stable Diffusion AI generate unique, breathtaking prints.</p>
        </div>
      </div>
    </div>
  );
}
