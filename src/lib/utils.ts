/**
 * Minimal `cn` class-name joiner.
 *
 * A dependency-free stand-in for the usual clsx + tailwind-merge combo — it
 * flattens falsy values so conditional classes work, which is all the
 * components in this project need. (No Tailwind conflict de-duplication; just
 * avoid passing conflicting utilities to the same element.)
 */
export type ClassValue = string | number | false | null | undefined

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ')
}
