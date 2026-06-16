import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { fetchLeader, fetchLeaderSlugs } from '@/sanity/queries'
import { resolveImageUrl } from '@/sanity/resolveImage'

export const revalidate = 60

const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, '-')

type LocalLeader = {
  name: string
  title: string
  quote: string
  image: string
  linkedin: string
  email: string
  bio: string[]
}

const FALLBACK_TEAM: LocalLeader[] = [
  {
    name: 'Sakshi Mody',
    title: 'Promotor',
    quote: 'Progress rarely arrives with applause; it arrives when you keep going after the excitement fades.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=80',
    linkedin: 'https://www.linkedin.com/in/sakshi-mody-01b3512/',
    email: 'sakshi.mody@jlmorison.com',
    bio: [
      "Having majored in Media Studies and Political Science from the University of Virginia, USA, Sakshi was pursuing a career in journalism. Sakshi joined JLM at a time when the company was struggling post the exit of Nivea — both the top and bottom lines being under pressure.",
      "Over the last decade and a half, Sakshi has been able to transform the company from a distribution house for foreign brands in India to a home grown FMCG company which manufactures, markets and distributes its brands through its wide and integrated distribution network, hiring the best talent and adopting technology to enable business growth.",
      "Sakshi along with her team re-launched Morisons Baby Dreams in 2011 and is assiduously growing it as JLM's largest contributing brand by revenue. By 2015 we started our own baby products GMP factory in Kolkata producing our own feeding bottles, nipples and accessories with best in class imported machines. Bigen also backward integrated in 2016 to manufacturing locally at our erstwhile Nivea plant in Waluj, Aurangabad.",
      "Sakshi personally looks into the company's ESG and Corp Philanthropy initiatives. We have over the years increased our women participation to 10%, donated multiple volunteering hours to our community and have installed solar panels and rain water harvesting tanks at our factories.",
      "Our Project Kaamyaab is very close to Sakshi's heart — it is our philanthropy project where we skill underprivileged new mothers to get back into the work force post child birth to earn an additional income for their families, while we look after their young children in a day care facility at our centres in Turbhe and Bhayendar.",
      "Sakshi's leadership mantras: Teamwork is Dreamwork, and Consistency is the master key to Success.",
    ],
  },
  {
    name: 'Sohan Sarda',
    title: 'Executive Director',
    quote: "The future isn't built in grand moments—it is built in ordinary days repeated with intention.",
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=900&q=80',
    linkedin: 'https://www.linkedin.com/in/sohan-sarda-2b3a4958/',
    email: 'sohan.sarda@jlmorison.com',
    bio: [
      "Sohan is one of our longest serving employees at the senior management level. He joined JLM back in 2005 when it was a very different company from what it is today. Starting off as DGM Finance, Sohan has risen into Executive Director & CEO in 2017.",
      "During his tenure Sohan has successfully managed the amicable parting with Nivea and inducted in several other partners like Coty (Playboy fragrances), Merisant (Equal sweetener) and Hoyu Japan (Bigen hair dye).",
      "Sohan has been involved in a number of strategic profit improvement projects in the organisation including implementation of SAP back in 2013. He has played a critical leadership role and has been a key part of the company's growth and success.",
      "He is a member of the Institute of Chartered Accountants of India and the Institute of Company Secretaries of India and has completed certification of IFRS from ICAI.",
      "Sohan enjoys light reading and is a foodie.",
    ],
  },
  {
    name: 'Nitin Manchanda',
    title: 'Chief Operating Officer',
    quote: 'Talent may open a door, but curiosity keeps revealing new rooms.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=900&q=80',
    linkedin: 'https://www.linkedin.com/in/nitin-manchanda-bb2b84107/',
    email: 'nitin.manchanda@jlmorison.com',
    bio: [
      "Nitin joined JLM in April 2020 taking charge of the business at the peak of the COVID-19 crisis. Within three months of joining, Nitin relaunched our flagship brand Morisons in the Health and Home Care category in response to the pandemic, and was responsible for bringing our flagship baby care brand Morisons Baby Dreams into growth six months post joining.",
      "Nitin comes to JLM from the mighty ITC where he spent 20 years in Sales and Marketing functions. In his last role Nitin led the ₹1,250 cr Personal Care division at ITC as Divisional Manager Sales Head & Category Development, selling widely known brands like Fiama, Savlon, Charmis, Engage, and Vivel.",
      "He has worked in various divisions at ITC including Foods, Confectionaries and Personal Care at growing positions — starting as an Area Executive in 2001 handling a ₹6 cr business, through to Asst. Manager Maharashtra, Brand Manager, Branch Manager, and Regional Sales Manager West.",
      "With a keen focus on the big picture, Nitin has poised the business for sustainable growth with strong brands that have stood the test of time.",
      "Nitin holds a BE Electronics degree from Nagpur University and an MBA in Marketing from Centre for Management and Development at Modinagar. He is an avid reader with a special interest in Finance, and strongly believes in thinking big — all his business strategies carry the common theme of 'expanding possibilities.'",
    ],
  },
  {
    name: 'Anand Laxmanan',
    title: 'Head SCM',
    quote: 'A good idea changes your mind; a great idea changes your habits.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&q=80',
    linkedin: 'https://www.linkedin.com/in/anand-laxmanan-1b02592b/',
    email: 'anand.laxmanan@jlmorison.com',
    bio: [
      "Anand comes to JLM from Hindustan Unilever where he was Supply Chain Head for the Lakme Salon business. He has over 18 years of experience in supply chain management — 12 of those at HUL. Prior to HUL he was with Nestlé India where he spent 10 years in sales and supply chain roles.",
      "Anand believes that Supply Chain is a source of competitive advantage. Besides building strategy for exemplary service levels, he has also been working to build cost efficiencies enabling the Supply Chain function to become a fuel for JLM's growth.",
      "He holds a bachelor's degree in Commerce and has completed an Advanced Programme in Supply Chain Management from the Indian Institute of Management, Calcutta. Anand is an avid traveller and loves reading books.",
    ],
  },
  {
    name: 'Kavita Wagh',
    title: 'Head HR & OD',
    quote: "The strongest foundations are often invisible, which is why they're easy to underestimate.",
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&q=80',
    linkedin: 'https://www.linkedin.com/in/kavita-wagh-80933026/',
    email: 'kavita.wagh@jlmorison.com',
    bio: [
      "Kavita Wagh is a bonafide HR professional having worked in the field for over 18 years. Kavita is responsible for driving the HR and OD strategy at JL Morison. She has been instrumental in stabilising key OD initiatives like PMS and Rewards and Recognition at JLM. Working closely with the top management team, enhancement of engagement levels within the organisation has been a key focus for HR over the last few years.",
      "Prior to this, she was working with Mastek Limited for 8 years in the OD Team. A generalist in HR, Kavita holds a postgraduate degree from the Narsee Monjee Institute of Management Studies, Mumbai. Kavita is passionate about people and nurturing humanity. She enjoys music and travelling.",
      "Kavita strongly believes in 'Meaningful Work' — hence all the HR and OD strategies are designed towards providing a meaningful work experience for Morisoners.",
    ],
  },
  {
    name: 'Ashwani Kumar',
    title: 'Senior Manager IT',
    quote: "Success is not a destination you discover; it's a direction you choose every day.",
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=80',
    linkedin: 'https://linkedin.com',
    email: 'ashwani.kumar@jlmorison.com',
    bio: [
      "Ashwani comes to JLM from Dabur Group where he was heading the IT division for Dabur International (Dubai headquarters), bringing 20+ years of IT experience overall. Ashwani led the implementation of IT strategy, specifically business critical projects and the corporate IT program portfolio for Dabur International and all its subsidiaries across Egypt, Turkey, Nigeria, South Africa, US, UK, Iran, and Pakistan.",
      "Prior to Dabur, Ashwani worked with Perfetti Van Melle India and Bata India for more than 10 years combined, and was instrumental in taking their digital transformation journeys forward — especially ERP implementation and automating Sales processes through DMS, SFA, Distributor Claims and Business Intelligence solutions.",
      "Ashwani believes that Information Technology is no longer a back-office function but a critical business enabler. By adopting a Digital First approach and aligning IT strategy with business strategy, an organisation can transform into a mature digital enterprise.",
      "He holds a bachelor's degree in Commerce and a Master's in Computer Applications from Kurukshetra University. Ashwani is a techno-savvy professional keen to learn new disruptive technologies. He is passionate about an active lifestyle and loves playing Tennis.",
    ],
  },
  {
    name: 'Pratap Nikam',
    title: 'Head Manufacturing',
    quote: '/* Add quote here */',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80',
    linkedin: 'https://linkedin.com',
    email: 'pratap.nikam@jlmorison.com',
    bio: [
      "Pratap joined J.L. Morison in March 2023, bringing over 23 years of manufacturing experience in the FMCG industry. At JL Morison he leads factory operations of the Waluj Plant in Maharashtra (manufacturing facility for Bigen Hair Colour) and Rasoi Limited in Kolkata (manufacturing facility for a wide range of baby care products).",
      "Pratap has successfully led large-scale projects including factory expansions and sustainability initiatives, and has driven operational excellence for improving productivity and various cost optimisation projects.",
      "Prior to joining JL Morison, Pratap was with L'Oréal India for 15 years in various leadership roles, playing a key role in overseeing Contract Manufacturing Operations, ensuring seamless Production Planning, Quality Compliance, and Supply Chain efficiency.",
      "Pratap holds a Master's in Industrial Chemistry from Shivaji University and a Management degree from Symbiosis. Outside of work, Pratap is a fitness enthusiast, an avid cricket follower, and enjoys exploring music. He is a strong advocate of lean manufacturing and is passionate about driving continuous improvement across factories.",
    ],
  },
]

/** Resolve a leader from Sanity first, fall back to the hardcoded list. */
async function resolveLeader(slug: string): Promise<LocalLeader | null> {
  const sanityLeader = await fetchLeader(slug)
  if (sanityLeader) {
    const image = resolveImageUrl(sanityLeader.image, 900)
    if (image) {
      return {
        name: sanityLeader.name,
        title: sanityLeader.title,
        quote: sanityLeader.quote ?? '',
        image,
        linkedin: sanityLeader.linkedin ?? '',
        email: sanityLeader.email ?? '',
        bio: sanityLeader.bio ?? [],
      }
    }
  }
  return FALLBACK_TEAM.find((l) => slugify(l.name) === slug) ?? null
}

export async function generateStaticParams() {
  const sanitySlugs = await fetchLeaderSlugs()
  const fallbackSlugs = FALLBACK_TEAM.map((l) => slugify(l.name))
  const all = Array.from(new Set([...sanitySlugs, ...fallbackSlugs]))
  return all.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const leader = await resolveLeader(slug)
  if (!leader) return {}
  return {
    title: `${leader.name} — JL Morison (India) Ltd.`,
    description: leader.bio[0],
  }
}

export default async function LeaderProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const leader = await resolveLeader(slug)
  if (!leader) notFound()

  return (
    <div style={{ backgroundColor: '#111111', minHeight: '100%' }}>
      <div className="px-6 md:px-12 lg:px-16 pt-12 pb-24">

        {/* Back link */}
        <Link
          href="/leadership-team"
          className="inline-flex items-center gap-2 text-white/40 text-sm hover:text-white/70 transition-colors duration-200 mb-12"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Leadership team
        </Link>

        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
          {/* Photo + social icons */}
          <div className="flex-shrink-0 w-full md:w-[300px] lg:w-[360px]">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ aspectRatio: '3/4' }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={leader.image}
                  alt={leader.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>

            {/* LinkedIn + Email icon buttons */}
            <div className="flex items-center gap-3 mt-5">
              {leader.linkedin && (
                <a
                  href={leader.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-11 h-11 rounded-full bg-gray-200 hover:bg-gray-300 text-[#111111] flex items-center justify-center transition-all duration-200 hover:scale-105"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              )}
              {leader.email && (
                <a
                  href={`mailto:${leader.email}`}
                  aria-label="Email"
                  className="w-11 h-11 rounded-full bg-gray-200 hover:bg-gray-300 text-[#111111] flex items-center justify-center transition-all duration-200 hover:scale-105"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 pt-0 md:pt-6">
            <p className="text-white/40 text-sm tracking-[0.18em] uppercase mb-3">
              {leader.title}
            </p>
            <h1
              className="text-white mb-6"
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                fontFamily: 'Georgia, serif',
              }}
            >
              {leader.name}
            </h1>

            {/* Quote — max 2 lines, same width as bio */}
            <p
              className="text-white mb-8 overflow-hidden"
              style={{
                fontWeight: 900,
                fontStyle: 'italic',
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              &ldquo;{leader.quote}&rdquo;
            </p>

            <div className="space-y-5">
              {leader.bio.map((para, i) => (
                <p key={i} className="text-white/60 text-base leading-[1.8]">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
