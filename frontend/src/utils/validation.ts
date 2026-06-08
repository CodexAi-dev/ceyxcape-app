// Validate email
export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';
  return null;
};

// Validate password
export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain number';
  if (!/[!@#$%^&*]/.test(password)) return 'Password must contain special character';
  return null;
};

// Validate phone
export const validatePhone = (phone: string): string | null => {
  if (!phone) return 'Phone number is required';
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (!phoneRegex.test(phone.replace(/\D/g, ''))) return 'Invalid phone number';
  return null;
};

// Validate URL
export const validateURL = (url: string): string | null => {
  if (!url) return 'URL is required';
  try {
    new URL(url);
    return null;
  } catch {
    return 'Invalid URL';
  }
};

// Validate name
export const validateName = (name: string, minLength = 2): string | null => {
  if (!name) return 'Name is required';
  if (name.length < minLength) return `Name must be at least ${minLength} characters`;
  if (!/^[a-zA-Z\s'-]+$/.test(name)) return 'Name contains invalid characters';
  return null;
};

// Validate date
export const validateDate = (date: string, minDate?: Date, maxDate?: Date): string | null => {
  if (!date) return 'Date is required';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid date format';

  if (minDate && dateObj < minDate) return 'Date must be after minimum date';
  if (maxDate && dateObj > maxDate) return 'Date must be before maximum date';

  return null;
};

// Validate number
export const validateNumber = (
  value: string | number,
  min?: number,
  max?: number
): string | null => {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return 'Must be a valid number';
  if (min !== undefined && num < min) return `Must be at least ${min}`;
  if (max !== undefined && num > max) return `Must be at most ${max}`;

  return null;
};

// Validate select
export const validateSelect = (value: string | number): string | null => {
  if (!value || value === '') return 'Please select an option';
  return null;
};

// Validate checkbox
export const validateCheckbox = (checked: boolean): string | null => {
  if (!checked) return 'You must agree to this';
  return null;
};

// Validate file
export const validateFile = (
  file: File | null,
  allowedTypes?: string[],
  maxSize?: number
): string | null => {
  if (!file) return 'File is required';

  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return `File type must be one of: ${allowedTypes.join(', ')}`;
  }

  if (maxSize && file.size > maxSize) {
    return `File size must be less than ${(maxSize / 1024 / 1024).toFixed(2)}MB`;
  }

  return null;
};

// Validate booking dates
export const validateBookingDates = (tourDate: string): string | null => {
  if (!tourDate) return 'Tour date is required';

  const date = new Date(tourDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date < today) return 'Tour date must be in the future';
  return null;
};

// Validate booking participants
export const validateParticipants = (count: number, min = 1, max = 20): string | null => {
  if (!count) return 'Number of participants is required';
  if (count < min) return `Minimum ${min} participant(s) required`;
  if (count > max) return `Maximum ${max} participants allowed`;
  return null;
};

// Validate credit card (basic Luhn algorithm)
export const validateCreditCard = (cardNumber: string): string | null => {
  if (!cardNumber) return 'Card number is required';

  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cleaned)) return 'Invalid card number';

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) return 'Invalid card number';
  return null;
};

// Validate expiry date
export const validateExpiryDate = (expiryDate: string): string | null => {
  if (!expiryDate) return 'Expiry date is required';

  const [month, year] = expiryDate.split('/');
  if (!month || !year) return 'Invalid expiry format (MM/YY)';

  const expMonth = parseInt(month, 10);
  const expYear = parseInt('20' + year, 10);
  const now = new Date();

  if (expMonth < 1 || expMonth > 12) return 'Invalid month';
  if (expYear < now.getFullYear()) return 'Card has expired';
  if (expYear === now.getFullYear() && expMonth < now.getMonth() + 1) return 'Card has expired';

  return null;
};

// Validate CVV
export const validateCVV = (cvv: string): string | null => {
  if (!cvv) return 'CVV is required';
  if (!/^\d{3,4}$/.test(cvv)) return 'Invalid CVV';
  return null;
};
