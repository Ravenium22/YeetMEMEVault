import formidable from 'formidable';
import cloudinary from '../../utils/cloudinary';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: 'meme-vault',
      resource_type: 'auto',
    });
    return {
      url: result.secure_url,
      public_id: result.public_id,
      success: true
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return { success: false };
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Upload failed' });
      }

      const memes = files.memes;
      const results = [];

      if (Array.isArray(memes)) {
        for (const meme of memes) {
          const result = await uploadToCloudinary(meme);
          results.push(result);
          fs.unlinkSync(meme.filepath);
        }
      } else if (memes) {
        const result = await uploadToCloudinary(memes);
        results.push(result);
        fs.unlinkSync(memes.filepath);
      }

      res.status(200).json({ results });
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
}