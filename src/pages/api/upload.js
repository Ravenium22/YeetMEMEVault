import formidable from 'formidable';
import cloudinary from '../../utils/cloudinary';

export const config = {
  api: {
    bodyParser: false,
    maxDuration: 30, // Increase API route duration limit
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Configure formidable with higher limits
    const form = formidable({
      multiples: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB
      maxFields: 10,
      maxFiles: 50,
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

            // Upload files in parallel with a limit
            const uploadPromises = filesToProcess.map(async (file) => {
              try {
                if (!file || !file.filepath) return null;

                const result = await cloudinary.uploader.upload(file.filepath, {
                  folder: 'meme-vault',
                  resource_type: 'auto',
                });

                // Check for duplicates
                if (!processedUrls.has(result.secure_url)) {
                  processedUrls.add(result.secure_url);
                  return {
                    url: result.secure_url,
                    public_id: result.public_id,
                    filename: file.originalFilename,
                    uploadDate: new Date().toISOString()
                  };
                }
                return null;
              } catch (uploadError) {
                console.error('File upload error:', uploadError);
                return null;
              }
            });

            const uploadResults = await Promise.all(uploadPromises);
            results.push(...uploadResults.filter(Boolean));

            resolve(results);
          } catch (error) {
            console.error('Upload processing error:', error);
            reject(error);
          }
        });
      });
    };

    const results = await processUpload();
    res.status(200).json({ results });
  } catch (error) {
    console.error('Upload handler error:', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
}