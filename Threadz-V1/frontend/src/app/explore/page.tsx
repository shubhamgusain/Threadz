"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Search, Filter } from "lucide-react";

interface Design {
  design_id: string;
  design_name: string;
  image_url: string;
  tags: string | null;
}

export default function ExplorePage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/designs/explore")
      .then((res) => res.json())
      .then((data) => {
        setDesigns(data.designs);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch explore designs", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Explore Community Designs</h1>
          <p className="text-slate-500 mt-2">Discover and print trending designs created by the Threadz community.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search concepts..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            />
          </div>
          <button className="flex items-center justify-center h-10 px-4 border border-slate-200 rounded-full bg-white hover:bg-slate-50 transition-colors text-slate-700 font-medium text-sm">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : designs.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-lg font-medium text-slate-900">No designs found</h3>
          <p className="text-slate-500 mt-1">Be the first to upload a public design!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {designs.map((design) => (
            <div key={design.design_id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="aspect-square relative bg-slate-100 overflow-hidden">
                {/* Fallback pattern if we can't load the real image locally easily via Next.js next/image without domain configs */}
                <img 
                  src={`http://localhost:8000${design.image_url}`} 
                  alt={design.design_name} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                   <button className="bg-white text-indigo-900 font-bold py-2 px-6 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all">
                     Use This Design
                   </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 truncate">{design.design_name}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {design.tags?.split(',').map(tag => (
                    <span key={tag} className="text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-500 px-2 py-1 rounded-sm">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
