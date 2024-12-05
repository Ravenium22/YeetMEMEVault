import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // Get the absolute path to the memes directory
    const memesDirectory = path.join(process.cwd(), 'public', 'memes');
    
    // Read the directory
    const filenames = fs.readdirSync(memesDirectory);
    
    // Filter for image files and create full paths
    const memes = filenames
      .filter(filename => {
        // Ensure we only get image files
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
      })
      .map(filename => ({
        filename,
        // Add a timestamp to prevent caching
        url: `/memes/${filename}?t=${Date.now()}`
      }));

    // Log the found memes for debugging
    console.log('Found memes:', memes);
    
    res.status(200).json(memes);
  } catch (error) {
    console.error('Error reading memes directory:', error);
    res.status(500).json({ error: 'Failed to read meme directory' });
  }
}