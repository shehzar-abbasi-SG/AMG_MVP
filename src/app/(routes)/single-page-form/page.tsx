import Form from '@/components/Form/form';
import React from 'react'

async function getMediaFormVariants(){
    try {
    
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media-submission`);
    
        if (!response.ok) {
          throw new Error('Failed to fetch media form data');
        }
    
        const data = await response.json();
  
        return data;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    
}
export default async function SubmitMedia() {
    const data = await getMediaFormVariants()
    console.log('data ==>> ', data);
  return (
    <div>
    <h1>{data.title}</h1>
    <Form/>
  </div>
  )
}
