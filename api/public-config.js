const { json } = require('./_shared');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { ok: false, message: 'Method not allowed' });
  return json(res, 200, {
    ok: true,
    googleClientId: process.env.GOOGLE_CLIENT_ID || ''
  });
};
