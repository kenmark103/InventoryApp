import api from '../lib/api';

interface ProductData {
  name: string;
  sku: string;
  buyingPrice: number;
  sellingPrice: number;
  taxRate: number;
  isService: boolean;
  quantity: number;
  supplierId: number;
  categoryId: number;
  description?: string;
  size?: string;
  weight?: number;
  imageUrl?: string;
  galleryImages?: string[];
}

interface FileUploadResponse {
  mainImageUrl?: string;
  galleryUrls?: string[];
}

const uploadProductFiles = async (formData: FormData): Promise<FileUploadResponse> => {
  const response = await api.post<FileUploadResponse>('/ProductsUpload', formData);
  return response.data;
};

const createProduct = async (productData: ProductData, files?: {
  mainImage?: File;
  galleryImages?: File[];
}): Promise<ProductData> => {
  let uploadResult: FileUploadResponse = {};
  
  if (files?.mainImage || files?.galleryImages) {
    const formData = new FormData();
    
    if (files.mainImage) {
      formData.append('mainImage', files.mainImage);
    }
    
    if (files.galleryImages) {
      files.galleryImages.forEach(file => {
        formData.append('galleryImages', file);
      });
    }
    
    uploadResult = await uploadProductFiles(formData);
  }

  // Create the final product payload
  const productPayload = {
    ...productData,
    imageUrl: uploadResult.mainImageUrl || productData.imageUrl,
    galleryImages: [
      ...(productData.galleryImages || []),
      ...(uploadResult.galleryUrls || [])
    ]
  };

  const response = await api.post<ProductData>('/products', productPayload);
  return response.data;
};

const updateProduct = async (id: number, productData: ProductData, files?: {
  mainImage?: File;
  galleryImages?: File[];
}): Promise<ProductData> => {
  let uploadResult: FileUploadResponse = {};

  // Handle file upload if new files are provided
  if (files?.mainImage || files?.galleryImages) {
    const formData = new FormData();
    
    if (files.mainImage) {
      formData.append('mainImage', files.mainImage);
    }
    
    if (files.galleryImages) {
      files.galleryImages.forEach(file => {
        formData.append('galleryImages', file);
      });
    }
    
    uploadResult = await uploadProductFiles(formData);
  }

  // Update the product with merged data
  const updatePayload = {
    ...productData,
    ...(uploadResult.mainImageUrl && { imageUrl: uploadResult.mainImageUrl }),
    ...(uploadResult.galleryUrls && { 
      galleryImages: [
        ...(productData.galleryImages || []),
        ...uploadResult.galleryUrls
      ]
    })
  };

  const response = await api.put<ProductData>(`/products/${id}`, updatePayload);
  return response.data;
};

// Keep other functions the same
const getAllProducts = async (): Promise<ProductData[]> => {
  const response = await api.get<ProductData[]>('/products');
  return response.data;
};

const getProductById = async (id: number): Promise<ProductData> => {
  const response = await api.get<ProductData>(`/products/${id}`);
  return response.data;
};

const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`);
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};