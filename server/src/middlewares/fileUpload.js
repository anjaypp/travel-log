import busboy from 'busboy';
import cloudinary from '../lib/config/cloudinary.js';


export const handleFileUpload = (req, res, next) => {
  
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    return next();
  }

  // Create busboy instance with configuration
  const bb = busboy({
    headers: req.headers,
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 5 
    }
  });

  // Initialize objects to store form data and uploaded files
  const formData = {};
  const uploadPromises = [];
  const uploadedImages = [];

  // Handle regular form fields
  bb.on('field', (fieldname, val) => {
    if (fieldname.includes('[') && fieldname.includes(']')) {
      const mainField = fieldname.substring(0, fieldname.indexOf('['));
      const subField = fieldname.substring(
        fieldname.indexOf('[') + 1, 
        fieldname.indexOf(']')
      );
      
      if (!formData[mainField]) {
        formData[mainField] = {};
      }
      
      formData[mainField][subField] = val;
    } else {
      // Regular fields
      formData[fieldname] = val;
    }
  });

  // Handle file uploads
  bb.on('file', (fieldname, fileStream, { filename, encoding, mimeType }) => {
    // Only process image files
    if (!mimeType.startsWith('image/')) {
      fileStream.resume();
      return;
    }

    // Create a promise for uploading to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      // Create Cloudinary upload stream
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          
          // Save the upload result
          uploadedImages.push({
            url: result.secure_url,
            publicId: result.public_id
          });
          
          resolve();
        }
      );

      // Pipe the file stream directly to Cloudinary
      fileStream.pipe(uploadStream);
      
      // Handle errors in the file stream
      fileStream.on('error', (error) => {
        reject(error);
      });
    });

    uploadPromises.push(uploadPromise);
  });

  // Handle parsing completion
  bb.on('finish', async () => {
    try {
      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
      
      
      req.body = formData;
      req.uploadedImages = uploadedImages;
      
      next();
    } catch (error) {
      console.error('Error processing file uploads:', error);
      res.status(500).json({ message: 'Error processing file uploads' });
    }
  });

  // Handle potential errors
  bb.on('error', (err) => {
    console.error('Busboy error:', err);
    res.status(400).json({ message: 'Error parsing form data' });
  });

  // Pipe the request to busboy for processing
  req.pipe(bb);
};