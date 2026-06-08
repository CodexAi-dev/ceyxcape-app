// Shared blog post data — used by listing page and individual post pages
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'best-time-to-visit-sri-lanka',
    title: 'Best Time to Visit Sri Lanka',
    excerpt: 'Discover the best months to visit Sri Lanka for different regions. Learn about weather patterns, monsoon seasons, and when to book for the ideal experience.',
    category: 'Travel Planning',
    categoryColor: '#0ea5e9',
    date: 'March 15, 2026',
    readTime: '8 min read',
    image: '/images/thangalla.webp',
    author: 'CeyXcape Tours',
  },
  {
    slug: 'sri-lanka-7-day-itinerary',
    title: 'Sri Lanka 7-Day Itinerary for First-Time Visitors',
    excerpt: 'The perfect 7-day route covering Sri Lanka\'s highlights: Colombo, Sigiriya, Kandy, and Galle. Day-by-day breakdown with travel tips and estimated costs.',
    category: 'Itineraries',
    categoryColor: '#10b981',
    date: 'March 15, 2026',
    readTime: '10 min read',
    image: '/images/sigiriya1.webp',
    author: 'CeyXcape Tours',
  },
  {
    slug: 'top-10-places-to-visit-sri-lanka',
    title: 'Top 10 Places to Visit in Sri Lanka',
    excerpt: 'Must-see attractions from the ancient Sigiriya Lion Rock to the beautiful beaches of Mirissa. Each destination with travel tips and what to do there.',
    category: 'Destinations',
    categoryColor: '#d4af37',
    date: 'March 15, 2026',
    readTime: '12 min read',
    image: '/images/kandy.webp',
    author: 'CeyXcape Tours',
  },
  {
    slug: 'sri-lanka-travel-cost-guide',
    title: 'Sri Lanka Travel Cost Guide 2026',
    excerpt: 'Complete breakdown of travel costs: accommodation, food, tours, and transportation. Budgets for all travel styles with money-saving tips.',
    category: 'Budget Guide',
    categoryColor: '#ef4444',
    date: 'March 15, 2026',
    readTime: '8 min read',
    image: '/images/ella.webp',
    author: 'CeyXcape Tours',
  },
  {
    slug: 'travel-tips-first-time-visitors',
    title: 'Sri Lanka Travel Tips for First-Time Visitors',
    excerpt: 'Essential tips for first-time travellers: what to pack, cultural etiquette, safety, best transport options, and local recommendations.',
    category: 'Travel Tips',
    categoryColor: '#8b5cf6',
    date: 'March 15, 2026',
    readTime: '11 min read',
    image: '/images/gallefort.webp',
    author: 'CeyXcape Tours',
  },
];