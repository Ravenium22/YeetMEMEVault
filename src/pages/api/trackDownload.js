import clientPromise from '../../utils/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { memeId } = req.body;
    const client = await clientPromise;
    const db = client.db('meme-vault');
    
    await db.collection('downloads').updateOne(
      { memeId },
      { $inc: { count: 1 } },
      { upsert: true }
    );

    const downloadCount = await db.collection('downloads')
      .findOne({ memeId });

    res.status(200).json({ count: downloadCount.count });
  } catch (error) {
    console.error('Download tracking error:', error);
    res.status(500).json({ error: 'Failed to track download' });
  }
}