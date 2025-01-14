'use client'
import { useCart } from '@/context/CartContext';
import React, { useEffect, useState } from 'react';

const MediaSubmissionForm = () => {
  // Array of media type options
  const mediaTypes = [
    { name: 'Vinyl', price: 75 },
    { name: 'CD', price: 50 },
    { name: 'Cassette', price: 50 },
    { name: '8 Track', price: 50 },
  ];
  const {addToCart} = useCart()
  // State to manage form data
  const [formData, setFormData] = useState({
    mediaType: '',
    artist: '',
    albumName: '',
    recordLabel: '',
    recordSize: '',
    KeyholeMounts:"✓"
  });

  // Options for record size
  const recordSizes = ['7 inch', '10 inch', '12 inch', 'Other'];

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    addToCart("gid://shopify/ProductVariant/43526217236527",1,true,formData)
  };
  const getProducts = async ()=>{
      try {
      
        const response = await fetch(`/api/media-submission`);
    
        if (!response.ok) {
          throw new Error('Failed to fetch media form data');
        }
    
        const data = await response.json();
        console.log("data===> ",data)
        return data;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }

    useEffect(()=>{
      getProducts()
    },[])

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Media Submission Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Media Type Selection */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">What type of media are you submitting?</h3>
          {mediaTypes.map((media) => (
            <label key={media.name} className="block mb-2">
              <input
                type="radio"
                name="mediaType"
                value={media.name}
                onChange={handleChange}
                className="mr-2"
              />
              {media.name} (Starting at ${media.price})
            </label>
          ))}
        </div>

        {/* Text Fields */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Artist *</label>
          <input
            type="text"
            name="artist"
            value={formData.artist}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Album Name *</label>
          <input
            type="text"
            name="albumName"
            value={formData.albumName}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Record Label *</label>
          <input
            type="text"
            name="recordLabel"
            value={formData.recordLabel}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>

        {/* Record Size Selection */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">What size is your record? *</label>
          <select
            name="recordSize"
            value={formData.recordSize}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          >
            <option value="" disabled>Select size</option>
            {recordSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default MediaSubmissionForm;
