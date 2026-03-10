"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/features/authSlice";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const cartQuantity = useSelector((state: RootState) => state.cart.totalQuantity);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-indigo-600">
            Threadz
          </Link>
          <div className="hidden md:flex gap-4">
            <Link href="/upload" className="font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Upload Design
            </Link>
            <Link href="/explore" className="font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Explore
            </Link>
            <Link href="/generate" className="font-medium text-slate-600 hover:text-slate-900 transition-colors">
              AI Generation
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-2 text-slate-600 hover:text-indigo-600 transition">
             <ShoppingCart className="w-5 h-5" />
             {cartQuantity > 0 && (
               <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-indigo-600 rounded-full">
                 {cartQuantity}
               </span>
             )}
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-700">Hey, {user?.full_name}</span>
              <button 
                onClick={() => dispatch(logout())}
                className="text-sm font-medium text-red-600 hover:text-red-700 transition"
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
      </div>
    </nav>
  );
}
