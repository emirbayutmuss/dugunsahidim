import { useEffect } from 'react'

const SITE_NAME = 'Düğün Şahidim'
// TODO: gerçek domain canlıya alınınca güncellenmeli
const SITE_URL = 'https://dugunsahidim.com'
const DEFAULT_OG_IMAGE = '/gallery/wedding-reception.jpg'

interface DocumentMetaOptions {
  title: string
  description: string
  ogImage?: string
  ogType?: 'website' | 'article'
}

function upsertMetaTag(attr: 'name' | 'property', key: string, content: string): void {
  let element = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, key)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

export function useDocumentMeta({
  title,
  description,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
}: DocumentMetaOptions): void {
  useEffect(() => {
    document.title = title

    upsertMetaTag('name', 'description', description)
    upsertMetaTag('property', 'og:site_name', SITE_NAME)
    upsertMetaTag('property', 'og:title', title)
    upsertMetaTag('property', 'og:description', description)
    upsertMetaTag('property', 'og:type', ogType)
    upsertMetaTag('property', 'og:image', `${SITE_URL}${ogImage}`)
    upsertMetaTag('property', 'og:url', `${SITE_URL}${window.location.pathname}`)
  }, [title, description, ogImage, ogType])
}
