'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const QUICK_LINKS = [
  { label: 'Home',            href: '/' },
  { label: 'Tours & Packages', href: '/tours' },
  { label: 'About Us',        href: '/about' },
  { label: 'Gallery',         href: '/gallery' },
  { label: 'Blog',            href: '/blog' },
  { label: 'Contact',         href: '/contact' },
];

const POPULAR_TOURS = [
  { label: 'Cultural Triangle',  href: '/tours?search_category=Cultural+Tours' },
  { label: 'Wildlife Safari',    href: '/tours?search_category=Wildlife+Safari' },
  { label: 'Beach Paradise',     href: '/tours?search_category=Beach+Tours' },
  { label: 'Tea Country',        href: '/tours?search_category=Tea+Country' },
  { label: 'Adventure Tours',    href: '/tours?search_category=Adventure+Tours' },
  { label: 'Custom Tour',        href: '/custom-tour' },
];

const SOCIALS = [
  {
    label: 'Facebook', href: 'https://www.facebook.com/share/1GNHmqAngR/',
    icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  },
  {
    label: 'Instagram', href: 'https://www.instagram.com/ceyxcape',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  },
  {
    label: 'YouTube', href: 'https://www.youtube.com/@ceyxcape',
    icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>,
  },
  {
    label: 'WhatsApp', href: 'https://wa.me/94786281242',
    icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>,
  },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-[#0f172a] text-gray-300">
      {/* ── Main Footer ── */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* About */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <Image src="/images/logo2.png" alt="CeyXcape" width={140} height={45} className="h-10 w-auto brightness-200 opacity-90" />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Your trusted partner for discovering the wonders of Sri Lanka. We create personalized travel experiences that showcase the best of our beautiful island nation.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3">
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#d4af37] flex items-center justify-center transition-all duration-200 hover:scale-110">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold font-outfit text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-6 h-px bg-[#d4af37]" />
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(link => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm text-gray-400 hover:text-[#d4af37] transition-colors flex items-center gap-2 group">
                    <svg className="w-3 h-3 text-[#d4af37]/50 group-hover:text-[#d4af37] transition-colors" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tours */}
          <div>
            <h3 className="text-white font-semibold font-outfit text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-6 h-px bg-[#d4af37]" />
              Popular Tours
            </h3>
            <ul className="space-y-2.5">
              {POPULAR_TOURS.map(t => (
                <li key={t.label}>
                  <Link href={t.href}
                    className="text-sm text-gray-400 hover:text-[#d4af37] transition-colors flex items-center gap-2 group">
                    <svg className="w-3 h-3 text-[#d4af37]/50 group-hover:text-[#d4af37] transition-colors" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold font-outfit text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-6 h-px bg-[#d4af37]" />
              Contact Info
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-gray-400">
                <svg className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span>61/38, Indrajothi road, Pannipitiya road, Battaramulla, Sri Lanka</span>
              </li>
              <li>
                <a href="tel:+94786281242" className="flex gap-3 text-sm text-gray-400 hover:text-[#d4af37] transition-colors">
                  <svg className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  +94 78 628 1242
                </a>
              </li>
              <li>
                <a href="mailto:info@ceyxcape.com" className="flex gap-3 text-sm text-gray-400 hover:text-[#d4af37] transition-colors">
                  <svg className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  info@ceyxcape.com
                </a>
              </li>
              <li className="flex gap-3 text-sm text-gray-400">
                <svg className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Mon–Sat: 9AM–6PM
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© 2018–2026 CeyXcape. All rights reserved. Designed with ❤️ in Sri Lanka</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[#d4af37] transition-colors">Privacy Policy</Link>
            <span className="w-px h-3 bg-gray-700" />
            <Link href="/terms"   className="hover:text-[#d4af37] transition-colors">Terms of Service</Link>
            <span className="w-px h-3 bg-gray-700" />
            <Link href="/sitemap" className="hover:text-[#d4af37] transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
