import cloudinary from '../../utils/cloudinary';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { publicIds } = req.body;

    if (!publicIds || !publicIds.length) {
      return res.status(400).json({ error: 'No public IDs provided' });
    }

    const results = await Promise.all(
      publicIds.map(publicId => 
        cloudinary.uploader.destroy(publicId)
      )
    );

    res.status(200).json({ message: 'Photos deleted successfully', results });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete photos' });
  }
}
