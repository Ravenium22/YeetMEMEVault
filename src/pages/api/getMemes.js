import cloudinary from '../../utils/cloudinary';

export default async function handler(req, res) {
  try {
    const result = await cloudinary.search
      .expression('folder:meme-vault')
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute();

    const memes = result.resources.map(resource => ({
      filename: resource.filename,
      url: resource.secure_url,
      uploadDate: resource.created_at,
      public_id: resource.public_id
    }));

    res.status(200).json(memes);
  } catch (error) {
    console.error('Error fetching memes:', error);
    res.status(500).json({ error: 'Failed to fetch memes' });
  }
}