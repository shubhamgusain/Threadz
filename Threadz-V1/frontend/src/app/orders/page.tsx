"use client";

import { useEffect, useState } from "react";
import { Package, Truck, CheckCircle2, Factory } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/orders/my-orders")
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center">
           <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
           <h3 className="text-xl font-bold text-slate-700">No orders yet</h3>
           <p className="text-slate-500 mt-2">When you purchase custom garments, you can track their status here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, idx) => (
            <div key={order.order_id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
               <div className="flex-1">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Order #{order.order_id.split('-')[0].toUpperCase()}</h3>
                      <p className="text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString()} • {order.items.length} items</p>
                    </div>
                    <div className="text-right">
                       <span className="text-lg font-bold text-indigo-600">${(order.total_amount / 100).toFixed(2)}</span>
                       <span className={`block text-xs font-bold uppercase tracking-wider mt-1 px-3 py-1 rounded-full ${
                         order.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                       }`}>
                         {order.status}
                       </span>
                    </div>
                 </div>

                 {/* Status Stepper Tracker */}
                 <div className="mt-8 pt-6 border-t border-slate-100 hidden sm:block">
                    <div className="flex justify-between items-center px-4 relative">
                       {/* Line connecting milestones */}
                       <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-200 -translate-y-1/2 rounded-full -z-10" />
                       <div className="absolute top-1/2 left-8 h-1 bg-indigo-500 -translate-y-1/2 rounded-full -z-10 transition-all duration-1000" style={{ width: order.status === 'Paid' ? '25%' : '0%' }} />

                       <div className="flex flex-col items-center gap-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm border-4 border-white ${order.status !== 'Pending' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}><CheckCircle2 className="w-5 h-5"/></div>
                          <span className="text-xs font-bold text-slate-700">Order Placed</span>
                       </div>
                       <div className="flex flex-col items-center gap-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm border-4 border-white ${['Processing', 'Shipped', 'Delivered'].includes(order.status) ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}><Factory className="w-5 h-5"/></div>
                          <span className="text-xs font-bold text-slate-500">Processing</span>
                       </div>
                       <div className="flex flex-col items-center gap-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm border-4 border-white ${['Shipped', 'Delivered'].includes(order.status) ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}><Truck className="w-5 h-5"/></div>
                          <span className="text-xs font-bold text-slate-500">Shipped</span>
                       </div>
                       <div className="flex flex-col items-center gap-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm border-4 border-white ${['Delivered'].includes(order.status) ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}><Package className="w-5 h-5"/></div>
                          <span className="text-xs font-bold text-slate-500">Delivered</span>
                       </div>
                    </div>
                 </div>

               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
