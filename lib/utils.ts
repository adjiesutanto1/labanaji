export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export function formatDateIndonesian(dateString: string): string {
  try {
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  } catch {
    return dateString
  }
}

export function formatShortDateIndonesian(dateString: string): string {
  try {
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  } catch {
    return dateString
  }
}

export function getRelativeDayLabel(dateString: string): string | null {
  try {
    const now = new Date()
    const todayStr = getTodayDateString()
    
    // Check if today
    if (dateString === todayStr) {
      return 'Hari Ini'
    }

    // Tomorrow
    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)
    const tomorrowStr = formatDateToYYYYMMDD(tomorrow)
    if (dateString === tomorrowStr) {
      return 'Besok'
    }

    return null
  } catch {
    return null
  }
}

export function getTodayDateString(): string {
  const now = new Date()
  return formatDateToYYYYMMDD(now)
}

export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatPhoneNumber(phone: string): { display: string; telUrl: string; waUrl: string } {
  const cleaned = phone.replace(/\D/g, '')
  let international = cleaned
  if (cleaned.startsWith('0')) {
    international = '62' + cleaned.slice(1)
  } else if (!cleaned.startsWith('62')) {
    international = '62' + cleaned
  }

  // Display format like 0812-3456-7890
  let display = phone
  if (cleaned.startsWith('0') && cleaned.length >= 10) {
    display = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8)}`
  }

  return {
    display,
    telUrl: `tel:${cleaned.startsWith('0') ? cleaned : '0' + international.slice(2)}`,
    waUrl: `https://wa.me/${international}`,
  }
}

export function getGoogleMapsUrl(address: string, name?: string, lat?: number | null, lng?: number | null): string {
  if (lat && lng) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  }
  const query = name ? `${name}, ${address}` : address
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
