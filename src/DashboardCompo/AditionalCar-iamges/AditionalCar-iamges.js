'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ImageUploader() {
  const [images, setImages] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(null);

  console.log("object", images.map((img) => img.url));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({ 
      file, 
      url: URL.createObjectURL(file), // Show preview instantly
      name: null 
    }));
    setImages((prev) => [...prev, ...files]);
  };

  const uploadImage = async (image, index) => {
    setLoadingIndex(index);
    const fileName = `${Date.now()}-${image.file.name}`;
    const { error } = await supabase.storage.from('Alromaih').upload(fileName, image.file);

    if (error) {
      console.error('Upload error:', error.message);
      alert('Failed to upload image');
    } else {
      const { data: publicUrl } = supabase.storage.from('Alromaih').getPublicUrl(fileName);
      setImages((prev) => {
        const newImages = [...prev];
        newImages[index] = { ...image, url: publicUrl.publicUrl, name: fileName };
        return newImages;
      });
    }
    setLoadingIndex(null);
  };

  const deleteImage = async (fileName, index) => {
    setLoadingIndex(index);
    const { error } = await supabase.storage.from('Alromaih').remove([fileName]);

    if (error) {
      console.error('Delete error:', error.message);
      alert('Failed to delete image');
    } else {
      setImages((prev) => prev.filter((_, i) => i !== index));
      alert('Image deleted successfully');
    }
    setLoadingIndex(null);
  };

  return (
    <div className="p-4 border rounded shadow-lg w-80 mx-auto text-center">
      <input type="file" multiple onChange={handleImageChange} className="mb-2" />
      <div>
        {images.map((img, index) => (
          <div key={index} className="mt-4 border p-2 rounded">
            <img src={img.url} alt="Preview" className="w-full h-40 object-cover" />
            {!img.name ? (
              <button
                onClick={() => uploadImage(img, index)}
                disabled={loadingIndex === index}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
              >
                {loadingIndex === index ? 'Uploading...' : 'Upload'}
              </button>
            ) : (
              <button
                onClick={() => deleteImage(img.name, index)}
                disabled={loadingIndex === index}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-400"
              >
                {loadingIndex === index ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
