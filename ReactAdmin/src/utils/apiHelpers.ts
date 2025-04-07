export const getImageUrl = (imagePath: string | null | undefined) => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5086';
  
  if (!imagePath) return '/placeholder-product.jpg'; // Add a placeholder image
  if (imagePath.startsWith('http')) return imagePath; // Handle already full URLs
  
  return `${baseUrl}${imagePath}`;
};