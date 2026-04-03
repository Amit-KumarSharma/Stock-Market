import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { transactionId } = req.query;

  if (!transactionId) {
    return res.status(400).json({ error: 'Transaction ID is required' });
  }

  const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT';
  const SALT_KEY = process.env.PHONEPE_SALT_KEY || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
  const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';

  const endpoint = `/pg/v1/status/${MERCHANT_ID}/${transactionId}`;
  const stringToHash = endpoint + SALT_KEY;
  const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
  const checksum = sha256 + "###" + SALT_INDEX;

  try {
    const response = await fetch(`https://api-preprod.phonepe.com/apis/pg-sandbox${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': MERCHANT_ID
      }
    });
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to verify status', message: error.message });
  }
}
