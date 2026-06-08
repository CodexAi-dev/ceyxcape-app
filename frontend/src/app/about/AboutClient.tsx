'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const STATS = [
  { value: '7+', label: 'Years of Excellence' },
  { value: '50+', label: 'Destinations Covered' },
  { value: '500+', label: 'Happy Travellers' },
  { value: '4.9', label: 'TripAdvisor Rating' },
];

const VALUES = [
  {
    title: 'Local Expertise',
    desc: 'Born and raised in Sri Lanka, our guides bring authentic insider knowledge to every journey — the hidden spots, the real stories, the genuine hospitality.',
  },
  {
    title: 'Tailored Experiences',
    desc: "No two trips are the same. Every itinerary is crafted around your interests, pace, and travel style — whether that's wildlife, heritage, beaches, or adventure.",
  },
  {
    title: 'Licensed & Insured',
    desc: 'Fully registered with Sri Lanka Tourism. Every tour vehicle, guide, and hotel partner is vetted to ensure your safety and peace of mind from arrival to departure.',
  },
  {
    title: 'Crafted with Heart',
    desc: 'We genuinely love what we do. That passion shows in every detail — the welcome drink, the sunset timing, the extra mile that turns a good trip into an unforgettable one.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Emma Williams',
    country: 'United Kingdom',
    rating: 5,
    text: "CeyXcape transformed our honeymoon into a fairy tale. Every detail was perfect — from the stunning hotels to the incredible wildlife safaris. We'll treasure these memories forever!",
    tour: 'Honeymoon Special',
  },
  {
    name: 'John Anderson',
    country: 'Australia',
    rating: 5,
    text: "Our family trip was unforgettable. The itinerary was perfectly balanced between relaxation and adventure. The kids loved it, and so did we! Couldn't ask for a better operator.",
    tour: 'Family Adventure',
  },
  {
    name: 'Sophia Brown',
    country: 'Germany',
    rating: 5,
    text: 'Best solo travel experience ever! I felt safe, inspired, and completely taken care of. Highly recommend CeyXcape for anyone looking to explore Sri Lanka in style.',
    tour: 'Cultural Explorer',
  },
];

const GALLERY = [
  { img: '/images/sigiriya1.webp', title: 'Sigiriya Rock', tag: 'Heritage', cls: 'col-span-2 row-span-2' },
  { img: '/images/yala.webp', title: 'Yala Safari', tag: 'Wildlife', cls: '' },
  { img: '/images/gallefort.webp', title: 'Galle Fort', tag: 'Heritage', cls: '' },
  { img: '/images/rafting.webp', title: 'White Water Rafting', tag: 'Adventure', cls: '' },
  { img: '/images/anuradhapura.webp', title: 'Ancient Ruins', tag: 'History', cls: '' },
  { img: '/images/thangalla.webp', title: 'Tangalle Beach', tag: 'Beach', cls: 'col-span-2' },
];

const CERTIFICATIONS = [
  { label: 'Sri Lanka Tourism Board', key: 'building' },
  { label: "Travellers' Choice Award", key: 'award' },
  { label: 'Registered Tour Operator', key: 'badge' },
  { label: 'Travel Insurance Partner', key: 'shield' },
];

const CERT_ICONS: Record<string, React.ReactNode> = {
  building: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M3 21h18" /><path d="M5 21V7l7-4 7 4v14" /><path d="M9 21v-5h6v5" />
      <path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
    </svg>
  ),
  award: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
  badge: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M12 2l2.39 1.79 2.98.18.92 2.84 2.4 1.79-.92 2.84.92 2.84-2.4 1.79-.92 2.84-2.98.18L12 22l-2.39-1.79-2.98-.18-.92-2.84-2.4-1.79.92-2.84-.92-2.84 2.4-1.79.92-2.84 2.98-.18z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  shield: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    const el = ref.current;
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-4 h-4 ${i <= n ? 'text-[#d4af37]' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

function ValueCard({ title, desc, index }: { title: string; desc: string; index: number }) {
  const icons = [
    <svg key="people" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>,
    <svg key="star" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>,
    <svg key="shield" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>,
    <svg key="heart" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>,
  ];
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal reveal-delay-${(index % 4) + 1} bg-white rounded-2xl p-6 border border-gray-100 shadow-card flex gap-5 group hover:border-[#d4af37]/40 hover:shadow-[0_8px_32px_rgba(212,175,55,0.12)] transition-all`}>
      <div className="w-12 h-12 rounded-xl bg-[#fff9f0] text-[#d4af37] flex items-center justify-center flex-shrink-0 group-hover:bg-[#d4af37] group-hover:text-white transition-all">
        {icons[index % icons.length]}
      </div>
      <div>
        <h3 className="font-playfair font-bold text-[#0f172a] text-lg mb-2">{title}</h3>
        <p className="text-gray-500 text-sm font-outfit leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function TestimonialCard({ t, index }: { t: typeof TESTIMONIALS[0]; index: number }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal reveal-delay-${index + 1} bg-[#fafafa] rounded-2xl p-6 border border-gray-100 flex flex-col`}>
      <svg className="w-8 h-8 text-[#d4af37]/30 mb-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
      </svg>
      <p className="text-gray-600 text-sm leading-relaxed font-outfit flex-1 mb-5">&ldquo;{t.text}&rdquo;</p>
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 flex items-center justify-center flex-shrink-0 text-[#d4af37] font-bold font-playfair text-lg">
          {t.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#0f172a] text-sm font-outfit">{t.name}</p>
          <p className="text-gray-400 text-xs font-outfit">{t.country}</p>
        </div>
        <Stars n={t.rating} />
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ height: 'clamp(320px, 52vw, 520px)' }}>
      {/* Full-bleed photo — intentionally visible */}
      <Image
        src="/images/company.webp"
        alt="CeyXcape team in Sri Lanka"
        fill
        priority
        className="object-cover object-center"
      />
      {/* Left-to-right gradient so text stays readable, right side shows the photo clearly */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-[#0f172a]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/40 via-transparent to-transparent" />

      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <nav className="flex items-center gap-2 text-xs font-outfit text-white/50 mb-5">
            <Link href="/" className="hover:text-[#d4af37] transition-colors">Home</Link>
            <span className="opacity-40">/</span>
            <span className="text-white/80">About Us</span>
          </nav>
          <p className="text-[#d4af37] text-xs font-semibold tracking-[4px] uppercase font-outfit mb-2">
            Ayubowan · Welcome
          </p>
          <h1 className="font-playfair font-bold text-white leading-tight mb-4" style={{ fontSize: 'clamp(2rem,5vw,3.2rem)' }}>
            Your Trusted Gateway to <span className="text-[#d4af37]">Sri Lanka</span>
          </h1>
          <div className="flex flex-wrap gap-3">
            <Link href="/tours" className="btn-gold px-5 py-2.5 rounded-xl text-sm font-semibold">
              Explore Tours
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
              </svg>
            </Link>
            <Link href="/contact" className="btn-outline-gold px-5 py-2.5 rounded-xl text-sm font-semibold">
              Contact Us
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
            {['Licensed by Sri Lanka Tourism', 'Fully Insured', '24/7 Local Support'].map(t => (
              <span key={t} className="inline-flex items-center gap-1.5 text-white/85 text-xs font-outfit">
                <svg className="w-4 h-4 text-[#d4af37] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8">
          {STATS.map((s, i) => (
            <div key={s.label} className={`text-center px-4 ${i > 0 ? 'md:border-l md:border-gray-100' : ''}`}>
              <p className="text-4xl font-bold font-playfair text-gold-gradient leading-none">{s.value}</p>
              <p className="text-gray-400 text-[0.7rem] font-semibold font-outfit tracking-[1.5px] uppercase mt-2.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StorySection() {
  const leftRef = useReveal();
  const rightRef = useReveal();
  return (
    <section className="section-py bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div ref={leftRef} className="reveal">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-[0_18px_48px_rgba(0,0,0,0.10)]">
                <Image src="/images/about1.webp" alt="CeyXcape Team in Sri Lanka"
                  width={600} height={520} className="w-full object-cover"
                  style={{ height: 'clamp(360px,45vw,520px)' }} />
              </div>
              <div className="absolute -bottom-5 left-6 bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] px-5 py-3.5 flex items-center gap-3">
                <p className="text-4xl font-bold font-playfair text-gold-gradient leading-none">7</p>
                <p className="text-[#0f172a] text-xs font-semibold font-outfit leading-tight">Years of<br/>Excellence</p>
              </div>
            </div>
          </div>
          <div ref={rightRef} className="reveal reveal-delay-2">
            <div className="section-badge mb-4">Our Story</div>
            <h2 className="font-playfair font-bold text-[#0f172a] mb-4 leading-tight" style={{ fontSize: 'clamp(1.8rem,4vw,2.4rem)' }}>
              Passionate About Sri Lanka<br/>
              <span className="text-gold-gradient">Since 2018</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              What started as a dream to share the magic of our homeland grew into a trusted travel partner
              for hundreds of adventurers worldwide. We believe travel is more than visiting places — it is
              about creating connections, understanding cultures, and making memories that last a lifetime.
            </p>
            <p className="text-gray-500 leading-relaxed text-sm mb-8">
              Our team of passionate local experts handles every detail — hotels, transport, guides, permits —
              so you can focus entirely on soaking in the wonder of Sri Lanka. From the first email to your
              safe return home, we are with you every step of the way.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {CERTIFICATIONS.map(c => (
                <div key={c.label}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-xs font-semibold font-outfit text-[#0f172a]">
                  <span className="text-[#d4af37]">{CERT_ICONS[c.key]}</span>
                  {c.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const headRef = useReveal();
  return (
    <section className="section-py bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4">
        <div ref={headRef} className="reveal text-center mb-10">
          <div className="section-badge mb-3">Why Choose Us</div>
          <h2 className="font-playfair font-bold text-[#0f172a]" style={{ fontSize: 'clamp(1.8rem,4vw,2.4rem)' }}>
            The CeyXcape Difference
          </h2>
          <p className="text-gray-500 font-outfit max-w-xl mx-auto mt-3">
            We don&apos;t just book hotels and transfer you to sites. We craft experiences with care, expertise, and a genuine love for Sri Lanka.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {VALUES.map((v, i) => <ValueCard key={v.title} title={v.title} desc={v.desc} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  const headRef = useReveal();
  return (
    <section className="section-py bg-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4">
        <div ref={headRef} className="reveal text-center mb-10">
          <div className="section-badge mb-3">Destinations</div>
          <h2 className="font-playfair font-bold text-white" style={{ fontSize: 'clamp(1.8rem,4vw,2.4rem)' }}>
            Discover Sri Lanka&apos;s Wonders
          </h2>
          <p className="text-gray-400 font-outfit max-w-xl mx-auto mt-3">
            From ancient UNESCO ruins to pristine beaches — the island offers infinite wonder.
          </p>
        </div>
        <div className="grid grid-cols-3 grid-rows-2 gap-3" style={{ height: 'clamp(400px,55vw,560px)' }}>
          {GALLERY.map((item, i) => (
            <Link key={i} href={`/tours?search=${encodeURIComponent(item.title)}`}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer ${item.cls}`}>
              <Image src={item.img} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <span className="block text-xs font-bold text-[#d4af37] font-outfit uppercase tracking-wider mb-1">{item.tag}</span>
                <h3 className="text-white font-playfair font-bold text-base leading-tight">{item.title}</h3>
              </div>
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const headRef = useReveal();
  return (
    <section className="section-py bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div ref={headRef} className="reveal text-center mb-10">
          <div className="section-badge mb-3">Testimonials</div>
          <h2 className="font-playfair font-bold text-[#0f172a]" style={{ fontSize: 'clamp(1.8rem,4vw,2.4rem)' }}>
            What Our Travellers Say
          </h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <Image src="/images/tripadvisor-logo.png" alt="TripAdvisor" width={120} height={24} className="object-contain opacity-70" />
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-4 h-4 text-[#00af87]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
              <span className="text-sm font-bold text-[#0f172a] font-outfit ml-1">4.9 / 5.0</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => <TestimonialCard key={t.name} t={t} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="section-py bg-[#fafafa]">
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative bg-[#0f172a] rounded-3xl overflow-hidden px-8 py-16 text-center">
          <div className="absolute inset-0 opacity-10">
            <Image src="/images/wild-elephants.webp" alt="" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#0f172a]/95 to-[#2b4b7e]/80" />
          <div className="relative">
            <div className="section-badge mx-auto w-fit mb-4">Start Planning</div>
            <h2 className="font-playfair font-bold text-white mb-3" style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)' }}>
              Ready to Explore Sri Lanka?
            </h2>
            <p className="text-gray-300 font-outfit mb-8 max-w-md mx-auto">
              Let&apos;s plan your perfect adventure together — tailor-made, stress-free, and unforgettable.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/tours" className="btn-gold px-7 py-3.5 rounded-xl text-sm font-semibold">
                Browse Tours
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
                </svg>
              </Link>
              <Link href="/contact" className="btn-outline-gold px-7 py-3.5 rounded-xl text-sm font-semibold">
                Get in Touch
              </Link>
              <a href="https://wa.me/94786281242?text=Hello!%20I%27m%20interested%20in%20a%20tour."
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] font-semibold font-outfit text-sm hover:bg-[#25D366]/30 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutClient() {
  return (
    <div>
      <HeroSection />
      <StatsBar />
      <StorySection />
      <ValuesSection />
      <GallerySection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
}