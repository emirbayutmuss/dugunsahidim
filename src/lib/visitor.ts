const VISITOR_ID_KEY = 'ds_visitor_id'

/**
 * Anonim, tarayıcıya özel rastgele kimlik — kişisel veri değil, sadece
 * aynı ziyaretçinin görüntülenme/dönüşüm istatistiklerinde tekrar
 * sayılmasını önlemek için localStorage'da saklanır.
 */
export function getVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_ID_KEY)
    if (existing) return existing

    const generated = crypto.randomUUID()
    localStorage.setItem(VISITOR_ID_KEY, generated)
    return generated
  } catch {
    return crypto.randomUUID()
  }
}
