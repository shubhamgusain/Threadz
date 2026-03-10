"use client";

import { useEffect, useState, use } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Center, useGLTF, Environment, ContactShadows } from "@react-three/drei";
import { Box, Ruler, ShoppingCart, PenTool } from "lucide-react";
import { useDispatch } from "react-redux";
import { addItem } from "@/store/features/cartSlice";
import { useRouter } from "next/navigation";

// The 3D Component
// Since we don't have a real GLTF model available locally, we will use a basic geometric placeholder 
// styled as a simplified 'shirt/torso' for the viewer demonstration.
function PlaceholderGarment({ color }: { color: string }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Torso */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.2, 1.5, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.8, 0.9, 0]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0.8, 0.9, 0]} rotation={[0, 0, -0.3]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}


export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const dispatch = useDispatch();
  const router = useRouter();
  
  const [product, setProduct] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#1a1a1a");
  const [selectedSize, setSelectedSize] = useState<string>("M");

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/products/${unwrappedParams.id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedColor(data.variants[0].color_hex);
          setSelectedSize(data.variants[0].size);
        }
      });
  }, [unwrappedParams.id]);

  if (!product) {
    return <div className="p-20 text-center">Loading product details...</div>;
  }

  // Derive unique colors and sizes from variants
  const uniqueColors = Array.from(
    new Map(product.variants.map((v: any) => [v.color_hex, v])).values()
  ) as any[];

  const uniqueSizes = Array.from(new Set(product.variants.map((v: any) => v.size))) as string[];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* 3D Viewer Area */}
        <div className="bg-slate-100 rounded-3xl h-[600px] border border-slate-200 relative overflow-hidden flex flex-col">
          <div className="absolute top-6 left-6 z-10 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm text-sm font-bold text-slate-700 flex items-center">
            <Box className="w-4 h-4 mr-2 text-indigo-500" />
            Interactive 3D Preview
          </div>
          
          <div className="flex-1 w-full relative">
            <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
              
              <Center>
                <PlaceholderGarment color={selectedColor} />
              </Center>
              
              <Environment preset="city" />
              <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={10} blur={2} far={4} />
              <OrbitControls enablePan={true} enableZoom={true} minDistance={2} maxDistance={6} />
            </Canvas>
          </div>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm text-xs font-medium text-slate-500">
            Drag to rotate • Scroll to zoom
          </div>
        </div>

        {/* Product Details Area */}
        <div className="flex flex-col py-4">
          <div className="mb-2 text-sm font-bold tracking-wider text-indigo-600 uppercase">
            {product.category}
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{product.name}</h1>
          <div className="text-2xl font-bold text-slate-900 mb-6">
            ${(product.base_price / 100).toFixed(2)}
          </div>
          
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Fabric</div>
              <div className="font-medium text-slate-900">{product.fabric_composition}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Weight</div>
              <div className="font-medium text-slate-900">{product.gsm} GSM</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 col-span-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Fit Type</div>
              <div className="font-medium text-slate-900 capitalize">{product.fit_type}</div>
            </div>
          </div>

          <hr className="border-slate-200 mb-8" />

          {/* Color Selection */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
              Color <span className="text-slate-500 font-medium">Selected: {uniqueColors.find(c => c.color_hex === selectedColor)?.color_name}</span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {uniqueColors.map((color) => (
                <button
                  key={color.color_hex}
                  onClick={() => setSelectedColor(color.color_hex)}
                  className={`w-12 h-12 rounded-full border-2 transition-all ${
                    selectedColor === color.color_hex ? "border-indigo-600 scale-110 shadow-md" : "border-transparent shadow-sm hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.color_hex }}
                  title={color.color_name}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-10">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
              Size
              <button className="text-indigo-600 font-medium flex items-center hover:underline">
                <Ruler className="w-4 h-4 mr-1" /> Size Guide
              </button>
            </h3>
            <div className="flex flex-wrap gap-3">
              {uniqueSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[3rem] h-12 px-4 rounded-xl font-bold text-sm border transition-all ${
                    selectedSize === size 
                      ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => {
                const variant = product.variants.find((v: any) => v.color_hex === selectedColor && v.size === selectedSize);
                if (!variant) return alert("Variant out of stock or unavailable");
                
                dispatch(addItem({
                  id: `${variant.variant_id}-blank`,
                  variant_id: variant.variant_id,
                  product_id: product.product_id,
                  product_name: product.name,
                  color_name: variant.color_name,
                  color_hex: variant.color_hex,
                  size: variant.size,
                  quantity: 1,
                  unit_price: product.base_price + variant.price_adjustment
                }));
                router.push('/cart');
              }}
              className="flex-1 h-14 bg-white border-2 border-slate-200 text-slate-800 font-bold text-lg rounded-2xl shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add Blank
            </button>
            <button 
              onClick={() => router.push('/upload')}
              className="flex-1 h-14 bg-indigo-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center"
            >
              <PenTool className="w-5 h-5 mr-2" />
              Customize
            </button>
          </div>
          <p className="text-center text-sm text-slate-500 mt-4 font-medium">
            3-5 business days average production time
          </p>

        </div>
      </div>
    </div>
  );
}
