"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Menu } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Mobile menu panel */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <h2 className="text-xl font-bold text-indigo-600">Threadz</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          <Link
            href="/upload"
            onClick={onClose}
            className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-white/50 hover:text-indigo-600 transition-all duration-200 font-medium"
          >
            Upload Design
          </Link>
          <Link
            href="/explore"
            onClick={onClose}
            className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-white/50 hover:text-indigo-600 transition-all duration-200 font-medium"
          >
            Explore
          </Link>
          <Link
            href="/generate"
            onClick={onClose}
            className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-white/50 hover:text-indigo-600 transition-all duration-200 font-medium"
          >
            AI Generation
          </Link>
        </nav>
      </div>
    </>
  );
}
