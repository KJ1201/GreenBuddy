import React, { useState, useRef } from 'react';
import { Camera, X, CheckCircle, Loader2 } from 'lucide-react';
import { Button, Badge } from './ui';
import { cn } from '../../src/lib/utils';

interface ImageUploadProps {
    onUpload: (file: File) => void;
    isVerifying?: boolean;
    isVerified?: boolean;
    isFailed?: boolean;
    className?: string;
}

export default function ImageUpload({ onUpload, isVerifying, isVerified, isFailed, className }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            onUpload(file);
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const clearImage = () => {
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className={cn("w-full", className)}>
            {!preview ? (
                <div
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                        "w-full h-full min-h-[160px] rounded-2xl border-2 border-dashed border-black/20 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 text-center p-4 gap-3",
                        isDragging ? "bg-pastel-blue/20 scale-[1.02] border-pastel-blue" : "bg-gray-50 hover:bg-gray-100 hover:border-black/40",
                        className
                    )}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                        className="hidden"
                        accept="image/*"
                    />
                    <div className="w-12 h-12 rounded-xl bg-white border-2 border-black/10 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <Camera className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                        <p className="text-sm font-black uppercase tracking-wide text-gray-700">Snap Photo</p>
                        <p className="text-[10px] font-medium text-gray-400 mt-1 leading-tight px-2">Click or drag to verify</p>
                    </div>
                </div>
            ) : (
                <div className={cn("relative w-full h-full min-h-[160px] rounded-2xl border-2 border-black/10 overflow-hidden bg-black flex items-center justify-center", className)}>
                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />

                    {/* Overlay for state */}
                    {isVerifying && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white z-10">
                            <Loader2 className="w-12 h-12 animate-spin mb-4" />
                            <p className="text-xl font-bold">AI Verification in Progress...</p>
                            <p className="text-sm opacity-80 text-center px-8">Google Gemini is analyzing the component type and condition</p>
                        </div>
                    )}

                    {isVerified && (
                        <div className="absolute inset-0 bg-green-500/20 flex flex-col items-center justify-center z-10">
                            <div className="bg-white rounded-full p-2 mb-2 animate-bounce">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <Badge variant="black" className="text-lg">AI VERIFIED</Badge>
                        </div>
                    )}

                    {isFailed && (
                        <div className="absolute inset-0 bg-red-500/20 flex flex-col items-center justify-center z-10">
                            <div className="bg-white rounded-full p-2 mb-2">
                                <X className="w-10 h-10 text-red-500" />
                            </div>
                            <Badge variant="coral" className="text-lg">MISMATCH DETECTED</Badge>
                        </div>
                    )}

                    {/* Controls */}
                    <div className="absolute top-4 right-4 flex gap-2 z-20">
                        <Button
                            variant="icon"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                clearImage();
                            }}
                            className="bg-white hover:bg-red-50"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
