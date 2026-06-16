/**
 * One-off import: pushes the 7 current leadership team members into Sanity.
 *
 * Run once with a write-permission token, then leadership data lives in
 * Sanity and can be edited from /studio. Photos can be uploaded inside the
 * Studio after this completes — the page falls back to a neutral placeholder
 * for any leader whose photo isn't uploaded yet.
 *
 * ────────────────────────────────────────────────────────────────
 * HOW TO RUN
 *
 * 1. Get a write token from Sanity:
 *    https://www.sanity.io/manage → your project → API → Tokens
 *    → "Add API token" → Name: "import-leaders" → Permissions: "Editor"
 *    → Copy the token (starts with `sk...`)
 *
 * 2. From the project root:
 *
 *      SANITY_API_TOKEN=sk... \
 *      NEXT_PUBLIC_SANITY_PROJECT_ID=abc12345 \
 *      NEXT_PUBLIC_SANITY_DATASET=production \
 *      node scripts/import-leaders.mjs
 *
 * 3. Refresh /studio → Our People → Leadership Team — all 7 leaders appear.
 *
 * 4. Delete the token at sanity.io/manage once the import is done so it
 *    can't be used again.
 * ────────────────────────────────────────────────────────────────
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId) {
  console.error('✘ Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
  process.exit(1)
}
if (!token) {
  console.error('✘ Missing SANITY_API_TOKEN (needs Editor permission)')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-10-01',
  token,
  useCdn: false,
})

const slugify = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const LEADERS = [
  {
    name: 'Sakshi Mody',
    title: 'Promotor',
    quote:
      'Progress rarely arrives with applause; it arrives when you keep going after the excitement fades.',
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
    quote:
      "The future isn't built in grand moments—it is built in ordinary days repeated with intention.",
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
    quote:
      "The strongest foundations are often invisible, which is why they're easy to underestimate.",
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
    linkedin: '',
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
    quote: '',
    linkedin: '',
    email: 'pratap.nikam@jlmorison.com',
    bio: [
      "Pratap joined J.L. Morison in March 2023, bringing over 23 years of manufacturing experience in the FMCG industry. At JL Morison he leads factory operations of the Waluj Plant in Maharashtra (manufacturing facility for Bigen Hair Colour) and Rasoi Limited in Kolkata (manufacturing facility for a wide range of baby care products).",
      "Pratap has successfully led large-scale projects including factory expansions and sustainability initiatives, and has driven operational excellence for improving productivity and various cost optimisation projects.",
      "Prior to joining JL Morison, Pratap was with L'Oréal India for 15 years in various leadership roles, playing a key role in overseeing Contract Manufacturing Operations, ensuring seamless Production Planning, Quality Compliance, and Supply Chain efficiency.",
      "Pratap holds a Master's in Industrial Chemistry from Shivaji University and a Management degree from Symbiosis. Outside of work, Pratap is a fitness enthusiast, an avid cricket follower, and enjoys exploring music. He is a strong advocate of lean manufacturing and is passionate about driving continuous improvement across factories.",
    ],
  },
]

async function main() {
  const transaction = client.transaction()

  LEADERS.forEach((leader, i) => {
    const slug = slugify(leader.name)
    const doc = {
      _id: `leader.${slug}`,
      _type: 'leader',
      name: leader.name,
      title: leader.title,
      slug: { _type: 'slug', current: slug },
      order: i + 1,
      quote: leader.quote || undefined,
      linkedin: leader.linkedin || undefined,
      email: leader.email || undefined,
      bio: leader.bio,
    }
    // createOrReplace: re-running the script is safe — it updates instead of duplicating
    transaction.createOrReplace(doc)
  })

  console.log(`Importing ${LEADERS.length} leaders into Sanity (${projectId}/${dataset})…`)
  const result = await transaction.commit()
  console.log(`✓ Done. Documents created/updated: ${result.results.length}`)
  console.log('  Open /studio → Our People → Leadership Team to verify.')
  console.log('  Photos can now be uploaded inside Studio per leader.')
}

main().catch((err) => {
  console.error('✘ Import failed:', err.message ?? err)
  process.exit(1)
})
