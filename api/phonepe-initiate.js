import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { plan_name, price, user_id, phone, duration } = req.body;

  const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT';
  const SALT_KEY = process.env.PHONEPE_SALT_KEY || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
  const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';
  
  // Sandbox testing endpoint. Use api.phonepe.com/apis/hermes/pg/v1/pay for prod
  const PHONEPE_URL = 'https://api-preprod.phonepe.com/apis/hermes/pg/v1/pay';

  const transactionId = `T${Date.now()}`;
  
  // We need to pass back the plan details via URL params so the callback knows what to upgrade
  const redirectUri = `${req.headers.origin || 'http://localhost:5173'}/my-plan?transactionId=${transactionId}&uid=${user_id}&plan=${encodeURIComponent(plan_name)}&dur=${duration}`;

  const payload = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: transactionId,
    merchantUserId: user_id,
    amount: price * 100, // Amount is in paise
    redirectUrl: redirectUri,
    redirectMode: "REDIRECT", // PhonePe redirects browser with a GET request
    callbackUrl: `${req.headers.origin || 'http://localhost:5173'}/api/phonepe-callback`, // Server webhook
    mobileNumber: phone || "9999999999",
    paymentInstrument: {
      type: "PAY_PAGE"
    }
  };

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
  const stringToHash = base64Payload + "/pg/v1/pay" + SALT_KEY;
  const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
  const checksum = sha256 + "###" + SALT_INDEX;

  try {
    const response = await fetch(PHONEPE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum
      },
      body: JSON.stringify({ request: base64Payload })
    });

    const data = await response.json();
    
    if (data.success) {
      const url = data.data.instrumentResponse.redirectInfo.url;
      return res.status(200).json({ url });
    } else {
      return res.status(400).json({ error: data.message });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Gateway Connection Failed', message: error.message });
  }
}
