import React, { useState, useRef } from 'react';
import { Upload, X, Star, Image as ImageIcon, Link as LinkIcon, Plus, Loader2, Sparkles } from 'lucide-react';
import { api } from '../lib/api';

interface MultiImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
  helperText?: string;
}

export const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
  images = [],
  onChange,
  maxImages = 6,
  label = 'Product Photos (Add 2-3 or more photos)',
  helperText = 'Upload direct pictures from your phone/PC or paste image URLs. First image is the main cover.',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).slice(0, maxImages - images.length);
    if (fileArray.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    const uploadedUrls: string[] = [];

    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) {
        continue;
      }

      // Check file size (cap at 10MB per image)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`File ${file.name} is larger than 10MB.`);
        continue;
      }

      try {
        // Read file as Base64 Data URL
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Upload to server
        const res = await api.uploadImage(base64Data, file.name);
        if (res && res.url) {
          uploadedUrls.push(res.url);
        } else {
          uploadedUrls.push(base64Data);
        }
      } catch (err: any) {
        console.error('Image upload failed:', err);
        // Fallback: use the base64 string directly
        try {
          const fallbackBase64 = await new Promise<string>((resolve) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result as string);
            r.readAsDataURL(file);
          });
          uploadedUrls.push(fallbackBase64);
        } catch {
          setUploadError('Failed to process image file.');
        }
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...images, ...uploadedUrls]);
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (index: number) => {
    const next = [...images];
    next.splice(index, 1);
    onChange(next);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    const [selected] = next.splice(index, 1);
    next.unshift(selected);
    onChange(next);
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    if (images.length >= maxImages) {
      setUploadError(`Maximum ${maxImages} photos allowed.`);
      return;
    }
    onChange([...images, urlInput.trim()]);
    setUrlInput('');
    setShowUrlModal(false);
  };

  const sampleFootwearPresets = [
    { label: 'Sports Red/Black', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
    { label: 'Casual White Sneaker', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80' },
    { label: 'Suede Driving Loafers', url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80' },
    { label: 'Comfort Clogs / Crocks', url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80' },
    { label: 'Formal Leather Derby', url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80' },
    { label: 'Girls Floral Glitter', url: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=800&q=80' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold text-slate-900">{label}</label>
          <p className="text-[11px] text-slate-500">{helperText}</p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
          {images.length} / {maxImages} Photos
        </span>
      </div>

      {uploadError && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center justify-between">
          <span>{uploadError}</span>
          <button onClick={() => setUploadError(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Grid of uploaded images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((imgUrl, idx) => (
          <div
            key={idx}
            className={`group relative aspect-square rounded-2xl overflow-hidden border-2 bg-slate-100 shadow-xs transition-all ${
              idx === 0 ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <img
              src={imgUrl}
              alt={`Photo ${idx + 1}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex items-center gap-1">
              {idx === 0 ? (
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                  <Star className="w-3 h-3 fill-slate-950" />
                  <span>Main Cover</span>
                </span>
              ) : (
                <span className="bg-slate-900/80 backdrop-blur-2xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  #{idx + 1}
                </span>
              )}
            </div>

            {/* Hover Actions Bar */}
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
                  title="Delete Photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {idx !== 0 && (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(idx)}
                  className="w-full py-1 px-2 rounded-lg bg-white/90 hover:bg-white text-slate-900 text-[10px] font-bold flex items-center justify-center gap-1 shadow-xs transition-colors"
                >
                  <Star className="w-3 h-3 text-amber-500" />
                  <span>Make Main Cover</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Upload Button Box if below max images */}
        {images.length < maxImages && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/40 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFiles(e.target.files);
                }
              }}
            />

            {isUploading ? (
              <div className="flex flex-col items-center space-y-2 text-amber-600">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-[11px] font-bold">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-1.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-amber-700">
                  Upload Photo {images.length + 1}
                </span>
                <span className="text-[10px] text-slate-500">
                  Tap / Drag & Drop
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Bar (Add via URL, presets, or clear all) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload From Device</span>
          </button>

          <button
            type="button"
            onClick={() => setShowUrlModal(!showUrlModal)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Add by Web Link</span>
          </button>
        </div>

        {images.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[11px] font-semibold text-rose-600 hover:underline"
          >
            Clear All Photos
          </button>
        )}
      </div>

      {/* URL Input Form Dropdown */}
      {showUrlModal && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste direct image link (e.g. https://...)"
              className="flex-1 px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            <button
              type="button"
              onClick={handleAddUrl}
              disabled={!urlInput.trim()}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-50"
            >
              Add Link
            </button>
            <button
              type="button"
              onClick={() => setShowUrlModal(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Or pick sample footwear photo:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sampleFootwearPresets.map((preset, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => {
                    if (images.length < maxImages) {
                      onChange([...images, preset.url]);
                      setShowUrlModal(false);
                    }
                  }}
                  className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 hover:border-amber-500 text-[10px] font-medium text-slate-700 flex items-center gap-1"
                >
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const SingleImageUploader: React.FC<{
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
}> = ({
  value,
  onChange,
  label = 'Category / Brand Image',
  helperText = 'Upload a high quality photo or paste direct image URL',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrl, setShowUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    setIsUploading(true);
    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await api.uploadImage(base64Data, file.name);
      if (res && res.url) {
        onChange(res.url);
      } else {
        onChange(base64Data);
      }
    } catch (e) {
      console.error(e);
      // Fallback direct base64
      const reader = new FileReader();
      reader.onload = () => onChange(reader.result as string);
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-900">{label}</label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[11px] text-rose-600 hover:underline"
          >
            Remove
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-500 bg-slate-100 shrink-0">
            <img
              src={value}
              alt="Uploaded"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
            <ImageIcon className="w-6 h-6" />
          </div>
        )}

        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs"
            >
              {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{isUploading ? 'Uploading...' : 'Direct Photo Upload'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowUrl(!showUrl)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Link URL</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-500">{helperText}</p>
        </div>
      </div>

      {showUrl && (
        <div className="flex items-center gap-2 pt-1">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste image link..."
            className="flex-1 px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs"
          />
          <button
            type="button"
            onClick={() => {
              if (urlInput.trim()) {
                onChange(urlInput.trim());
                setUrlInput('');
                setShowUrl(false);
              }
            }}
            className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};
