import clientPromise from '../../utils/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('meme-vault');
    
    const downloads = await db.collection('downloads')
      .find({})
      .toArray();

    // Convert array to object for easier access
    const countsObject = downloads.reduce((acc, item) => {
      acc[item.memeId] = item.count;
      return acc;
    }, {});

    return res.status(200).json(countsObject);
  } catch (error) {
    console.error('Error fetching download counts:', error);
    return res.status(500).json({ error: 'Failed to fetch download counts' });
  }
}