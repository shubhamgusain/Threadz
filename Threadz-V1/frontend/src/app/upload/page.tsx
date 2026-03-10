"use client";

import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { Upload, Save, X, RotateCw, RefreshCw } from "lucide-react";

export default function UploadPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [designName, setDesignName] = useState("My Custom Design");

  useEffect(() => {
    if (canvasRef.current && !fabricCanvas) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 400,
        height: 500,
        backgroundColor: "#f8fafc"
      });
      setFabricCanvas(canvas);
      
      // Load a dummy t-shirt mockup outline (just a rect for now to simulate print area)
      const printArea = new fabric.Rect({
        width: 250,
        height: 350,
        fill: "transparent",
        stroke: "#cbd5e1",
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        left: 75,
        top: 75
      });
      canvas.add(printArea);
      
      return () => {
        canvas.dispose();
      };
    }
  }, [canvasRef, fabricCanvas]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = (f) => {
      const data = f.target?.result;
      fabric.Image.fromURL(data as string).then((img) => {
        img.scaleToWidth(200);
        img.set({
          left: 100,
          top: 150,
        });
        fabricCanvas.add(img);
        fabricCanvas.setActiveObject(img);
        fabricCanvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    const objects = fabricCanvas.getObjects();
    // Remove everything EXCEPT the print area mockup (first object)
    if (objects.length > 1) {
       for (let i = 1; i < objects.length; i++) {
           fabricCanvas.remove(objects[i]);
       }
    }
  };

  const saveDesign = async () => {
    if (!fabricCanvas) return;
    setIsUploading(true);
    
    // Extact data url of only the design content (for actual implementation we might extract just the selection)
    // For now we'll send the whole canvas as a dataURL and convert to blob
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
    });
    
    try {
      const response = await fetch(dataURL);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append("file", blob, "design.png");
      formData.append("design_name", designName);
      formData.append("is_public", "true");
      
      // We will proxy this to the backend we built earlier
      const res = await fetch("http://localhost:8000/api/v1/designs/upload", {
        method: "POST",
        body: formData,
      });
      
      if (res.ok) {
        alert("Design uploaded successfully!");
      } else {
        alert("Upload failed.");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Upload & Customize Design</h1>
        <p className="text-slate-500 mt-2">Upload your artwork, resize and position it in the print area.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Editor Tools */}
        <div className="md:col-span-1 space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Design Name</label>
            <input 
              type="text" 
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-medium text-slate-700 mb-4">Actions</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-center w-full h-12 px-4 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                <Upload className="w-5 h-5 mr-2 text-slate-500" />
                <span className="text-sm font-medium text-slate-600">Choose Image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>

              <button 
                onClick={clearCanvas}
                className="flex items-center justify-center w-full h-10 px-4 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
              >
                <X className="w-4 h-4 mr-2" /> Clear Canvas
              </button>

              <button 
                onClick={saveDesign}
                disabled={isUploading}
                className="flex items-center justify-center w-full h-10 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {isUploading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {isUploading ? "Saving..." : "Save Design"}
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="md:col-span-2 flex justify-center bg-slate-100 rounded-2xl p-8 border border-slate-200">
          <div className="relative shadow-md rounded-lg overflow-hidden bg-white">
            <canvas ref={canvasRef} />
          </div>
        </div>
        
      </div>
    </div>
  );
}
