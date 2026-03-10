"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { removeItem, clearCart } from "@/store/features/cartSlice";
import Link from "next/link";
import { Trash2, ArrowRight, ShieldCheck, CreditCard } from "lucide-react";

export default function CartPage() {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (cart.items.length === 0) return;
    setIsCheckingOut(true);

    try {
      // 1. Create order on backend
      const res = await fetch("http://localhost:8000/api/v1/orders/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total_amount: cart.totalAmount,
          items: cart.items.map(item => ({
            variant_id: item.variant_id,
            design_id: item.design_id,
            quantity: item.quantity,
            unit_price: item.unit_price
          }))
        })
      });

      if (!res.ok) throw new Error("Failed to create order");
      const order = await res.json();

      // 2. Simulate Razorpay modal UX (delay)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 3. Verify payment signature
      const verifyRes = await fetch(`http://localhost:8000/api/v1/orders/verify?razorpay_order_id=${order.razorpay_order_id}&razorpay_payment_id=pay_mock123&razorpay_signature=pass_mock_sig`, {
        method: "POST"
      });

      if (verifyRes.ok) {
        dispatch(clearCart());
        window.location.href = "/orders";
      } else {
        console.error("Payment verification failed");
      }
    } catch (e) {
      console.error(e);
      alert("Checkout error");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-2xl">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12">
          <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBagIcon className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
          <p className="text-slate-500 mb-8 text-lg">Looks like you haven't added any custom designs to your cart yet.</p>
          <Link href="/products" className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition shadow-lg">
            Start Designing Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-6">
          {cart.items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row bg-white p-6 rounded-3xl border border-slate-200 shadow-sm gap-6 relative group">
               <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => dispatch(removeItem(item.id))} className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded-full">
                    <Trash2 className="w-5 h-5" />
                 </button>
               </div>
               
               <div className="w-full sm:w-32 h-32 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200 flex-shrink-0">
                  {item.design_image_url ? (
                    <img src={`http://localhost:8000${item.design_image_url}`} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                  ) : (
                    <span className="text-sm font-bold text-slate-400">Blank Garment</span>
                  )}
               </div>
               
               <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{item.product_name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4 font-medium">
                     <span className="flex items-center">
                       <span className="w-4 h-4 rounded-full mr-2 border border-slate-200" style={{backgroundColor: item.color_hex}}></span>
                       {item.color_name}
                     </span>
                     <span>Size: <strong className="text-slate-900">{item.size}</strong></span>
                     <span>Qty: <strong className="text-slate-900">{item.quantity}</strong></span>
                  </div>
                  <div className="text-xl font-bold text-indigo-600">
                    ${((item.unit_price * item.quantity) / 100).toFixed(2)}
                  </div>
               </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sticky top-24">
             <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
             
             <div className="space-y-4 mb-6 text-slate-600 font-medium pb-6 border-b border-slate-200">
               <div className="flex justify-between">
                 <span>Subtotal ({cart.totalQuantity} items)</span>
                 <span>${(cart.totalAmount / 100).toFixed(2)}</span>
               </div>
               <div className="flex justify-between">
                 <span>Standard Shipping</span>
                 <span className="text-emerald-600">Free</span>
               </div>
               <div className="flex justify-between">
                 <span>Estimated Tax</span>
                 <span>${(cart.totalAmount * 0.08 / 100).toFixed(2)}</span>
               </div>
             </div>
             
             <div className="flex justify-between items-end mb-8">
               <span className="text-slate-900 font-bold">Total</span>
               <span className="text-3xl font-extrabold text-slate-900">${(cart.totalAmount * 1.08 / 100).toFixed(2)}</span>
             </div>
             
             <button 
               onClick={handleCheckout}
               disabled={isCheckingOut}
               className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center mb-6"
             >
               {isCheckingOut ? "Processing..." : (
                 <>Secure Checkout <ArrowRight className="w-5 h-5 ml-2" /></>
               )}
             </button>
             
             <div className="flex items-center justify-center space-x-6 text-sm font-medium text-slate-500">
                <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1"/> 256-bit secure</span>
                <span className="flex items-center"><CreditCard className="w-4 h-4 mr-1"/> Powered by Razorpay</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShoppingBagIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
