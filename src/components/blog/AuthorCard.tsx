import Image from 'next/image'
import { DM_Sans } from 'next/font/google'

const dmSans = DM_Sans({ subsets: ['latin'] })

type Props = {
  name: string
  avatarUrl?: string
  role?: string
  bio?: string
}

/**
 * The "Written by …" block placed below every article.
 * Modelled on the Medium-style author footer the brief referenced.
 */
export default function AuthorCard({ name, avatarUrl, role, bio }: Props) {
  return (
    <section
      className={`${dmSans.className} mt-24 md:mt-32 pt-12 border-t border-[#E8E0D5]`}
    >
      <div className="flex items-start gap-5 md:gap-7">
        <div className="relative w-[72px] h-[72px] md:w-[88px] md:h-[88px] rounded-full overflow-hidden flex-shrink-0 bg-[#F4EFE7]">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              fill
              sizes="88px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#7A6438] text-2xl">
              {name.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[12px] tracking-[0.22em] uppercase text-[#888888] mb-1">
            Written by
          </p>
          <h3 className="text-[#111111] text-[22px] md:text-[26px] font-semibold leading-tight">
            {name}
          </h3>
          {role && (
            <p className="text-[#555555] text-[14px] mt-1">{role}</p>
          )}
          {bio && (
            <p className="text-[#333333] text-[15px] leading-[1.7] mt-4 max-w-xl">
              {bio}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
