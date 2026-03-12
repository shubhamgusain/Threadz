"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { RootState } from "@/store/store";
import { logout } from "@/store/features/authSlice";
import { ShoppingCart, Menu, X } from "lucide-react";
import MobileMenu from "@/components/home/mobile-menu";

export default function Navbar() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const cartQuantity = useSelector((state: RootState) => state.cart.totalQuantity);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/30 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo on the left */}
          <Link href="/" className="text-3xl font-bold tracking-tighter text-indigo-600 hover:text-indigo-700 transition-colors">
            Threadz
          </Link>

          {/* Centered navigation items - Desktop only */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-8">
            <Link href="/upload" className="font-medium text-slate-700 hover:text-indigo-600 transition-colors">
              Upload Design
            </Link>
            <Link href="/explore" className="font-medium text-slate-700 hover:text-indigo-600 transition-colors">
              Explore
            </Link>
            <Link href="/generate" className="font-medium text-slate-700 hover:text-indigo-600 transition-colors">
              AI Generation
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative p-2 text-slate-700 hover:text-indigo-600 transition">
               <ShoppingCart className="w-5 h-5" />
               {cartQuantity > 0 && (
                 <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-indigo-600 rounded-full">
                   {cartQuantity}
                 </span>
               )}
            </Link>
            
            {/* Desktop auth buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700">Hey, {user?.full_name}</span>
                  <button 
                    onClick={() => dispatch(logout())}
                    className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition">
                    Log in
                  </Link>
                  <Link 
                    href="/register" 
                    className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-white/50 transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}
