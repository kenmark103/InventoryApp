import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { createReadStream } from 'fs';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary (or your storage service)
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse form data
    const form = formidable();
    const [fields, files] = await form.parse(req);

    // Upload main image
    const mainImageUrl = files.mainImage?.[0] 
      ? await uploadToLocal(files.mainImage[0])
      : null;

    // Upload gallery images
    const galleryUrls = await Promise.all(
      files.galleryImages?.map(async (file) => 
        await uploadToLocal(file)
      ) || []
    );

    res.status(200).json({
      mainImageUrl,
      galleryUrls
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
}

async function uploadToCloudinary(file: formidable.File) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'products' },
      (error, result) => {
        if (error) reject(error);
        resolve(result?.secure_url);
      }
    );
    
    createReadStream(file.filepath).pipe(uploadStream);
  });
}

async function uploadToLocal(file: formidable.File) {
  const fs = require('fs/promises');
  const path = `/public/uploads/${Date.now()}-${file.originalFilename}`;
  await fs.rename(file.filepath, `./${path}`);
  return path;
}