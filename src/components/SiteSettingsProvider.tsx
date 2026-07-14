'use client'

import { createContext, useContext } from 'react'
import type { SiteSettings } from '@/sanity/queries'

/**
 * Makes the Sanity-managed site settings (footer content, etc.) available to
 * client components anywhere in the tree. The data is fetched once server-side
 * in the root layout and handed to this provider — components never fetch
 * Sanity client-side.
 */
const SiteSettingsContext = createContext<SiteSettings | null>(null)

export function SiteSettingsProvider({
  value,
  children,
}: {
  value: SiteSettings | null
  children: React.ReactNode
}) {
  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings(): SiteSettings | null {
  return useContext(SiteSettingsContext)
}
