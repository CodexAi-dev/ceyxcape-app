import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BLOG_POSTS } from '../posts';

// ── Static post content ──────────────────────────────────────────────────────

type Section = { heading?: string; body: string; list?: string[] };
type PostContent = { intro: string; sections: Section[]; relatedTour: string };

const CONTENT: Record<string, PostContent> = {
  'best-time-to-visit-sri-lanka': {
    intro: "Sri Lanka is a year-round destination, but the weather varies dramatically by region. Understanding the two monsoon systems — the south-west (Yala) and north-east (Maha) — is the key to planning a flawless trip.",
    sections: [
      {
        heading: 'December – March: Peak Season (West & South Coast)',
        body: "The south-west coast, Cultural Triangle, and hill country are at their best. Expect clear skies, calm seas perfect for whale watching off Mirissa, and ideal conditions for Sigiriya and Kandy. Book at least 6–8 weeks ahead.",
      },
      {
        heading: 'April – September: Best for East Coast & North',
        body: "When the south-west monsoon drenches Colombo, the east coast (Trincomalee, Arugam Bay) is dry and spectacular. Whale sharks visit Trincomalee from April–September, and Arugam Bay hosts world-class surf from May–October.",
      },
      {
        heading: 'October – November: Shoulder Season',
        body: "Both coasts can experience rain, but inland destinations like Ella, Nuwara Eliya, and Kandy are often clear. This is the best time for budget travellers — prices drop 20–30% and sites are far less crowded.",
      },
      {
        heading: 'Month-by-Month Quick Guide',
        body: '',
        list: [
          'Jan: Ideal west/south coast, whale watching begins',
          'Feb: Peak beach season, Independence Day celebrations',
          'Mar: Last month of peak season, great diving at Hikkaduwa',
          'Apr: Sinhala & Tamil New Year — vibrant local atmosphere',
          'May: Vesak Poya — lanterns and dansalas island-wide',
          'Jun–Aug: East coast perfection, Yala safari in full swing',
          'Sep: Arugam Bay surf at its best',
          'Oct–Nov: Shoulder — fewer crowds, lower prices',
          'Dec: Christmas, New Year — festive Colombo, beach resorts fill up',
        ],
      },
      {
        heading: 'Pro Tip: Book Around Festivals',
        body: "The Kandy Esala Perahera (July/August) is one of Asia's greatest spectacles — 10 nights of elephants, fire dancers and drummers. Hotels book out months ahead. Plan early or miss out.",
      },
    ],
    relatedTour: '/tours?search_category=Beach+Tours',
  },
  'sri-lanka-7-day-itinerary': {
    intro: "Seven days is the sweet spot for first-time visitors — enough time to cover the Cultural Triangle, the hill country, and the south coast without feeling rushed. This is the exact route our guides recommend most.",
    sections: [
      { heading: 'Day 1 — Arrive in Colombo', body: "Airport pick-up, check into your Colombo hotel. Afternoon walking tour of Pettah Market, Galle Face Green, and the Dutch Hospital Precinct for dinner. Distance: 0 km driving." },
      { heading: 'Day 2 — Colombo → Sigiriya (4.5 hrs)', body: "Early departure north. Stop at Dambulla Cave Temple (1.5 hrs) — five caves of murals and 150 Buddha statues. Reach Sigiriya by early afternoon for the famous Lion Rock climb (allow 2 hrs). Overnight near Sigiriya." },
      { heading: 'Day 3 — Sigiriya → Kandy (3 hrs)', body: "Morning: Minneriya or Kaudulla National Park jeep safari — elephant gatherings of 200–300 animals are common Aug–Sep. Afternoon: drive to Kandy. Evening: Temple of the Tooth ceremony (6 PM or 9:30 PM puja)." },
      { heading: 'Day 4 — Kandy → Ella via Scenic Train (6 hrs)', body: "The Kandy–Ella train is rated one of the world's most scenic rail journeys. Board at Kandy Station (~8 AM) and ride through tea plantations, waterfalls and the famous Nine Arches Bridge. Arrive Ella by 2 PM. Hike Little Adam\'s Peak (45 min, easy)." },
      { heading: 'Day 5 — Ella → Mirissa (3.5 hrs)', body: "Morning walk to Ella Rock viewpoint for sunrise. Drive south through Tissa Maharama. Arrive Mirissa beach by early afternoon. Sunset boat trip or evening at the beach." },
      { heading: 'Day 6 — Mirissa → Galle (45 min)', body: "Optional sunrise whale watching (Dec–Apr). Drive to Galle Fort — a UNESCO World Heritage Site. Explore the ramparts, Dutch Reform Church, and boutique lanes. Overnight inside the fort for atmosphere." },
      { heading: 'Day 7 — Galle → Colombo Airport (2.5 hrs)', body: "Morning at leisure in Galle. Drive back to Colombo. Stop at Bentota Beach for a quick dip if time allows. Airport drop-off. Total driving: approx 650 km over 7 days — fully manageable with a private driver." },
      {
        heading: 'Estimated Budget (Private Tour)',
        body: '',
        list: [
          'Budget: $1,400–1,700 per person (twin share, 3-star hotels)',
          'Mid-range: $1,700–2,200 per person (4-star hotels)',
          'Luxury: $2,500–3,500+ per person (boutique hotels, private vehicle)',
          'Prices include: accommodation, private driver, most entry fees',
          'Excludes: international flights, personal shopping, alcohol',
        ],
      },
    ],
    relatedTour: '/tours?search_duration=7',
  },
  'top-10-places-to-visit-sri-lanka': {
    intro: "Sri Lanka packs an extraordinary variety into a relatively small island — ancient ruins, highland tea estates, jungle safaris, coral reefs and pristine beaches, often within a few hours of each other. Here are the ten places every visitor should see.",
    sections: [
      { heading: '1. Sigiriya Lion Rock', body: "Sri Lanka's most iconic landmark — a 5th-century palace perched on a 200m granite monolith. The frescoes of the celestial maidens halfway up are breathtaking. Entry: $25. Best time: 7–9 AM to beat the heat and crowds." },
      { heading: '2. Temple of the Tooth, Kandy', body: "Sri Lanka's most sacred Buddhist site, housing a relic of the Buddha's tooth. The evening puja ceremony (6 PM and 9:30 PM) with drumming and offerings is unmissable. Entry: $12." },
      { heading: '3. Galle Fort', body: "A UNESCO World Heritage Dutch colonial fort on the south-west coast. Boutique hotels, independent cafés and jewellery workshops line cobblestone streets within 17th-century ramparts. Entry: Free." },
      { heading: '4. Yala National Park', body: "The highest density of leopards in the world — plus elephants, sloth bears, crocodiles and hundreds of bird species. Half-day jeep safari from $18 + $15 vehicle fee. Best season: Feb–July." },
      { heading: '5. Ella', body: "The most photogenic village in the hill country. Nine Arches Bridge, Little Adam\'s Peak, Ella Rock, and the world-class scenic train journey from Kandy. Cool mountain air, great cafés, incredibly cheap guesthouses." },
      { heading: '6. Dambulla Cave Temple', body: "Five cave temples with over 150 Buddha statues and 2,100 sq metres of murals painted over 22 centuries. One of the best-preserved Buddhist complexes in Asia. Entry: $10." },
      { heading: '7. Mirissa', body: "Sri Lanka\'s whale watching capital (Dec–Apr for blue whales), and a beautiful crescent beach year-round. The Parrot Rock viewpoint at sunset is spectacular. Laid-back, uncrowded, excellent seafood." },
      { heading: '8. Anuradhapura', body: "Sri Lanka\'s ancient capital — 2,000-year-old stupas, the sacred Sri Maha Bodhi tree, moonstone steps and vast ruins spread over a huge area. A full day is needed. Entry: $15." },
      { heading: '9. Trincomalee', body: "Arguably the finest harbour bay in Asia. The east coast\'s best beaches (Nilaveli, Uppuveli), warm-water whale sharks (Apr–Sep), and the dramatic Koneswaram Hindu temple perched on a clifftop." },
      { heading: '10. Horton Plains & World\'s End', body: "A highland plateau at 2,100m with misty montane forest, a sheer 870m cliff drop at World\'s End, and Baker\'s Falls. Arrive before 9 AM to beat the clouds. Entry: $18. Bring a jacket." },
    ],
    relatedTour: '/tours?search_category=Cultural+Tours',
  },
  'sri-lanka-travel-cost-guide': {
    intro: "Sri Lanka is excellent value for money compared to most Asian destinations. Here's an honest, up-to-date breakdown of what you can expect to spend in 2026, across all budget levels.",
    sections: [
      {
        heading: 'Daily Budget by Travel Style',
        body: '',
        list: [
          'Backpacker ($25–40/day): dorm beds, local food, public transport, free beaches',
          'Budget independent ($60–90/day): guesthouses, local restaurants, occasional tuk-tuk',
          'Mid-range ($120–180/day): 3–4 star hotels, private driver, mix of restaurants',
          'Luxury ($250+/day): boutique hotels, private tours, fine dining, spa treatments',
        ],
      },
      {
        heading: 'Accommodation',
        body: '',
        list: [
          'Hostel dorm: $8–15/night',
          'Budget guesthouse (private room): $20–40/night',
          'Mid-range hotel (3-star): $50–90/night',
          'Boutique/heritage hotel: $120–250/night',
          'Luxury resort (Aman, Chena Huts): $400–900/night',
        ],
      },
      {
        heading: 'Food & Drink',
        body: '',
        list: [
          'Local rice & curry (local restaurant): $1.50–3',
          'Meal at a tourist restaurant: $6–12',
          'Fine dining (Colombo/Galle): $20–40 per person',
          'Fresh coconut (roadside): $0.50',
          'Lion Beer (restaurant): $2–4',
        ],
      },
      {
        heading: 'Transport',
        body: '',
        list: [
          'Private driver full day (with vehicle): $55–75',
          'Intercity taxi (Colombo–Kandy): $60–80',
          'Scenic train (Kandy–Ella 2nd class): $3',
          'Tuk-tuk (short city trip): $1–3',
          'Public bus (intercity): $0.50–2',
        ],
      },
      {
        heading: 'Must-See Entry Fees',
        body: '',
        list: [
          'Sigiriya Lion Rock: $25',
          'Temple of the Tooth, Kandy: $12',
          'Yala National Park safari: $18 + $15 vehicle',
          'Dambulla Cave Temple: $10',
          'Anuradhapura: $15',
          'Horton Plains: $18',
        ],
      },
      {
        heading: 'Sample 7-Day Budget',
        body: "Mid-range independent: accommodation $490 + food $280 + private driver $400 + entry fees $100 + extras $130 = approx $1,400 per person (twin share). Book tours through us and we include driver, entry fees and most meals — all-inclusive packages often work out cheaper than DIY.",
      },
    ],
    relatedTour: '/tours',
  },
  'travel-tips-first-time-visitors': {
    intro: "Sri Lanka is a relatively easy country to travel in — locals are warm, English is widely spoken in tourist areas, and infrastructure has improved enormously. But a few tips will make your trip significantly smoother.",
    sections: [
      {
        heading: 'Before You Go',
        body: '',
        list: [
          'Apply for your ETA (electronic travel authorisation) online before departure — $35, valid 30 days',
          'Check visa requirements for your nationality — most Western passports get 30-day tourist visas on arrival',
          'Vaccinations: no mandatory jabs, but Hepatitis A, Typhoid and routine vaccines recommended',
          'Travel insurance is strongly advised — cover for medical evacuation is important',
          'Book accommodation for the first 2 nights before arrival; the rest you can arrange as you go',
        ],
      },
      {
        heading: 'What to Pack',
        body: '',
        list: [
          'Light, breathable clothing (cotton/linen) — humidity is high year-round',
          'A sarong or scarf for temple visits (shoulders and knees must be covered)',
          'Reef-safe sunscreen — many local shops don\'t stock it',
          'Insect repellent (DEET 30%+)',
          'Comfortable walking shoes AND flip flops (you remove shoes at every temple)',
          'Power adapter (Type D/G — same as India/UK)',
          'Unlocked SIM-compatible phone — local Dialog SIM with 15GB data costs $5',
        ],
      },
      {
        heading: 'Cultural Etiquette',
        body: '',
        list: [
          'Never touch or pose touching a Buddha statue — it\'s deeply disrespectful',
          'Remove shoes before entering any temple or someone\'s home',
          'Dress modestly at religious sites — no bare shoulders or short shorts',
          'The left hand is considered unclean — use your right hand to give/receive',
          'Bargaining is acceptable at markets, not in restaurants or fixed-price shops',
          'Photographing people: always ask first',
        ],
      },
      {
        heading: 'Getting Around',
        body: "Private drivers are the most convenient option ($55–75/day all-in). They double as informal guides, handle parking, and can stop anywhere you want. Train travel is scenic and cheap — the Kandy–Ella route is world-class. Tuk-tuks for short hops in towns; always agree a price before getting in.",
      },
      {
        heading: 'Safety & Health',
        body: '',
        list: [
          'Sri Lanka is very safe for tourists — petty crime is rare compared to regional averages',
          'Drink bottled water; avoid tap water and ice at local establishments',
          'Be careful swimming at unguarded beaches — currents can be strong',
          'Don\'t feed or approach wild animals in national parks',
          'Keep small notes ($1–5) for tips and local purchases — large USD bills are hard to change',
          'Emergency: 119 (Police), 110 (Fire), 1990 (Suwa Seriya ambulance)',
        ],
      },
      {
        heading: '11 Insider Tips',
        body: '',
        list: [
          'Book Sigiriya for 7 AM — queues form fast after 9 AM',
          'The Kandy–Ella train sells out weeks ahead in peak season — book on 1stclasstrains.lk',
          'Mirissa whale watching: go Tuesday–Thursday; weekends get overcrowded with boats',
          'In Galle Fort, skip the overpriced restaurants on the main drag and eat at the local spots on Church Street',
          'ATMs: Sampath and Commercial Bank have the lowest foreign transaction fees',
          'Colombo traffic is brutal 7:30–9 AM and 4:30–7 PM — plan around it',
          'Sri Lankan curries at local "rice & curry" spots are far better (and 1/10 the price) of tourist restaurants',
          'Negotiate your tuk-tuk fare before getting in — always',
          'Visiting temples? Hire a licensed guide at the site rather than paying for a private one in advance',
          'Keep a paper copy of your passport and ETA — required at some national parks',
          'Say "Ayubowan" (ah-yoo-BOH-wan) as a greeting — locals love it',
        ],
      },
    ],
    relatedTour: '/tours',
  },
};

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | CeyXcape Blog`,
    description: post.excerpt,
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const content = CONTENT[params.slug];
  const related = BLOG_POSTS.filter((p) => p.slug !== params.slug).slice(0, 3);

  return (
    <div className="bg-white min-h-screen">

      {/* ── Hero image ── */}
      <div className="relative w-full" style={{ height: 'clamp(220px, 40vw, 420px)' }}>
        <Image src={post.image} alt={post.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/70 via-[#0f172a]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 pb-8">
          <nav className="flex items-center gap-2 text-xs text-white/60 mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white/80 line-clamp-1">{post.title}</span>
          </nav>
          <span className="inline-block text-[10px] font-bold uppercase tracking-[2px] px-2 py-1 mb-3 font-outfit"
            style={{ color: '#fff', backgroundColor: post.categoryColor }}>
            {post.category}
          </span>
          <h1 className="font-playfair font-bold text-white leading-tight" style={{ fontSize: 'clamp(1.5rem,4vw,2.8rem)' }}>
            {post.title}
          </h1>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-gray-400 font-outfit mb-8 pb-6 border-b border-gray-100">
          <span>By {post.author}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{post.date}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{post.readTime}</span>
        </div>

        {/* Intro */}
        <p className="text-gray-700 text-base leading-relaxed mb-8 font-outfit text-lg">{content.intro}</p>

        {/* Sections */}
        <div className="space-y-8">
          {content.sections.map((s, i) => (
            <div key={i}>
              {s.heading && (
                <h2 className="font-playfair font-bold text-[#0f172a] text-xl mb-3">{s.heading}</h2>
              )}
              {s.body && (
                <p className="text-gray-600 text-sm leading-relaxed font-outfit mb-3">{s.body}</p>
              )}
              {s.list && (
                <ul className="space-y-2">
                  {s.list.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-gray-600 font-outfit">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#b8962e] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 border border-gray-100 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[2px] text-[#b8962e] font-outfit mb-1">Ready to book?</p>
            <p className="font-playfair font-bold text-[#0f172a] text-lg">Turn this guide into your actual trip</p>
            <p className="text-gray-500 text-sm mt-1 font-outfit">Our team will build a personalised itinerary for you — free, within 24 hours.</p>
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            <Link href={content.relatedTour}
              className="px-6 py-3 bg-[#0f172a] text-white text-sm font-bold font-outfit hover:bg-[#1e293b] transition-colors inline-flex items-center gap-2 whitespace-nowrap">
              View Related Tours
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
              </svg>
            </Link>
            <Link href="/contact"
              className="px-6 py-3 border-2 border-[#0f172a] text-[#0f172a] text-sm font-bold font-outfit hover:bg-[#0f172a] hover:text-white transition-colors text-center whitespace-nowrap">
              Get a Free Itinerary
            </Link>
          </div>
        </div>

        {/* Related posts */}
        <div className="mt-12">
          <h3 className="font-playfair font-bold text-[#0f172a] text-xl mb-6">More from the blog</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`}
                className="group border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all overflow-hidden">
                <div className="relative h-32">
                  <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                </div>
                <div className="p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-outfit"
                    style={{ color: p.categoryColor }}>{p.category}</span>
                  <p className="font-playfair font-bold text-[#0f172a] text-sm leading-snug mt-1 line-clamp-2 group-hover:text-[#b8962e] transition-colors">
                    {p.title}
                  </p>
                  <p className="text-xs text-gray-400 font-outfit mt-1">{p.readTime}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}