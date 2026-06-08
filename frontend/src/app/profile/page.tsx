'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToastContext } from '@/context/ToastContext';
import { bookingService } from '@/services/bookings';
import { tourService } from '@/services/tours';
import { authService } from '@/services/auth';
import { Booking, Tour } from '@/types';

type Tab = 'profile' | 'bookings' | 'wishlist' | 'security';

function Spin() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  );
}

function Initials({ name, size = 40 }: { name: string; size?: number }) {
  const parts = name.trim().split(' ');
  const letters = (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className="rounded-full bg-[#003580] flex items-center justify-center font-bold text-white flex-shrink-0 uppercase"
    >
      {letters || '?'}
    </div>
  );
}

const BSTATUS: Record<string, string> = {
  confirmed: 'bg-green-50 text-green-700 border border-green-200',
  pending:   'bg-yellow-50 text-yellow-700 border border-yellow-200',
  cancelled: 'bg-red-50 text-red-600 border border-red-200',
  completed: 'bg-blue-50 text-blue-700 border border-blue-200',
};
const PSTATUS: Record<string, string> = {
  paid:    'bg-green-50 text-green-700 border border-green-200',
  pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  failed:  'bg-red-50 text-red-600 border border-red-200',
};

function Badge({ label, cls }: { label: string; cls: string }) {
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize font-outfit ${cls}`}>{label}</span>;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateProfile, isLoading: authLoading } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { success, error: toastErr } = useToastContext();

  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<Tab>('profile');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bLoading, setBLoading] = useState(false);
  const [bLoaded, setBLoaded]   = useState(false);

  const [wTours, setWTours]     = useState<Tour[]>([]);
  const [wLoading, setWLoading] = useState(false);
  const [wLoaded, setWLoaded]   = useState(false);

  // Edit profile
  const [editing, setEditing]     = useState(false);
  const [ev, setEv]               = useState({ first_name: '', last_name: '', phone: '' });
  const [saving, setSaving]       = useState(false);

  // Password
  const [pv, setPv]               = useState({ current: '', next: '', confirm: '' });
  const [pe, setPe]               = useState<Record<string,string>>({});
  const [pSaving, setPSaving]     = useState(false);
  const [showPw, setShowPw]       = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (authLoading) return;
    if (isAuthenticated) return;
    if (!localStorage.getItem('ceyxcape_auth_token')) router.push('/auth/login');
  }, [mounted, authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) setEv({ first_name: user.first_name ?? '', last_name: user.last_name ?? '', phone: user.phone ?? '' });
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated || !mounted) return;
    if (tab === 'bookings' && !bLoaded) {
      setBLoading(true);
      bookingService.getBookings().then(r => { setBookings(r.data); setBLoaded(true); }).catch(() => setBLoaded(true)).finally(() => setBLoading(false));
    }
    if (tab === 'wishlist' && !wLoaded) {
      if (wishlist.length === 0) { setWLoaded(true); return; }
      setWLoading(true);
      tourService.getTours({ limit: 100 }).then(r => { setWTours(r.data.filter(t => wishlist.includes(t.id))); setWLoaded(true); }).catch(() => setWLoaded(true)).finally(() => setWLoading(false));
    }
  }, [tab, isAuthenticated, mounted]); // eslint-disable-line

  const saveProfile = async () => {
    if (!ev.first_name.trim() || !ev.last_name.trim()) { toastErr('Name fields are required.'); return; }
    setSaving(true);
    try { await updateProfile(ev); setEditing(false); } catch { toastErr('Could not update profile.'); } finally { setSaving(false); }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string,string> = {};
    if (!pv.current) errs.current = 'Required';
    if (!pv.next) errs.next = 'Required';
    else if (pv.next.length < 8) errs.next = 'Min 8 characters';
    else if (!/[A-Z]/.test(pv.next)) errs.next = 'Needs uppercase letter';
    else if (!/[0-9]/.test(pv.next)) errs.next = 'Needs a number';
    if (pv.confirm !== pv.next) errs.confirm = 'Passwords do not match';
    if (Object.keys(errs).length) { setPe(errs); return; }
    setPSaving(true);
    try {
      await authService.changePassword(pv.current, pv.next);
      success('Password updated.', 'Security');
      setPv({ current: '', next: '', confirm: '' }); setPe({});
    } catch (err: any) { toastErr(err.response?.data?.message || 'Failed to change password.'); }
    finally { setPSaving(false); }
  };

  // ── Loading / no-user guard ──────────────────────────────────────────────
  if (!mounted) {
    return <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center"><Spin /></div>;
  }

  const cachedUser = (() => {
    try { const r = localStorage.getItem('ceyxcape_user'); return r ? JSON.parse(r) : null; } catch { return null; }
  })();
  const u = user ?? cachedUser;

  if (!u) {
    return <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center"><Spin /></div>;
  }

  const fullName = `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() || u.email;

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'profile',  label: 'Personal details' },
    { id: 'bookings', label: 'Bookings', count: bookings.length || undefined },
    { id: 'wishlist', label: 'Saved',    count: wishlist.length || undefined },
    { id: 'security', label: 'Security' },
  ];

  // shared input style
  const inp = (err?: string) =>
    `w-full text-sm font-outfit bg-white border rounded px-3 py-2 focus:outline-none focus:border-[#003580] transition-colors ${err ? 'border-red-400' : 'border-gray-300'}`;

  return (
    <div className="min-h-screen bg-[#f2f2f2]">

      {/* ── Top bar ── */}
      <div className="bg-[#003580]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Initials name={fullName} size={38} />
            <div>
              <p className="text-white font-semibold text-sm font-outfit leading-tight">{fullName}</p>
              <p className="text-blue-200 text-xs font-outfit">{u.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/tours" className="text-blue-200 hover:text-white text-xs font-outfit transition-colors hidden sm:block">Browse tours</Link>
            <button
              onClick={() => { logout(); router.push('/'); }}
              className="text-xs text-blue-200 hover:text-white font-outfit transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="bg-[#003580] border-t border-blue-700">
        <div className="max-w-5xl mx-auto px-4 flex gap-0">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold font-outfit border-b-2 transition-colors whitespace-nowrap ${
                tab === t.id
                  ? 'border-white text-white'
                  : 'border-transparent text-blue-300 hover:text-white hover:border-blue-300'
              }`}
            >
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-5">

          {/* ── Left summary card ── */}
          <div className="lg:w-64 flex-shrink-0 space-y-3">

            {/* Profile summary */}
            <div className="bg-white border border-gray-200 rounded p-4">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <Initials name={fullName} size={44} />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm font-outfit leading-tight truncate">{fullName}</p>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-outfit uppercase tracking-wide ${
                    u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-[#003580]'
                  }`}>
                    {u.role === 'admin' ? 'Admin' : 'Member'}
                  </span>
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-outfit">Bookings</span>
                  <span className="text-xs font-bold text-gray-900 font-outfit">{bookings.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-outfit">Saved tours</span>
                  <span className="text-xs font-bold text-gray-900 font-outfit">{wishlist.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-outfit">Member since</span>
                  <span className="text-xs font-bold text-gray-900 font-outfit">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Nav shortcuts */}
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-outfit border-l-2 transition-colors text-left ${
                    tab === t.id
                      ? 'border-l-[#003580] bg-blue-50 text-[#003580] font-semibold'
                      : 'border-l-transparent text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {t.label}
                  <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              ))}
            </div>

            {/* Help card */}
            <div className="bg-white border border-gray-200 rounded p-4">
              <p className="text-xs font-semibold text-gray-900 font-outfit mb-1">Need help?</p>
              <p className="text-xs text-gray-500 font-outfit mb-3">Our team is available 24/7 for support.</p>
              <Link href="/contact" className="block w-full text-center text-xs font-semibold font-outfit text-[#003580] border border-[#003580] rounded py-2 hover:bg-[#003580] hover:text-white transition-colors">
                Contact support
              </Link>
            </div>
          </div>

          {/* ── Main panel ── */}
          <div className="flex-1 min-w-0">

            {/* PERSONAL DETAILS */}
            {tab === 'profile' && (
              <div className="bg-white border border-gray-200 rounded">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 font-outfit">Personal details</h2>
                    <p className="text-xs text-gray-400 font-outfit mt-0.5">Update your name and contact info</p>
                  </div>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="text-xs font-semibold font-outfit text-[#003580] hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {editing ? (
                  <div className="px-5 py-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 font-outfit mb-1">First name</label>
                        <input value={ev.first_name} onChange={e => setEv(p => ({...p, first_name: e.target.value}))}
                          className={inp()} placeholder="John" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 font-outfit mb-1">Last name</label>
                        <input value={ev.last_name} onChange={e => setEv(p => ({...p, last_name: e.target.value}))}
                          className={inp()} placeholder="Doe" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 font-outfit mb-1">Phone (optional)</label>
                      <input value={ev.phone} onChange={e => setEv(p => ({...p, phone: e.target.value}))}
                        className={inp()} placeholder="+94 77 123 4567" />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button onClick={saveProfile} disabled={saving}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#003580] text-white text-xs font-semibold font-outfit rounded hover:bg-[#00266a] disabled:opacity-60 transition-colors">
                        {saving ? <><Spin /> Saving...</> : 'Save changes'}
                      </button>
                      <button
                        onClick={() => { setEditing(false); setEv({ first_name: u.first_name ?? '', last_name: u.last_name ?? '', phone: u.phone ?? '' }); }}
                        className="px-4 py-2 text-xs font-semibold font-outfit text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {[
                      { label: 'First name',    value: u.first_name },
                      { label: 'Last name',     value: u.last_name  },
                      { label: 'Email address', value: u.email      },
                      { label: 'Phone number',  value: u.phone      },
                      { label: 'Account role',  value: u.role === 'admin' ? 'Administrator' : 'Member' },
                    ].map(row => (
                      <div key={row.label} className="flex items-center px-5 py-3">
                        <span className="w-36 text-xs text-gray-400 font-outfit flex-shrink-0">{row.label}</span>
                        <span className="text-sm text-gray-900 font-outfit font-medium">{row.value || <span className="text-gray-300 font-normal">Not set</span>}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* BOOKINGS */}
            {tab === 'bookings' && (
              <div className="bg-white border border-gray-200 rounded">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="text-sm font-bold text-gray-900 font-outfit">Your bookings</h2>
                  <p className="text-xs text-gray-400 font-outfit mt-0.5">All your CeyXcape tour bookings</p>
                </div>
                <div className="px-5 py-4">
                  {bLoading ? (
                    <div className="flex items-center justify-center py-12 gap-2 text-gray-400"><Spin /><span className="text-xs font-outfit">Loading bookings...</span></div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-14">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-gray-700 font-outfit mb-1">No bookings yet</p>
                      <p className="text-xs text-gray-400 font-outfit mb-4">Your confirmed tours will appear here.</p>
                      <Link href="/tours" className="inline-block px-4 py-2 bg-[#003580] text-white text-xs font-semibold font-outfit rounded hover:bg-[#00266a] transition-colors">
                        Browse tours
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookings.map(b => (
                        <div key={b.id} className="border border-gray-200 rounded p-4 hover:border-[#003580]/30 hover:shadow-sm transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 font-outfit leading-snug">{b.tour?.name ?? 'Tour'}</p>
                              <p className="text-[11px] text-gray-400 font-outfit mt-0.5">Ref: <span className="font-semibold text-gray-600">{b.booking_code}</span></p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500 font-outfit">
                                <span>📅 {new Date(b.tour_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                <span>👥 {b.participants} {b.participants === 1 ? 'guest' : 'guests'}</span>
                              </div>
                            </div>
                            <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                              <p className="text-base font-bold text-gray-900 font-outfit">${Number(b.total_amount).toLocaleString()}</p>
                              <div className="flex gap-1.5 flex-wrap sm:justify-end">
                                <Badge label={b.booking_status} cls={BSTATUS[b.booking_status] ?? 'bg-gray-50 text-gray-500 border border-gray-200'} />
                                <Badge label={b.payment_status} cls={PSTATUS[b.payment_status] ?? 'bg-gray-50 text-gray-500 border border-gray-200'} />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* WISHLIST / SAVED */}
            {tab === 'wishlist' && (
              <div className="bg-white border border-gray-200 rounded">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="text-sm font-bold text-gray-900 font-outfit">Saved tours</h2>
                  <p className="text-xs text-gray-400 font-outfit mt-0.5">Tours you bookmarked to revisit</p>
                </div>
                <div className="px-5 py-4">
                  {wishlist.length === 0 ? (
                    <div className="text-center py-14">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-gray-700 font-outfit mb-1">Nothing saved yet</p>
                      <p className="text-xs text-gray-400 font-outfit mb-4">Tap the heart on any tour to save it here.</p>
                      <Link href="/tours" className="inline-block px-4 py-2 bg-[#003580] text-white text-xs font-semibold font-outfit rounded hover:bg-[#00266a] transition-colors">
                        Explore tours
                      </Link>
                    </div>
                  ) : wLoading ? (
                    <div className="flex items-center justify-center py-12 gap-2 text-gray-400"><Spin /><span className="text-xs font-outfit">Loading...</span></div>
                  ) : (
                    <div className="space-y-3">
                      {wTours.map(t => (
                        <div key={t.id} className="flex gap-3 border border-gray-200 rounded p-3 hover:border-[#003580]/30 hover:shadow-sm transition-all group">
                          <div className="relative w-20 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                            {t.image
                              ? <Image src={t.image} alt={t.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300"/>
                              : <div className="w-full h-full bg-gray-100"/>
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 font-outfit leading-snug line-clamp-1">{t.name}</p>
                            <p className="text-xs text-gray-400 font-outfit mt-0.5 capitalize">{t.category} · {t.duration} {t.duration === 1 ? 'day' : 'days'}</p>
                            <p className="text-sm font-bold text-[#003580] font-outfit mt-1">${Number(t.price).toLocaleString()} <span className="text-xs font-normal text-gray-400">/ person</span></p>
                          </div>
                          <div className="flex flex-col items-end justify-between flex-shrink-0">
                            <button
                              onClick={() => removeFromWishlist(t.id)}
                              title="Remove"
                              className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                              </svg>
                            </button>
                            <Link href={`/tours/${t.id}`} className="text-xs font-semibold font-outfit text-[#003580] hover:underline">
                              View →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SECURITY */}
            {tab === 'security' && (
              <div className="bg-white border border-gray-200 rounded">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="text-sm font-bold text-gray-900 font-outfit">Security</h2>
                  <p className="text-xs text-gray-400 font-outfit mt-0.5">Manage your password</p>
                </div>
                <div className="px-5 py-5">
                  <p className="text-xs font-semibold text-gray-700 font-outfit mb-4">Change password</p>
                  <form onSubmit={savePassword} className="space-y-3 max-w-sm">
                    {([
                      { label: 'Current password', key: 'current' as const, ph: 'Current password' },
                      { label: 'New password',     key: 'next'    as const, ph: 'Min 8 chars, uppercase & number' },
                      { label: 'Confirm new',      key: 'confirm' as const, ph: 'Repeat new password' },
                    ] as const).map(f => (
                      <div key={f.key}>
                        <label className="block text-xs text-gray-500 font-outfit mb-1">{f.label}</label>
                        <input
                          type={showPw ? 'text' : 'password'}
                          value={pv[f.key]}
                          onChange={e => { setPv(p => ({...p, [f.key]: e.target.value})); setPe(p => ({...p, [f.key]: ''})); }}
                          placeholder={f.ph}
                          className={inp(pe[f.key])}
                        />
                        {pe[f.key] && <p className="text-red-500 text-xs mt-1 font-outfit">{pe[f.key]}</p>}
                      </div>
                    ))}
                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input type="checkbox" checked={showPw} onChange={e => setShowPw(e.target.checked)} className="accent-[#003580] w-3.5 h-3.5"/>
                      <span className="text-xs font-outfit text-gray-500">Show passwords</span>
                    </label>
                    <button type="submit" disabled={pSaving}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#003580] text-white text-xs font-semibold font-outfit rounded hover:bg-[#00266a] disabled:opacity-60 transition-colors">
                      {pSaving ? <><Spin /> Saving...</> : 'Update password'}
                    </button>
                  </form>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-700 font-outfit mb-3">Account actions</p>
                    <button
                      onClick={() => { logout(); router.push('/'); }}
                      className="text-xs font-outfit text-red-500 hover:text-red-700 transition-colors flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      Sign out of all devices
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
