import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'public', 'memes'),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Upload failed' });
      }

      const uploadedFiles = Array.isArray(files.memes) ? files.memes : [files.memes];
      
      uploadedFiles.forEach(file => {
        // Optionally rename files or perform additional processing
        const oldPath = file.filepath;
        const newPath = path.join(path.dirname(oldPath), file.originalFilename);
        fs.renameSync(oldPath, newPath);
      });

      res.status(200).json({ message: 'Upload successful' });
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
}