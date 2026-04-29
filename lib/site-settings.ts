export type SiteSettings = {
  supportEmail: string
  supportPhone: string
  supportPhoneHref: string
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  supportEmail: 'support@cybershield.com',
  supportPhone: '+1-800-123-4567',
  supportPhoneHref: 'tel:+18001234567',
}

export function toPhoneHref(phone: string) {
  const compact = phone.trim().replace(/[^\d+]/g, '')
  return compact ? `tel:${compact}` : ''
}

export function normalizeSiteSettings(settings?: Partial<SiteSettings> | null): SiteSettings {
  const supportEmail = settings?.supportEmail ?? DEFAULT_SITE_SETTINGS.supportEmail
  const supportPhone = settings?.supportPhone ?? DEFAULT_SITE_SETTINGS.supportPhone
  return {
    supportEmail,
    supportPhone,
    supportPhoneHref: supportPhone ? toPhoneHref(supportPhone) : '',
  }
}
