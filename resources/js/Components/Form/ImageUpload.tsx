import { useRef, useState, useEffect } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import InputLabel from '@/Components/Form/InputLabel';
import axios from 'axios';
import heic2any from 'heic2any';

interface ImageUploadProps {
    label?: React.ReactNode;
    image: File | string | null;
    onChange: (file: File | string | null) => void;
    error?: string;
    className?: string;
}

export default function ImageUpload({
    label = 'Gambar',
    image,
    onChange,
    error,
    className,
}: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        typeof image === 'string'
            ? image.startsWith('http') || image.startsWith('/storage/')
                ? image
                : '/storage/' + image
            : image
              ? URL.createObjectURL(image)
              : null,
    );

    useEffect(() => {
        if (typeof image === 'string') {
            if (image.startsWith('http') || image.startsWith('/storage/')) {
                setPreviewUrl(image);
            } else {
                setPreviewUrl('/storage/' + image);
            }
        } else if (image) {
            const url = URL.createObjectURL(image);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [image]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            updateImage(file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            updateImage(file);
        }
    };

    const [isUploading, setIsUploading] = useState(false);

    const updateImage = async (file: File) => {
        setIsUploading(true);

        try {
            let fileToUpload = file;

            // Check if it's HEIC/HEIF
            if (
                file.type === 'image/heic' ||
                file.type === 'image/heif' ||
                file.name.toLowerCase().endsWith('.heic') ||
                file.name.toLowerCase().endsWith('.heif')
            ) {
                const converted = await heic2any({
                    blob: file,
                    toType: 'image/jpeg',
                    quality: 0.8,
                });
                const blob = Array.isArray(converted)
                    ? converted[0]
                    : converted;
                fileToUpload = new File(
                    [blob],
                    file.name.replace(/\.hei[cf]$/i, '.jpg'),
                    { type: 'image/jpeg' },
                );
            }

            // Show temporary local preview instantly
            const localPreview = URL.createObjectURL(fileToUpload);
            setPreviewUrl(localPreview);

            const formData = new FormData();
            formData.append('image', fileToUpload);

            const response = await axios.post('/upload-temp-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Send the storage path to the parent form, but use the URL for preview
            onChange(response.data.path);
            setPreviewUrl(response.data.url);
        } catch (err) {
            console.error('Failed to upload temp image:', err);
            setPreviewUrl(null);
            onChange(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering the container click
        onChange(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={className}>
            {label && (
                <InputLabel
                    value={label}
                    className="mb-2 text-sm font-bold text-slate-700"
                />
            )}

            {!previewUrl ? (
                <label
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                        'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 text-center transition-all duration-200',
                        isDragging
                            ? 'border-[#ef5350] bg-red-50'
                            : 'border-slate-300 bg-slate-50 hover:bg-slate-100',
                    )}
                >
                    <div className="flex flex-col items-center justify-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                            <Upload className="h-6 w-6 text-slate-400" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-700">
                                Upload gambar produk
                            </p>
                            <p className="text-sm text-slate-400">
                                Bisa ambil foto atau pilih dari galeri
                            </p>
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </label>
            ) : (
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className={cn(
                            'h-auto max-h-[200px] w-full object-contain transition-opacity',
                            isUploading ? 'opacity-50' : 'opacity-100',
                        )}
                    />

                    {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-8 w-8 animate-spin text-[#ef5350]" />
                                <span className="text-sm font-medium text-slate-700">
                                    Mengunggah...
                                </span>
                            </div>
                        </div>
                    )}

                    {/* X Button at Top Right */}
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-transform hover:scale-110 hover:bg-red-600 focus:outline-none"
                        title="Hapus gambar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            )}

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
