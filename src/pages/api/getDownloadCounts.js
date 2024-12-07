import clientPromise from '../../utils/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('memevault');
    
    const downloads = await db.collection('downloads')
      .find({})
      .toArray();

    const downloadCounts = {};
    downloads.forEach(doc => {
      downloadCounts[doc.memeId] = doc.count || 0;
    });

    res.status(200).json(downloadCounts);
  } catch (error) {
    console.error('Error fetching download counts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch download counts',
      details: error.message 
    });
  }
}