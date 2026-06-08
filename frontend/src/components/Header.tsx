'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';

const NAV_LINKS = [
  { label: 'Home',       href: '/' },
  { label: 'About',      href: '/about' },
  { label: 'Tour Plans', href: '/tours' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Plan Your Tour', href: '/custom-tour' },
  { label: 'Gallery',    href: '/gallery' },
  { label: 'Blog',       href: '/blog' },
  { label: 'Contact',    href: '/contact' },
];

export function Header() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlist } = useWishlist();

  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profileRef = useRef<HTMLDivElement>(null);

  // The admin panel has its own chrome — hide the public header there.
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 44);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tours?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  if (isAdmin) return null;

  return (
    <>
      {/* ── Top Bar ── */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'h-0 overflow-hidden opacity-0' : 'h-[44px] opacity-100'
      } bg-[#0f172a]`}>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between text-sm">
          <div className="flex items-center gap-5 text-gray-300">
            <a href="tel:+94786281242" className="flex items-center gap-1.5 hover:text-[#d4af37] transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              +94 78 628 1242
            </a>
            <a href="mailto:info@ceyxcape.com" className="hidden sm:flex items-center gap-1.5 hover:text-[#d4af37] transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              info@ceyxcape.com
            </a>
          </div>
          <div className="flex items-center gap-3 text-gray-400 text-xs">
            <span className="hidden md:block">Mon–Sat: 9AM–6PM</span>
            <span className="w-px h-4 bg-gray-700" />
            <span className="font-semibold text-[#d4af37]">USD</span>
          </div>
        </div>
      </div>

      {/* ── Navbar ── */}
      <nav className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'top-0 shadow-lg bg-white/98 backdrop-blur-md' : 'top-[44px] bg-white shadow-sm'
      }`} style={{ height: 75 }}>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/images/logo2.png" alt="CeyXcape Tours" width={160} height={52} className="h-12 w-auto object-contain" priority />
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link href={link.href} className={`px-4 py-2 rounded-lg text-sm font-semibold font-outfit transition-all duration-200 ${
                  isActive(link.href)
                    ? 'text-[#d4af37] bg-[#d4af37]/10'
                    : 'text-slate-700 hover:text-[#d4af37] hover:bg-[#d4af37]/5'
                }`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Search */}
            <button onClick={() => setSearchOpen(v => !v)}
              className="p-2 text-slate-500 hover:text-[#d4af37] transition-colors rounded-lg hover:bg-[#d4af37]/5" aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 text-slate-500 hover:text-[#d4af37] transition-colors rounded-lg hover:bg-[#d4af37]/5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#d4af37] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => setProfileOpen(v => !v)}
                className="p-2 text-slate-500 hover:text-[#d4af37] transition-colors rounded-lg hover:bg-[#d4af37]/5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 py-2 z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2.5 border-b border-gray-100 mb-1">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-semibold text-[#2b4b7e] truncate">{user?.email}</p>
                      </div>
                      <DropdownLink href="/profile" icon="person">My Profile</DropdownLink>
                      <DropdownLink href="/wishlist" icon="heart">My Wishlist</DropdownLink>
                      {user?.role === 'admin' && <DropdownLink href="/admin" icon="shield">Admin Panel</DropdownLink>}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={logout}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2.5 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <DropdownLink href="/auth/login" icon="login">Sign In</DropdownLink>
                      <DropdownLink href="/auth/register" icon="register">Create Account</DropdownLink>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link href="/custom-tour"
              className="btn-gold px-5 py-2.5 rounded-xl text-sm ml-1">
              Design My Tour
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-1.5">
            <button onClick={() => setSearchOpen(v => !v)} className="p-2 text-slate-600 hover:text-[#d4af37]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            <Link href="/wishlist" className="relative p-2 text-slate-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#d4af37] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button onClick={() => setMobileOpen(v => !v)}
              className="p-2 text-slate-700" aria-label="Menu" aria-expanded={mobileOpen}>
              {mobileOpen
                ? <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                : <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
              }
            </button>
          </div>
        </div>
      </nav>

      {/* ── Floating Search ── */}
      <div className={`fixed left-0 right-0 z-30 transition-all duration-300 ${
        searchOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
      }`} style={{ top: scrolled ? 75 : 119 }}>
        <div className="max-w-2xl mx-auto px-4 py-3">
          <form onSubmit={handleSearch} className="flex gap-2 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.15)] rounded-2xl p-2 border border-[#d4af37]/20">
            <svg className="w-5 h-5 text-gray-400 self-center ml-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tours, destinations..." autoFocus={searchOpen}
              className="flex-1 px-3 py-2 text-sm outline-none text-slate-700 bg-transparent font-outfit" />
            <button type="submit" className="btn-gold px-5 py-2 rounded-xl text-sm">Search</button>
          </form>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <div className={`fixed inset-0 z-20 lg:hidden ${mobileOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-0 right-0 bottom-0 w-72 bg-white shadow-2xl transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-5 pt-24 flex flex-col h-full overflow-y-auto">
            {isAuthenticated && (
              <div className="mb-5 p-4 bg-[#fff9f0] rounded-xl border border-[#d4af37]/20">
                <p className="text-xs text-gray-400 mb-0.5">Welcome back</p>
                <p className="font-semibold text-[#2b4b7e]">{user?.first_name || user?.email}</p>
              </div>
            )}
            <ul className="space-y-0.5 mb-4">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive(link.href) ? 'text-[#d4af37] bg-[#d4af37]/10' : 'text-slate-700 hover:text-[#d4af37] hover:bg-[#d4af37]/5'
                  }`}>{link.label}</Link>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-100 pt-4 space-y-0.5">
              {isAuthenticated ? (
                <>
                  <Link href="/profile"   className="block px-4 py-3 text-sm font-semibold text-slate-700 hover:text-[#d4af37] hover:bg-[#d4af37]/5 rounded-xl">My Profile</Link>
                  {user?.role === 'admin' && <Link href="/admin" className="block px-4 py-3 text-sm font-semibold text-slate-700 hover:text-[#d4af37] hover:bg-[#d4af37]/5 rounded-xl">Admin Panel</Link>}
                  <button onClick={logout} className="w-full text-left px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl">Sign Out</button>
                </>
              ) : (
                <>
                  <Link href="/auth/login"    className="block px-4 py-3 text-sm font-semibold text-slate-700 hover:text-[#d4af37] hover:bg-[#d4af37]/5 rounded-xl">Sign In</Link>
                  <Link href="/auth/register" className="block px-4 py-3 text-sm font-semibold text-slate-700 hover:text-[#d4af37] hover:bg-[#d4af37]/5 rounded-xl">Create Account</Link>
                </>
              )}
            </div>
            <Link href="/custom-tour" className="btn-gold w-full justify-center mt-auto py-3 rounded-xl text-sm">
              Design My Tour
            </Link>
          </div>
        </div>
      </div>

      {/* ── Spacer ── */}
      <div style={{ height: scrolled ? 75 : 119 }} className="transition-all duration-300" />
    </>
  );
}

/* ── Dropdown Link ── */
const ICONS: Record<string, React.ReactNode> = {
  person:   <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  heart:    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  calendar: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  shield:   <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  login:    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>,
  register: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
};

function DropdownLink({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:text-[#d4af37] hover:bg-[#d4af37]/5 transition-colors">
      <span className="text-[#d4af37]/70">{ICONS[icon]}</span>
      {children}
    </Link>
  );
}
