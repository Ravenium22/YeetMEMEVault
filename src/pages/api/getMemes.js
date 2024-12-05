import { join } from 'path';
import { readdir } from 'fs/promises';

export default async function handler(req, res) {
  try {
    // Default empty array if directory doesn't exist or is empty
    let memes = [];
    
    try {
      const memesDirectory = join(process.cwd(), 'public', 'memes');
      const files = await readdir(memesDirectory);
      memes = files
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .map(filename => ({
          filename,
          url: `/memes/${filename}`
        }));
    } catch (error) {
      console.error('Directory read error:', error);
      // Don't throw, just return empty array
    }

    res.status(200).json(memes);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to load memes', details: error.message });
  }
}