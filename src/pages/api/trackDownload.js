import clientPromise from '../../utils/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { memeId } = req.body;
    const client = await clientPromise;
    const db = client.db('memevault'); // Simpler database name

    // Update download count
    const result = await db.collection('downloads').findOneAndUpdate(
      { memeId },
      { $inc: { count: 1 } },
      { 
        upsert: true, 
        returnDocument: 'after',
        maxTimeMS: 20000 // Increased timeout
      }
    );

    return res.status(200).json({ count: result.value?.count || 1 });
  } catch (error) {
    console.error('Download tracking error:', error);
    return res.status(500).json({ error: 'Failed to track download' });
  }
}