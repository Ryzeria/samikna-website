/**
 * Server-side input validators.
 * Each validator returns { valid: true } or { valid: false, message: string }.
 * All inputs are expected to already be strings (from req.body / req.query).
 */

const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export function validateRequired(value, fieldName) {
  if (value === undefined || value === null || String(value).trim() === '') {
    return { valid: false, message: `${fieldName} wajib diisi.` };
  }
  return { valid: true };
}

export function validateLength(value, fieldName, min = 1, max = 255) {
  const str = String(value).trim();
  if (str.length < min) return { valid: false, message: `${fieldName} minimal ${min} karakter.` };
  if (str.length > max) return { valid: false, message: `${fieldName} maksimal ${max} karakter.` };
  return { valid: true };
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(email).trim())) {
    return { valid: false, message: 'Format email tidak valid.' };
  }
  return { valid: true };
}

export function validatePhone(phone) {
  const phoneRegex = /^(\+62|62|0)[0-9]{8,13}$/;
  if (!phoneRegex.test(String(phone).replace(/[\s-]/g, ''))) {
    return { valid: false, message: 'Format nomor telepon tidak valid (contoh: 08123456789).' };
  }
  return { valid: true };
}

export function validatePassword(password) {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password minimal 8 karakter.' };
  }
  if (!STRONG_PASSWORD.test(password)) {
    return {
      valid: false,
      message: 'Password harus mengandung huruf besar, kecil, angka, dan karakter khusus (@$!%*?&).'
    };
  }
  return { valid: true };
}

export function validatePositiveNumber(value, fieldName) {
  const num = Number(value);
  if (isNaN(num) || num <= 0) {
    return { valid: false, message: `${fieldName} harus berupa angka positif.` };
  }
  return { valid: true };
}

export function validateEnum(value, allowed, fieldName) {
  if (!allowed.includes(value)) {
    return { valid: false, message: `${fieldName} tidak valid. Pilihan: ${allowed.join(', ')}.` };
  }
  return { valid: true };
}

// ---------------------------------------------------------------------------
// Domain validators
// ---------------------------------------------------------------------------

/**
 * Validate login payload.
 * @param {{ username: string, password: string }} body
 */
export function validateLogin(body) {
  const errors = [];

  const usernameCheck = validateRequired(body.username, 'Username');
  if (!usernameCheck.valid) errors.push(usernameCheck.message);
  else {
    const lenCheck = validateLength(body.username, 'Username', 3, 50);
    if (!lenCheck.valid) errors.push(lenCheck.message);
  }

  const passwordCheck = validateRequired(body.password, 'Password');
  if (!passwordCheck.valid) errors.push(passwordCheck.message);

  return errors.length ? { valid: false, errors } : { valid: true };
}

/**
 * Validate profile update payload.
 * All fields are optional — only validate ones that are present.
 */
export function validateProfileUpdate(body) {
  const errors = [];

  if (body.email !== undefined) {
    const r = validateEmail(body.email);
    if (!r.valid) errors.push(r.message);
  }

  if (body.phone !== undefined && body.phone !== '') {
    const r = validatePhone(body.phone);
    if (!r.valid) errors.push(r.message);
  }

  if (body.fullName !== undefined) {
    const r = validateLength(body.fullName, 'Nama lengkap', 2, 100);
    if (!r.valid) errors.push(r.message);
  }

  if (body.bio !== undefined) {
    const r = validateLength(body.bio, 'Bio', 0, 500);
    if (!r.valid) errors.push(r.message);
  }

  if (body.website !== undefined && body.website !== '') {
    try { new URL(body.website); } catch {
      errors.push('Format URL website tidak valid.');
    }
  }

  return errors.length ? { valid: false, errors } : { valid: true };
}

/**
 * Validate password change payload.
 */
export function validatePasswordChange(body) {
  const errors = [];

  const currentCheck = validateRequired(body.currentPassword, 'Password lama');
  if (!currentCheck.valid) errors.push(currentCheck.message);

  const newCheck = validatePassword(body.newPassword);
  if (!newCheck.valid) errors.push(newCheck.message);

  if (body.newPassword === body.currentPassword) {
    errors.push('Password baru tidak boleh sama dengan password lama.');
  }

  return errors.length ? { valid: false, errors } : { valid: true };
}

/**
 * Validate crop field creation/update payload.
 */
export function validateCropField(body) {
  const errors = [];
  const CROP_TYPES = ['rice', 'corn', 'soybean', 'sugarcane', 'cassava', 'sweet_potato', 'other'];

  const nameCheck = validateRequired(body.fieldName, 'Nama lahan');
  if (!nameCheck.valid) errors.push(nameCheck.message);
  else {
    const lenCheck = validateLength(body.fieldName, 'Nama lahan', 2, 100);
    if (!lenCheck.valid) errors.push(lenCheck.message);
  }

  if (body.area !== undefined) {
    const r = validatePositiveNumber(body.area, 'Luas lahan');
    if (!r.valid) errors.push(r.message);
  }

  if (body.cropType !== undefined) {
    const r = validateEnum(body.cropType, CROP_TYPES, 'Jenis tanaman');
    if (!r.valid) errors.push(r.message);
  }

  return errors.length ? { valid: false, errors } : { valid: true };
}

/**
 * Validate inventory item creation/update payload.
 */
export function validateInventoryItem(body) {
  const errors = [];
  const CATEGORIES = ['seeds', 'fertilizers', 'pesticides', 'equipment', 'tools', 'others'];

  const nameCheck = validateRequired(body.itemName, 'Nama item');
  if (!nameCheck.valid) errors.push(nameCheck.message);

  if (body.category !== undefined) {
    const r = validateEnum(body.category, CATEGORIES, 'Kategori');
    if (!r.valid) errors.push(r.message);
  }

  if (body.unitPrice !== undefined) {
    const r = validatePositiveNumber(body.unitPrice, 'Harga satuan');
    if (!r.valid) errors.push(r.message);
  }

  if (body.currentStock !== undefined) {
    const num = Number(body.currentStock);
    if (isNaN(num) || num < 0) errors.push('Stok tidak boleh negatif.');
  }

  return errors.length ? { valid: false, errors } : { valid: true };
}
