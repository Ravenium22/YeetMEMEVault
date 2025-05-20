import cloudinary from '../../utils/cloudinary';

export default async function handler(req, res) {
  try {
    // Get all resources from the meme-vault folder
    const result = await cloudinary.search
      .expression('folder:meme-vault')
      .max_results(1000)
      .sort_by('created_at', 'desc')
      .execute();

    // Map the resources to a simpler format
    const memes = result.resources.map(resource => {
      const isVideo = resource.resource_type === 'video';
      
      return {
        filename: resource.filename,
        url: resource.secure_url,
        uploadDate: resource.created_at,
        public_id: resource.public_id,
        fileType: isVideo ? 'video' : 'image',
        thumbnail: isVideo ? `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/c_scale,w_480/du_1.0/${resource.public_id}.jpg` : null,
        duration: resource.duration || null
      };
    });

    // Return the memes array
    return res.status(200).json(memes);

  } catch (error) {
    console.error('Error fetching memes:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch memes',
      message: error.message 
    });
  }
}
