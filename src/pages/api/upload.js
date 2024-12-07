import formidable from 'formidable';
import cloudinary from '../../utils/cloudinary';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
    maxDuration: 60, // Increase timeout to 60 seconds
  },
};

const saveToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: 'meme-vault',
      resource_type: 'auto',
    });

    // Clean up the temp file
    fs.unlink(file.filepath, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      filename: file.originalFilename,
      success: true
    };
  } catch (error) {
    console.error(`Error uploading file: ${file.originalFilename}`, error);
    return { success: false, error: error.message };
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFiles: 100,
      maxFileSize: 50 * 1024 * 1024, // 50MB per file
      allowEmptyFiles: false,
      filter: function ({ name, originalFilename, mimetype }) {
        // Accept only images
        return mimetype && mimetype.includes("image");
      },
    });

    // Process uploads
    const processUpload = () => {
      return new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
          if (err) {
            console.error('Form parse error:', err);
            return reject(err);
          }

          try {
            const uploadedFiles = files.memes;
            const results = [];
            const processedUrls = new Set(); // Track processed URLs

            // Handle both single and multiple files
            const filesToProcess = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];

            // Process files in batches of 10
            for (let i = 0; i < filesToProcess.length; i += 10) {
              const batch = filesToProcess.slice(i, i + 10);
              const uploadPromises = batch.map(file => saveToCloudinary(file));

              const batchResults = await Promise.all(uploadPromises);
              
              // Filter successful uploads and check for duplicates
              batchResults.forEach(result => {
                if (result.success && !processedUrls.has(result.url)) {
                  processedUrls.add(result.url);
                  results.push(result);
                }
              });

              // Add small delay between batches
              if (i + 10 < filesToProcess.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }

            resolve(results);
          } catch (error) {
            console.error('Upload processing error:', error);
            reject(error);
          }
        });
      });
    };

    const results = await processUpload();

    // Send response with upload results
    res.status(200).json({ 
      message: 'Upload successful',
      results: results.filter(r => r.success),
      failed: results.filter(r => !r.success).length
    });

  } catch (error) {
    console.error('Upload handler error:', error);
    res.status(500).json({ 
      error: 'Upload failed', 
      details: error.message 
    });
  }
}