import React, { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';

interface GalleryImage {
  id: number;
  url: string;
  title: string;
}

const DEFAULT_IMAGES: GalleryImage[] = [
  { id: -1, url: 'https://picsum.photos/seed/5s1/800/600', title: 'Before: HR Room' },
  { id: -2, url: 'https://picsum.photos/seed/5s2/800/600', title: 'After: HR Room Organized' },
  { id: -3, url: 'https://picsum.photos/seed/5s3/800/600', title: 'Before: Conference Room' },
];

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images');
        if (response.ok) {
          const data = await response.json();
          setImages(data.length > 0 ? data : DEFAULT_IMAGES);
        } else {
          setImages(DEFAULT_IMAGES);
        }
      } catch (e) {
        console.error('Failed to fetch images', e);
        setImages(DEFAULT_IMAGES);
      }
      setLoading(false);
    };
    
    fetchImages();
    const interval = setInterval(fetchImages, 5000);
    return () => clearInterval(interval);
  }, []);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Compress to JPEG with 0.7 quality to save localStorage space
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          } else {
            reject(new Error('Failed to get canvas context'));
          }
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64Url = await compressImage(file);
        const title = file.name || 'New Uploaded Image';
        
        const response = await fetch('/api/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: base64Url, title })
        });
        
        if (response.ok) {
          const newImage = await response.json();
          setImages([newImage, ...images]);
        } else {
          alert('Failed to save image to server.');
        }
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Failed to process the image.');
      }
    }
  };

  const removeImage = async (id: number) => {
    try {
      await fetch(`/api/images/${id}`, { method: 'DELETE' });
      setImages(images.filter((img) => img.id !== id));
    } catch (e) {
      console.error('Failed to delete image', e);
    }
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <PageWrapper>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">QA001 Gallery</h1>
          <p className="text-slate-500 mt-2">Before and after photos of the workplace.</p>
        </div>
        
        <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors shadow-sm">
          <Upload className="w-4 h-4" />
          <span className="font-medium text-sm">Upload Image</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img) => (
          <div key={img.id} className="group relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="aspect-[4/3] bg-slate-100 relative">
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => removeImage(img.id)}
                className="absolute top-2 right-2 p-1.5 bg-white/90 text-slate-700 hover:text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 border-t border-slate-100 flex items-center gap-3">
              <ImageIcon className="w-5 h-5 text-slate-400 shrink-0" />
              <p className="text-sm font-medium text-slate-700 truncate" title={img.title}>{img.title}</p>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
