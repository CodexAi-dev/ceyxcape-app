// ─────────────────────────────────────────────────────────────
// Destination content — powers /destinations and /destinations/[slug].
// These are LOCATION-KEYWORD landing pages (e.g. "Sigiriya tours",
// "things to do in Galle") — a core organic-search strategy.
//
// `tourMatch` is a lowercase string used to find related tours by
// matching the tour's location/name (so each destination page links
// to relevant bookable tours).
// ─────────────────────────────────────────────────────────────

export type DestinationSection = { heading: string; body: string };

export type Destination = {
  slug: string;
  name: string;
  region: string;
  image: string; // path under /public
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  highlights: string[];
  sections: DestinationSection[];
  bestTime: string;
  howToGet: string;
  tourMatch: string[]; // lowercase keywords to match related tours
};

export const DESTINATIONS: Destination[] = [
  {
    slug: 'sigiriya',
    name: 'Sigiriya',
    region: 'Cultural Triangle',
    image: '/images/sigiriya1.webp',
    tagline: 'The Lion Rock — Sri Lanka’s 8th wonder',
    metaTitle: 'Sigiriya Tours & Lion Rock Guide | Things to Do | CeyXcape',
    metaDescription:
      'Plan your visit to Sigiriya Lion Rock, a UNESCO World Heritage Site. Climbing tips, best time to visit, nearby Dambulla caves, and private Sigiriya tours from Colombo.',
    intro:
      'Rising 200 metres from the central plains, Sigiriya (Lion Rock) is Sri Lanka’s most iconic landmark — a 5th-century royal fortress crowned with palace ruins, ancient frescoes, and the famous Mirror Wall. It is the highlight of the Cultural Triangle and one of the best-preserved ancient urban sites in Asia.',
    highlights: [
      'Climb the 1,200 steps to the summit palace ruins',
      'See the 1,500-year-old Sigiriya frescoes',
      'Explore the water gardens and Lion’s Paw terrace',
      'Combine with Dambulla Cave Temple nearby',
    ],
    sections: [
      {
        heading: 'Climbing Sigiriya Rock',
        body: 'The climb takes 1.5–3 hours round trip via a series of staircases. Start early (around 7am) to beat the heat and crowds. The final ascent passes the giant Lion’s Paws and reaches the royal palace ruins with panoramic jungle views.',
      },
      {
        heading: 'Sigiriya vs Pidurangala',
        body: 'For the best photo of Sigiriya itself, climb neighbouring Pidurangala Rock — a shorter, cheaper hike that rewards you with a head-on view of the Lion Rock, especially at sunrise.',
      },
      {
        heading: 'Nearby attractions',
        body: 'Dambulla Cave Temple (20 minutes away) and the ancient cities of Polonnaruwa and Anuradhapura make Sigiriya the perfect base for exploring the Cultural Triangle.',
      },
    ],
    bestTime: 'January to April — dry, clear mornings ideal for climbing.',
    howToGet: 'About 3.5–4 hours by private car from Colombo or the airport (BIA).',
    tourMatch: ['sigiriya', 'cultural', 'dambulla'],
  },
  {
    slug: 'galle',
    name: 'Galle',
    region: 'Southern Coast',
    image: '/images/gallefort.webp',
    tagline: 'Historic Dutch fort by the sea',
    metaTitle: 'Galle Fort Tours & Things to Do | Southern Sri Lanka | CeyXcape',
    metaDescription:
      'Discover Galle Fort, a UNESCO World Heritage Dutch fortress. Walk the ramparts, explore boutiques and cafés, and book a private Galle day trip from Colombo.',
    intro:
      'Galle is the jewel of Sri Lanka’s south coast — a 17th-century Dutch fortified city of cobbled streets, colonial mansions, art galleries and ocean-view ramparts. The UNESCO-listed Galle Fort is one of the best-preserved colonial sea forts in Asia and a favourite for photographers and slow travellers.',
    highlights: [
      'Walk the historic Galle Fort ramparts at sunset',
      'Visit the iconic Galle Lighthouse',
      'Browse boutique shops, cafés and art galleries',
      'Relax at nearby Unawatuna and Jungle Beach',
    ],
    sections: [
      {
        heading: 'Exploring Galle Fort',
        body: 'The fort is best explored on foot. Wander the narrow streets lined with Dutch-era buildings, stop at the lighthouse and Flag Rock, and watch local boys dive from the ramparts into the sea.',
      },
      {
        heading: 'Beaches near Galle',
        body: 'Unawatuna, Jungle Beach and Dalawella are all within 15 minutes — golden sand, calm bays and the famous palm-tree rope swing.',
      },
    ],
    bestTime: 'December to April — sunny and dry along the south coast.',
    howToGet: 'About 1.5–2 hours by private car from Colombo via the Southern Expressway.',
    tourMatch: ['galle', 'beach', 'heritage'],
  },
  {
    slug: 'kandy',
    name: 'Kandy',
    region: 'Hill Country',
    image: '/images/kandy.webp',
    tagline: 'Sacred hill capital of the last kings',
    metaTitle: 'Kandy Tours & Temple of the Tooth | Things to Do | CeyXcape',
    metaDescription:
      'Visit Kandy, home of the sacred Temple of the Tooth Relic, the Royal Botanical Gardens and Kandyan dance. Plan a private Kandy tour from Colombo.',
    intro:
      'Kandy is Sri Lanka’s cultural heart — the last royal capital, set around a tranquil lake in the misty hills. It is home to the Temple of the Sacred Tooth Relic (Sri Dalada Maligawa), one of Buddhism’s most revered shrines, and the gateway to the tea-country hills.',
    highlights: [
      'Worship at the Temple of the Sacred Tooth Relic',
      'Stroll the Royal Botanical Gardens at Peradeniya',
      'Watch a traditional Kandyan dance performance',
      'Walk around scenic Kandy Lake',
    ],
    sections: [
      {
        heading: 'Temple of the Tooth',
        body: 'The Sri Dalada Maligawa houses a tooth relic of the Buddha. Time your visit for a daily puja (offering) ceremony for the most atmospheric experience. Dress modestly — shoulders and knees covered.',
      },
      {
        heading: 'Gateway to tea country',
        body: 'Kandy is the start of the famous hill-country train line to Ella and Nuwara Eliya — one of the world’s most scenic rail journeys.',
      },
    ],
    bestTime: 'Year-round; July/August for the Esala Perahera festival.',
    howToGet: 'About 3 hours by private car from Colombo.',
    tourMatch: ['kandy', 'cultural', 'temple'],
  },
  {
    slug: 'ella',
    name: 'Ella',
    region: 'Hill Country',
    image: '/images/ella.webp',
    tagline: 'Misty mountain village & Nine Arch Bridge',
    metaTitle: 'Ella Tours, Nine Arch Bridge & Little Adam’s Peak | CeyXcape',
    metaDescription:
      'Explore Ella in Sri Lanka’s hill country — the Nine Arch Bridge, Little Adam’s Peak, Ella Rock and tea plantations. Book a private Ella tour.',
    intro:
      'Ella is a laid-back mountain village surrounded by tea plantations, waterfalls and cloud forests. Famous for the Nine Arch Bridge and easy hikes with jaw-dropping views, it is the most beloved stop in Sri Lanka’s hill country for both backpackers and luxury travellers.',
    highlights: [
      'Photograph a train crossing the Nine Arch Bridge',
      'Hike Little Adam’s Peak (easy, 45 min)',
      'Climb Ella Rock for valley views',
      'Visit Ravana Falls and a working tea factory',
    ],
    sections: [
      {
        heading: 'The Nine Arch Bridge',
        body: 'This colonial-era railway viaduct, set deep in the jungle, is Ella’s signature sight. Check the train timetable to capture the classic shot of a blue train crossing the arches.',
      },
      {
        heading: 'The scenic train to Ella',
        body: 'The Kandy/Nuwara Eliya to Ella train ride is rated among the most beautiful in the world, winding past tea estates, waterfalls and mountain ridges.',
      },
    ],
    bestTime: 'January to March for the clearest mountain views.',
    howToGet: 'About 6 hours by car from Colombo, or via the scenic hill-country train.',
    tourMatch: ['ella', 'adventure', 'nine arch'],
  },
  {
    slug: 'yala',
    name: 'Yala National Park',
    region: 'Southern Wilderness',
    image: '/images/yala.webp',
    tagline: 'Leopard country — Sri Lanka’s top safari',
    metaTitle: 'Yala Safari Tours | Leopards & Wildlife | Sri Lanka | CeyXcape',
    metaDescription:
      'Go on a Yala National Park safari — home to the world’s highest density of leopards, plus elephants, crocodiles and exotic birds. Book a private Yala jeep safari.',
    intro:
      'Yala National Park, on Sri Lanka’s southeast coast, is the country’s premier wildlife destination. It boasts the highest density of leopards on Earth, alongside elephants, sloth bears, crocodiles, and hundreds of bird species across its lagoons and scrub jungle.',
    highlights: [
      'Spot Sri Lankan leopards on a jeep safari',
      'See wild elephants, buffalo and crocodiles',
      'Birdwatch across lagoons and wetlands',
      'Sunrise and afternoon game drives available',
    ],
    sections: [
      {
        heading: 'Safari tips',
        body: 'Early-morning game drives offer the best leopard sightings and cooler temperatures. A half-day private safari with an experienced tracker dramatically improves your chances of a sighting.',
      },
      {
        heading: 'When to go',
        body: 'February to July is the dry season, when animals gather around waterholes and visibility is best. Block 1 is the most wildlife-rich zone.',
      },
    ],
    bestTime: 'February to July (dry season). Park usually closed in September.',
    howToGet: 'About 5 hours by private car from Colombo; close to the south-coast beaches.',
    tourMatch: ['yala', 'safari', 'wildlife'],
  },
  {
    slug: 'mirissa',
    name: 'Mirissa',
    region: 'Southern Coast',
    image: '/images/mirissa.webp',
    tagline: 'Whale watching & palm-fringed beaches',
    metaTitle: 'Mirissa Whale Watching & Beach Guide | Sri Lanka | CeyXcape',
    metaDescription:
      'Visit Mirissa for world-class blue whale watching and golden beaches. Best time to go, what to expect, and private Mirissa tours from Colombo or Galle.',
    intro:
      'Mirissa is a relaxed south-coast beach town famous for blue whale watching — one of the best places on the planet to see the largest animal that has ever lived. Outside whale season it’s a postcard of palm-lined sand, surf breaks and sunset cocktails.',
    highlights: [
      'Blue and sperm whale watching boat tours',
      'Relax on Mirissa’s golden crescent beach',
      'Climb Coconut Tree Hill for the classic photo',
      'Surf, snorkel, or watch the sunset',
    ],
    sections: [
      {
        heading: 'Whale watching season',
        body: 'November to April is peak season for blue and sperm whales off Mirissa. Boats depart early morning; trips last 3–5 hours. Sightings are common but never guaranteed — go with a responsible operator.',
      },
    ],
    bestTime: 'November to April for whales and calm seas.',
    howToGet: 'About 2.5 hours by private car from Colombo; 40 minutes from Galle.',
    tourMatch: ['mirissa', 'whale', 'beach'],
  },
];

export function getDestination(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}
