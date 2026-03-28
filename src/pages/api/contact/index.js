import { connectDB } from '../../../lib/database';

/**
 * POST /api/contact
 *
 * Public endpoint — no auth required (landing-page contact form).
 * Saves the inquiry to the `inquiries` table and returns success/error JSON.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { name, email, phone, company, inquiryType, subject, message } = req.body;

  // Basic validation
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Nama, email, dan pesan wajib diisi.',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ success: false, error: 'Format email tidak valid.' });
  }

  // Map front-end inquiryType values to DB enum
  const typeMap = {
    product: 'information',
    partnership: 'partnership',
    support: 'support',
    other: 'other',
  };
  const dbType = typeMap[inquiryType] || 'information';

  // Auto-generate inquiry number: INQ-YYYYMMDD-XXXX
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand    = Math.floor(1000 + Math.random() * 9000);
  const inquiryNumber = `INQ-${dateStr}-${rand}`;

  const autoSubject = subject?.trim() ||
    `[${dbType.charAt(0).toUpperCase() + dbType.slice(1)}] Pertanyaan dari ${name.trim()}`;

  let connection = null;
  try {
    connection = await connectDB();
    await connection.execute(
      `INSERT INTO inquiries
         (inquiry_number, full_name, email, phone, company,
          inquiry_type, subject, message, inquiry_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
      [
        inquiryNumber,
        name.trim(),
        email.trim().toLowerCase(),
        phone?.trim() || null,
        company?.trim() || null,
        dbType,
        autoSubject,
        message.trim(),
      ]
    );

    return res.status(200).json({
      success: true,
      data: { inquiryNumber },
      message: 'Pesan Anda telah berhasil dikirim. Tim kami akan menghubungi Anda segera.',
    });
  } catch (err) {
    console.error('Contact API error:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan sistem. Silakan coba lagi atau hubungi kami melalui telepon.',
    });
  } finally {
    if (connection) {
      try { connection.release(); } catch (_) {}
    }
  }
}
