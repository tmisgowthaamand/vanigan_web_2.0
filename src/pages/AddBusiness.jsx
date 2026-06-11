import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { businessService } from '../services/api';
import { authService, webAuthService, session } from '../services/api';
import { districtAssemblies, districts as tnDistricts } from '../data/constituencies';
import { subCategoriesFor } from '../data/subCategories';
import {
  CheckCircle,
  Plus,
  Trash2,
  Image as ImageIcon,
  MessageCircle,
  Camera,
  Loader2,
  AlertCircle,
  X,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

const AddBusiness = () => {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [showPlatformSelector, setShowPlatformSelector] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');

  // If the owner arrived here from Login/Signup, prefill the verification phone
  // (either a bounced new-member phone, or their logged-in account phone).
  useEffect(() => {
    const auth = session.get();
    const sessionPhone =
      auth?.user?.phone ||
      sessionStorage.getItem('vanigan_signup_phone') ||
      sessionStorage.getItem('vanigan_owner_phone');
    if (sessionPhone && sessionPhone.length >= 10) {
      setWhatsappNumber(sessionPhone);
    }
  }, []);

  // Post-registration PIN setup (secures the owner account for My Business login)
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinStatus, setPinStatus] = useState('idle'); // idle | loading | done | error
  const [pinError, setPinError] = useState('');
  const [pinProgress, setPinProgress] = useState(''); // live retry feedback

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subCategory: '',
    description: '',
    district: '',
    assembly: '',
    address: '',
    landmark: '',
    areas: '',
    city: '',
    pincode: '',
    whatsappNo: '',
    whatsappPrimary: '',
    landline: '',
    alternatePhone: '',
    email: '',
    website: '',
    socialLinks: {},
    openingDays: [],
    openingTime: '',
    closingTime: '',
    faqQuestion: '',
    faqAnswer: '',
    bannerImage: null,
    profileImage: null,
    gallery: [],
    services: []
  });

  useEffect(() => {
    if (step === 2) {
      setFormData(prev => ({ ...prev, whatsappNo: whatsappNumber }));
    }
  }, [step, whatsappNumber]);

  useEffect(() => {
    // Reset assembly when district changes
    if (formData.district) {
      setFormData(prev => ({ ...prev, assembly: '' }));
    }
  }, [formData.district]);

  useEffect(() => {
    // Reset sub-category when the category changes
    setFormData(prev => ({ ...prev, subCategory: '' }));
  }, [formData.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const long = pos.coords.longitude.toFixed(6);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&addressdetails=1`);
          const data = await res.json();
          setFormData(prev => ({ ...prev, address: data?.display_name || `Lat: ${lat}, Long: ${long}` }));
        } catch {
          setFormData(prev => ({ ...prev, address: `Lat: ${lat}, Long: ${long}` }));
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('Submitting your registration...');

    try {
      // Prepare FormData for multipart submission.
      // The backend (Multer) expects these exact file field names:
      //   coverImage     ← banner photo
      //   image          ← profile / logo photo
      //   galleryImages  ← gallery (multiple allowed)
      // Any other file field name is rejected with HTTP 500 "Unexpected field".
      const FILE_FIELD_MAP = {
        bannerImage: 'coverImage',
        profileImage: 'image',
      };
      const SKIP = new Set(['bannerImage', 'profileImage', 'gallery']);

      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (SKIP.has(key)) return; // handled explicitly below
        if (key === 'services' || key === 'socialLinks') {
          data.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] instanceof File) {
          data.append(key, formData[key]);
        } else if (formData[key] != null) {
          data.append(key, formData[key]);
        }
      });

      // Map single image uploads to the backend's expected field names.
      Object.entries(FILE_FIELD_MAP).forEach(([localKey, apiKey]) => {
        if (formData[localKey] instanceof File) {
          data.append(apiKey, formData[localKey]);
        }
      });

      // Gallery: backend expects the "galleryImages" field, supports multiple.
      (formData.gallery || []).forEach(file => {
        if (file instanceof File) data.append('galleryImages', file);
      });

      await businessService.add(data);
      setStatus('success');
      setMessage('Registration Successful!');
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || error.response?.data?.error || 'Error submitting registration. Please try again.');
    }
  };

  // Set the owner PIN after a successful registration.
  //
  // Two real-world issues are handled here:
  //  1) Phone field mismatch — the backend matches the PIN against the phone
  //     stored on the business. Depending on what the owner filled in, that
  //     could be the primary WhatsApp number or the verification number, so we
  //     try each distinct candidate.
  //  2) Indexing delay — right after registration the new listing isn't
  //     query-matchable for a while on the live DB, so set-pin returns
  //     404 {error:'Business not found.'}. We retry with a progressive backoff
  //     (up to ~60s total) and show live feedback instead of failing fast.
  const handleSetPin = async () => {
    setPinError('');
    if (pin.length < 4) { setPinError('Enter a 4-digit PIN.'); return; }
    if (pin !== confirmPin) { setPinError('PINs do not match.'); return; }

    const norm = (v) => (v || '').replace(/\D/g, '').slice(-10);
    const candidates = [...new Set(
      [formData.whatsappPrimary, formData.whatsappNo, whatsappNumber]
        .map(norm)
        .filter((p) => p.length === 10)
    )];
    if (candidates.length === 0) {
      setPinError('Could not determine your registered phone number.');
      return;
    }

    setPinStatus('loading');
    setPinProgress('Securing your account…');

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    // Progressive backoff between attempts (ms). Sums to ~60s so we comfortably
    // outlast the post-registration indexing lag on the live backend.
    const BACKOFFS = [2000, 3000, 4000, 5000, 6000, 8000, 10000, 10000, 12000];
    const MAX_ATTEMPTS = BACKOFFS.length + 1;
    let notFound = false;
    let alreadySet = false;
    let otherError = false;

    // On a successful PIN set we log the owner in. If they already have an
    // account (web-auth), we link this business to it and refresh via /me so
    // the dashboard + navbar reflect the account session. Otherwise we fall
    // back to the legacy verify-pin business object.
    const establishSession = async (ownerPhone) => {
      // Try the account model first.
      try {
        const me = await webAuthService.me(ownerPhone);
        if (me?.user) {
          let auth = me;
          // Link the freshly registered business if the account has none.
          if (!me.business) {
            try {
              const verify = await authService.verifyPin(ownerPhone, pin);
              const bizId = verify?._id || verify?.business?._id;
              if (bizId) {
                await webAuthService.linkBusiness(ownerPhone, bizId).catch(() => {});
                const refreshed = await webAuthService.me(ownerPhone).catch(() => null);
                if (refreshed?.user) auth = refreshed;
                else auth = { ...me, business: verify?._id ? verify : verify?.business };
              }
            } catch {
              // keep the account session without a linked business
            }
          }
          session.set(auth);
          return;
        }
      } catch {
        // No web-auth account — fall through to the legacy owner session.
      }

      // Legacy fallback: persist the owner business from verify-pin.
      sessionStorage.setItem('vanigan_owner_phone', ownerPhone);
      localStorage.setItem('vanigan_owner_phone', ownerPhone);
      try {
        const res = await authService.verifyPin(ownerPhone, pin);
        const biz =
          res?.business ||
          res?.data?.business ||
          (Array.isArray(res?.businesses) ? res.businesses[0] : null) ||
          (res && res._id ? res : null);
        if (biz) {
          const bizStr = JSON.stringify(biz);
          sessionStorage.setItem('vanigan_owner_business', bizStr);
          localStorage.setItem('vanigan_owner_business', bizStr);
        }
      } catch {
        // Session phone is enough; My Business will look the business up.
      }
    };

    // For each attempt, try every phone candidate. A "Business not found"
    // result is retryable (indexing delay); anything else is terminal.
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      notFound = false;
      for (const ownerPhone of candidates) {
        try {
          await authService.setPin(ownerPhone, pin);
          setPinProgress('Signing you in…');
          await establishSession(ownerPhone);
          setPinStatus('done');
          // Hand the user straight to their dashboard (full load so the navbar
          // picks up the new session and shows "My Business").
          window.location.href = '/my-business';
          return;
        } catch (err) {
          const apiErr = err?.response?.data?.error;
          const status = err?.response?.status;
          if (apiErr === 'pin_already_set' || status === 409) { alreadySet = true; break; }
          if (apiErr === 'Business not found.' || status === 404) { notFound = true; continue; }
          otherError = true;
        }
      }
      if (alreadySet || otherError) break;
      if (!notFound) break; // succeeded or hit a terminal state above
      if (attempt < MAX_ATTEMPTS - 1) {
        setPinProgress(`Finalizing your new listing… (attempt ${attempt + 2} of ${MAX_ATTEMPTS})`);
        await sleep(BACKOFFS[attempt]); // wait for indexing, then retry
      }
    }

    setPinProgress('');
    if (alreadySet) {
      // The PIN already exists — just verify it and log the owner in.
      for (const ownerPhone of candidates) {
        try {
          await authService.verifyPin(ownerPhone, pin);
          await establishSession(ownerPhone);
          setPinStatus('done');
          window.location.href = '/my-business';
          return;
        } catch {
          // try the next candidate
        }
      }
      setPinError('A PIN is already set for this business. Please use it on the Login page.');
    } else if (notFound) {
      setPinError('Your listing is still being finalized on our servers. This can take up to a minute for new registrations — please tap "Set PIN & Confirm" again.');
    } else {
      setPinError('Could not set PIN. Please try again.');
    }
    setPinStatus('error');
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-lacquer flex flex-col pt-20">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-raised rounded-[24px] sm:rounded-[3rem] p-7 sm:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-rule text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-graphite rounded-4xl flex items-center justify-center text-kinpaku mx-auto mb-6 sm:mb-8 border border-kinpaku shadow-sm">
              <CheckCircle size={44} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-champagne mb-3 tracking-tight">Success!</h2>
            <p className="text-muted text-[13px] mb-8 font-bold uppercase tracking-widest leading-relaxed px-2">Your business registration has been submitted successfully.</p>

            {pinStatus === 'done' ? (
              <div className="mb-8 p-5 bg-graphite rounded-2xl border border-[rgba(61,177,173,0.4)] text-left">
                <p className="text-patina text-[13px] font-bold flex items-center gap-2 mb-1"><ShieldCheck size={16} /> PIN set successfully</p>
                <p className="text-muted text-[12px] font-medium leading-relaxed">You're being signed in to "My Business"…</p>
              </div>
            ) : (
              <div className="mb-8 p-5 sm:p-6 bg-lacquer-deep rounded-2xl border border-rule text-left">
                <p className="text-champagne text-[13px] font-black uppercase tracking-wider mb-1 flex items-center gap-2"><ShieldCheck size={16} className="text-kinpaku" /> Set Your Security PIN</p>
                <p className="text-muted text-[12px] font-medium leading-relaxed mb-4">Create a 4-digit PIN. We'll log you straight into your My Business dashboard.</p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input type="password" inputMode="numeric" maxLength={4} value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setPinError(''); }} placeholder="PIN" className="bg-raised border border-rule rounded-xl py-3 px-4 text-center text-[16px] font-bold tracking-[0.3em] text-champagne outline-none focus:border-kinpaku/50 placeholder:tracking-normal placeholder:text-faint" />
                  <input type="password" inputMode="numeric" maxLength={4} value={confirmPin} onChange={(e) => { setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setPinError(''); }} placeholder="Confirm" className="bg-raised border border-rule rounded-xl py-3 px-4 text-center text-[16px] font-bold tracking-[0.3em] text-champagne outline-none focus:border-kinpaku/50 placeholder:tracking-normal placeholder:text-faint" />
                </div>
                {pinError && <p className="text-warning text-[12px] font-medium mb-3">{pinError}</p>}
                {pinStatus === 'loading' && pinProgress && <p className="text-patina text-[12px] font-medium mb-3">{pinProgress}</p>}
                <button onClick={handleSetPin} disabled={pinStatus === 'loading'} className="w-full py-3.5 bg-graphite border border-kinpaku/50 text-kinpaku rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-kinpaku hover:text-lacquer-deep transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {pinStatus === 'loading' ? <><Loader2 size={15} className="animate-spin" /> Setting PIN…</> : 'Set PIN & Confirm'}
                </button>
              </div>
            )}

            <button onClick={() => window.location.href = '/'} className="w-full py-5 sm:py-6 bg-kinpaku text-lacquer-deep rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[rgba(232,119,34,0.3)] hover:bg-kinpaku-rich transition-all active:scale-95">Back to Home</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lacquer pt-28 pb-20 selection:bg-[rgba(232,119,34,0.28)] selection:text-champagne">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Header */}
        <div className="bg-raised rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 mb-8 sm:mb-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-rule">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-champagne tracking-tighter mb-2">Register Your Business</h1>
              <p className="text-muted text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-patina animate-pulse"></span>
                Step {step} of 2 — {step === 1 ? 'Verification' : 'Business Details'}
              </p>
            </div>
            <div className="flex gap-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-12 bg-kinpaku' : 'w-4 bg-[#3A332A]'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {step === 1 ? (
          /* Step 1: Verification Refined - White & Red Theme */
          <div className="bg-raised rounded-[24px] sm:rounded-[40px] p-6 sm:p-10 md:p-16 shadow-[0_30px_60px_-12px_rgba(225,29,72,0.12)] border border-kinpaku/50 animate-in fade-in zoom-in-95 duration-700">
            <div className="max-w-md mx-auto space-y-10">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-black text-champagne tracking-tight">Start Your Business <span className="text-kinpaku">Journey</span></h2>
                <p className="text-muted text-[16px] font-medium leading-relaxed">
                  Connect your WhatsApp to verify your identity and unlock your premium business dashboard.
                </p>
              </div>

              <div className="space-y-8 pt-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-kinpaku">
                    <div className="w-8 h-8 bg-graphite rounded-lg flex items-center justify-center">
                      <MessageCircle size={18} />
                    </div>
                    <label className="text-[11px] font-black uppercase tracking-widest">Official WhatsApp Number</label>
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full bg-lacquer-deep border-2 border-rule rounded-2xl px-5 sm:px-8 py-4 sm:py-6 outline-none focus:border-kinpaku/30 focus:bg-raised transition-all text-champagne text-xl font-bold placeholder:text-faint"
                  />
                </div>

                <div className="space-y-8">
                  <button
                    onClick={() => whatsappNumber.length >= 10 && setStep(2)}
                    className="w-full bg-kinpaku text-lacquer-deep py-5 sm:py-7 rounded-2xl text-[13px] sm:text-[15px] font-black uppercase tracking-[0.2em] sm:tracking-[0.35em] flex items-center justify-center gap-6 hover:bg-kinpaku-rich shadow-2xl shadow-[rgba(232,119,34,0.3)] hover:-translate-y-1 transition-all group"
                  >
                    GET STARTED NOW <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform duration-500" />
                  </button>

                  <div className="flex items-center gap-4 px-6 py-4 bg-graphite rounded-2xl border border-kinpaku/50">
                    <CheckCircle className="text-kinpaku shrink-0" size={18} />
                    <p className="text-muted text-[11px] font-bold uppercase tracking-tight leading-relaxed">
                      Your form data will be saved automatically in a new secure session.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Step 2: Form */
          <form onSubmit={handleSubmit} className="bg-raised rounded-[24px] sm:rounded-[40px] p-6 sm:p-10 md:p-16 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-rule space-y-12 sm:space-y-16 animate-in slide-in-from-bottom-10 duration-700">

            {/* Status Messages */}
            {status !== 'idle' && (
              <div className={`p-6 rounded-3xl border flex items-center gap-4 ${status === 'success' ? 'bg-graphite border-[rgba(61,177,173,0.4)] text-patina' : (status === 'error' ? 'bg-raised border-warning/40 text-warning' : 'bg-lacquer-deep border-rule text-ink')}`}>
                {status === 'loading' && <div className="w-5 h-5 border-2 border-kinpaku border-t-transparent rounded-full animate-spin" />}
                {status === 'success' && <CheckCircle size={20} />}
                {status === 'error' && <AlertCircle size={20} />}
                <p className="text-sm font-black uppercase tracking-wider">{message}</p>
              </div>
            )}

            {/* 1. IDENTITY & DESCRIPTION */}
            <div className="space-y-10 group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-kinpaku rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[rgba(232,119,34,0.2)]">1</div>
                <h3 className="text-kinpaku text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] sm:tracking-[0.4em]">Essential Business Identity</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Business Name <span className="text-kinpaku">*</span></label>
                  <input name="name" value={formData.name} onChange={handleChange} className="form-input-light" placeholder="How do your customers know you?" required />
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Category <span className="text-kinpaku">*</span></label>
                  <div className="relative">
                    <select name="category" value={formData.category} onChange={handleChange} className="form-input-light appearance-none pr-12" required>
                      <option value="">Select Category</option>
                      {[
                        "Hospitals & Clinics", "Transport", "Electricals & Electronics", "Education", "Sports",
                        "Real Estate", "Spa & Beauty", "Digital & IT Products", "Hire Services", "Automobile",
                        "B2B Services", "Banquets & Event Halls", "Bills & Recharge", "Caterers", "Civil Contractors",
                        "Daily Needs", "Doctors", "Jobs", "Jewellery", "Labs & Diagnostics", "Banking & Finance",
                        "Packers & Movers", "Wedding Services", "Hotels & Restaurants", "Repairs", "IT & Software",
                        "Construction Materials", "Pest Control", "Agriculture", "Printing Services",
                        "Textiles & Garments", "Travel & Tourism", "Home Appliances", "Demand Services",
                        "Religious", "Organic Products", "Advertising", "Insurance", "Advocate & Legal", "Courier Services"
                      ].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-kinpaku"><ChevronDown size={16} /></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Sub-Category <span className="text-kinpaku">*</span></label>
                  <div className="relative">
                    <select name="subCategory" value={formData.subCategory} onChange={handleChange} className="form-input-light appearance-none pr-12" disabled={!formData.category} required>
                      <option value="">{formData.category ? 'Select Sub-Category' : 'Choose Category First'}</option>
                      {subCategoriesFor(formData.category).map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-kinpaku"><ChevronDown size={16} /></div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Tell us about your Business</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="form-input-light resize-none px-8" placeholder="Share a few words about what makes your business special..." />
                </div>
              </div>
            </div>

            {/* 2. LOCATION DETAILS */}
            <div className="pt-12 sm:pt-20 space-y-10 border-t border-rule">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-kinpaku rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[rgba(232,119,34,0.2)]">2</div>
                <h3 className="text-kinpaku text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] sm:tracking-[0.4em]">Where is your Business Located?</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">District <span className="text-kinpaku">*</span></label>
                  <select name="district" value={formData.district} onChange={handleChange} className="form-input-light">
                    <option value="">— Select Region —</option>
                    {tnDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Assembly Constituency <span className="text-kinpaku">*</span></label>
                  <select name="assembly" value={formData.assembly} onChange={handleChange} className="form-input-light" disabled={!formData.district}>
                    <option value="">{formData.district ? '— Select Constituency —' : 'Choose District First'}</option>
                    {formData.district && districtAssemblies[formData.district]?.map(constituency => (
                      <option key={constituency} value={constituency}>{constituency}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Full Office Address <span className="text-kinpaku">*</span></label>
                    <button type="button" onClick={handleUseLocation} className="text-[11px] font-black text-patina uppercase tracking-widest flex items-center gap-2 hover:bg-graphite px-4 py-2 rounded-xl transition-all">
                      <MapPin size={14} /> Detect Location
                    </button>
                  </div>
                  <textarea name="address" value={formData.address} onChange={handleChange} rows="3" className="form-input-light resize-none px-8" placeholder="Street name, Building No, etc." required />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Landmark / How to find you</label>
                  <input name="landmark" value={formData.landmark} onChange={handleChange} className="form-input-light" placeholder="e.g. Near New Bus Stand, Above AXIS Bank" />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Primary Coverage Areas</label>
                  <input name="areas" value={formData.areas} onChange={handleChange} className="form-input-light" placeholder="Areas you serve (e.g. Anna Nagar, T. Nagar)" />
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">City / Town</label>
                  <input name="city" value={formData.city} onChange={handleChange} className="form-input-light" placeholder="e.g. Madurai" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Pincode</label>
                  <input name="pincode" value={formData.pincode} onChange={handleChange} className="form-input-light" placeholder="6-digit PIN code" />
                </div>
              </div>
            </div>

            {/* 3. CONTACT INFORMATION */}
            <div className="pt-12 sm:pt-20 space-y-10 border-t border-rule text-left">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-kinpaku rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[rgba(232,119,34,0.2)]">3</div>
                <h3 className="text-kinpaku text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] sm:tracking-[0.4em]">Direct Contact Channels</h3>
              </div>

              <div className="space-y-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Primary WhatsApp Business Phone <span className="text-kinpaku">*</span></label>
                  <input
                    name="whatsappPrimary"
                    value={formData.whatsappPrimary}
                    onChange={handleChange}
                    className="w-full bg-lacquer-deep border-2 border-rule rounded-2xl px-5 sm:px-8 py-4 sm:py-6 text-lg font-bold text-champagne shadow-sm focus:border-kinpaku focus:bg-raised transition-all placeholder:text-faint"
                    placeholder="9876543210"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-faint uppercase tracking-widest pl-1">Verification Number</label>
                    <input name="whatsappNo" value={formData.whatsappNo} readOnly className="form-input-light bg-graphite cursor-not-allowed text-faint" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Office Landline</label>
                    <input name="landline" value={formData.landline} onChange={handleChange} className="form-input-light" placeholder="STD Code - Number" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Alternate Mobile</label>
                    <input name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} className="form-input-light" placeholder="Second contact mobile" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Official Email Address</label>
                    <input name="email" value={formData.email} onChange={handleChange} className="form-input-light" placeholder="contact@yourbusiness.com" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Professional Website</label>
                  <input name="website" value={formData.website} onChange={handleChange} className="form-input-light" placeholder="https://www.yourbrand.com" />
                </div>
              </div>
            </div>

            {/* 4. SOCIAL MEDIA & OPERATING HOURS */}
            <div className="pt-12 sm:pt-20 space-y-10 border-t border-rule">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-kinpaku rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[rgba(232,119,34,0.2)]">4</div>
                <h3 className="text-kinpaku text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] sm:tracking-[0.4em]">Social Media & Operating Hours</h3>
              </div>

              <div className="space-y-12">
                <div className="space-y-8">
                  {/* Active Social Inputs */}
                  {Object.entries(formData.socialLinks).map(([platform, value]) => (
                    <div key={platform} className="flex items-center gap-6 animate-in zoom-in-95 duration-200">
                      <label className="w-32 text-[10px] font-black text-faint uppercase tracking-[0.2em]">{platform}</label>
                      <div className="flex-1 relative">
                        <input value={value} onChange={(e) => setFormData(p => ({ ...p, socialLinks: { ...p.socialLinks, [platform]: e.target.value } }))} className="form-input-light pr-14" placeholder={`Paste ${platform} profile URL here...`} />
                        <button type="button" onClick={() => { const newLinks = { ...formData.socialLinks }; delete newLinks[platform]; setFormData(p => ({ ...p, socialLinks: newLinks })); }} className="absolute right-5 top-1/2 -translate-y-1/2 text-kinpaku hover:scale-110 transition-transform"><X size={18} /></button>
                      </div>
                    </div>
                  ))}

                  {showPlatformSelector ? (
                    <div className="flex flex-wrap gap-3 sm:gap-4 p-5 sm:p-8 bg-graphite rounded-[20px] sm:rounded-[32px] border border-kinpaku/50 animate-in fade-in zoom-in-95 duration-400">
                      {['Facebook', 'Twitter', 'Instagram', 'Google Maps', 'YouTube'].map(p => {
                        const id = p.toLowerCase().split(' ')[0];
                        if (formData.socialLinks[id] !== undefined) return null;
                        return <button key={p} type="button" onClick={() => { setFormData(p => ({ ...p, socialLinks: { ...p.socialLinks, [id]: '' } })); setShowPlatformSelector(false); }} className="px-8 py-3 rounded-2xl bg-raised border border-kinpaku text-kinpaku text-[11px] font-black uppercase tracking-widest hover:bg-kinpaku hover:text-white hover:border-kinpaku transition-all shadow-sm">{p}</button>;
                      })}
                    </div>
                  ) : (
                    Object.keys(formData.socialLinks).length < 5 && <button type="button" onClick={() => setShowPlatformSelector(true)} className="w-full py-6 border-2 border-dashed border-kinpaku rounded-3xl text-kinpaku font-black uppercase text-[11px] tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-graphite transition-all">+ Link Social Profile</button>
                  )}
                </div>

                <div className="space-y-8 bg-lacquer-deep rounded-[24px] sm:rounded-[40px] p-6 sm:p-10 border border-rule">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Working Days</label>
                  <div className="flex flex-wrap gap-3">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <label key={day} className={`flex items-center gap-3 px-8 py-4 rounded-2xl cursor-pointer transition-all border ${formData.openingDays.includes(day) ? 'bg-kinpaku border-kinpaku text-white shadow-lg shadow-[rgba(232,119,34,0.2)]' : 'bg-raised border-rule text-muted hover:border-kinpaku'}`}>
                        <input type="checkbox" hidden checked={formData.openingDays.includes(day)} onChange={(e) => {
                          const newDays = e.target.checked ? [...formData.openingDays, day] : formData.openingDays.filter(d => d !== day);
                          setFormData(p => ({ ...p, openingDays: newDays }));
                        }} />
                        <span className="text-xs font-black uppercase tracking-widest">{day}</span>
                      </label>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Open Doors At</label>
                      <input type="time" name="openingTime" value={formData.openingTime} onChange={handleChange} className="form-input-light bg-raised border-rule" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Closed Doors At</label>
                      <input type="time" name="closingTime" value={formData.closingTime} onChange={handleChange} className="form-input-light bg-raised border-rule" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. FAQ SECTION */}
            <div className="pt-12 sm:pt-20 space-y-10 border-t border-rule">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-kinpaku rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[rgba(232,119,34,0.2)]">5</div>
                <h3 className="text-kinpaku text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] sm:tracking-[0.4em]">Clear the Doubts (FAQ)</h3>
              </div>
              <div className="space-y-10 bg-graphite rounded-[24px] sm:rounded-[40px] p-6 sm:p-12 border border-kinpaku/30">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Your Customer's Main Question</label>
                  <input name="faqQuestion" value={formData.faqQuestion} onChange={handleChange} className="form-input-light bg-raised border-rule px-8" placeholder="e.g. Do you provide doorstep service?" />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">The Helpful Answer</label>
                  <textarea name="faqAnswer" value={formData.faqAnswer} onChange={handleChange} rows="3" className="form-input-light bg-raised border-rule resize-none px-8" placeholder="Yes, we provide free home delivery within 5kms..." />
                </div>
              </div>
            </div>

            {/* 6. MEDIA & PHOTOS */}
            <div className="pt-12 sm:pt-20 space-y-10 border-t border-rule">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-kinpaku rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[rgba(232,119,34,0.2)]">6</div>
                <h3 className="text-kinpaku text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] sm:tracking-[0.4em]">Business Gallery & Branding</h3>
              </div>

              {/* Banner Upload */}
              <div className="space-y-4">
                <label className="text-[11px] font-black text-champagne uppercase tracking-widest">Cover / Banner Photo <span className="text-[10px] text-faint normal-case font-medium ml-2">(Optional)</span></label>
                <div onClick={() => document.getElementById('banner-upload').click()} className="border-2 border-dashed border-rule rounded-[32px] text-center hover:border-kinpaku hover:bg-graphite transition-all cursor-pointer group relative overflow-hidden min-h-[200px] flex items-center justify-center bg-lacquer-deep">
                  <input type="file" id="banner-upload" hidden accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) setFormData(p => ({ ...p, bannerImage: file })); }} />
                  {formData.bannerImage ? (
                    <div className="w-full h-full absolute inset-0"><img src={URL.createObjectURL(formData.bannerImage)} className="w-full h-full object-cover" alt="Banner" /><div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center"><p className="text-white font-black uppercase text-[11px] tracking-widest bg-kinpaku px-6 py-3 rounded-full">Change Photo</p></div></div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="text-2xl">🖼️</div>
                      <p className="text-xs font-black text-champagne uppercase tracking-widest">Tap to upload cover / banner photo</p>
                      <p className="text-[10px] text-faint font-bold tracking-tight">BANNER RATIO — CROPS TO FIT</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Images */}
              <div className="space-y-4 pt-8">
                <label className="text-[11px] font-black text-champagne uppercase tracking-widest">Gallery Images <span className="text-[10px] text-faint normal-case font-medium ml-2">(Optional — up to 10)</span></label>
                <div className="bg-lacquer-deep border-2 border-rule rounded-[20px] sm:rounded-[32px] p-5 sm:p-10 space-y-6">
                  {formData.gallery.length > 0 && (
                    <div className="flex flex-wrap gap-4">
                      {formData.gallery.map((file, i) => (
                        <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-rule group">
                          <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Gallery" />
                          <button type="button" onClick={() => setFormData(p => ({ ...p, gallery: p.gallery.filter((_, idx) => idx !== i) }))} className="absolute inset-0 bg-kinpaku/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white"><X size={20} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  <input type="file" multiple accept="image/*" onChange={(e) => setFormData(p => ({ ...p, gallery: [...p.gallery, ...Array.from(e.target.files)].slice(0, 10) }))} className="text-[10px] font-black uppercase text-faint file:bg-kinpaku file:text-white file:border-0 file:rounded-xl file:px-6 file:py-3 file:mr-6 file:cursor-pointer hover:file:bg-patina transition-all cursor-pointer" />
                </div>
              </div>

              {/* Service List */}
              <div className="space-y-8 pt-8">
                <label className="text-[11px] font-black text-champagne uppercase tracking-widest">Services / Products <span className="text-[10px] text-faint normal-case font-medium ml-2">(Optional — up to 6)</span></label>
                <div className="space-y-6">
                  {formData.services.map((service, index) => (
                    <div key={index} className="bg-lacquer-deep rounded-[20px] sm:rounded-[32px] p-5 sm:p-10 border border-rule space-y-8 sm:space-y-10 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="flex justify-between items-center pb-4 border-b border-rule">
                        <span className="text-champagne text-xs font-black uppercase tracking-widest">Service {index + 1}</span>
                        <button type="button" onClick={() => setFormData(p => ({ ...p, services: p.services.filter((_, i) => i !== index) }))} className="text-kinpaku text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><X size={14} /> Remove</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                        <div className="space-y-3">
                          <label className="text-[11px] font-black text-champagne uppercase tracking-widest">Name</label>
                          <input value={service.name} onChange={(e) => { const ns = [...formData.services]; ns[index].name = e.target.value; setFormData(p => ({ ...p, services: ns })); }} className="form-input-light bg-raised" placeholder="Service / product name" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[11px] font-black text-champagne uppercase tracking-widest">Price (₹)</label>
                          <input value={service.price} onChange={(e) => { const ns = [...formData.services]; ns[index].price = e.target.value; setFormData(p => ({ ...p, services: ns })); }} className="form-input-light bg-raised" placeholder="e.g. 500" />
                        </div>
                        <div className="md:col-span-2 space-y-3">
                          <label className="text-[11px] font-black text-champagne uppercase tracking-widest">Details</label>
                          <textarea rows="3" value={service.details} onChange={(e) => { const ns = [...formData.services]; ns[index].details = e.target.value; setFormData(p => ({ ...p, services: ns })); }} className="form-input-light bg-raised resize-none" placeholder="Brief description" />
                        </div>
                        <div className="md:col-span-2 space-y-3">
                          <label className="text-[11px] font-black text-champagne uppercase tracking-widest">Service Photo <span className="text-kinpaku">*</span></label>
                          <div className="flex items-center gap-6">
                            {service.photo && <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-rule shadow-lg shrink-0"><img src={URL.createObjectURL(service.photo)} className="w-full h-full object-cover" alt="Service" /></div>}
                            <input type="file" accept="image/*" onChange={(e) => { const ns = [...formData.services]; ns[index].photo = e.target.files[0]; setFormData(p => ({ ...p, services: ns })); }} className="text-[10px] font-black uppercase text-faint file:bg-kinpaku file:text-white file:border-0 file:rounded-xl file:px-6 file:py-3 file:mr-6 file:cursor-pointer" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.services.length < 6 && <button type="button" onClick={() => setFormData(p => ({ ...p, services: [...p.services, { name: '', price: '', details: '', photo: null }] }))} className="w-full py-6 border-2 border-dashed border-kinpaku rounded-[32px] text-kinpaku font-black uppercase text-[11px] tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-graphite transition-all"><Plus size={18} /> Add Service</button>}
                </div>
              </div>

              {/* Profile Photo - LAST as per request */}
              <div className="space-y-4 pt-16 border-t border-rule">
                <label className="text-[11px] font-black text-champagne uppercase tracking-widest">Profile Photo <span className="text-[10px] text-faint normal-case font-medium ml-2">(Business Logo)</span></label>
                <div onClick={() => document.getElementById('profile-upload').click()} className="border-2 border-dashed border-rule rounded-[20px] sm:rounded-[32px] p-8 sm:p-16 text-center hover:border-kinpaku hover:bg-graphite transition-all cursor-pointer group relative overflow-hidden flex items-center justify-center bg-lacquer-deep min-h-[220px]">
                  <input type="file" id="profile-upload" hidden accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) setFormData(p => ({ ...p, profileImage: file })); }} />
                  {formData.profileImage ? (
                    <div className="w-full h-full absolute inset-0"><img src={URL.createObjectURL(formData.profileImage)} className="w-full h-full object-cover" alt="Profile" /><div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center"><p className="text-white font-black uppercase text-[11px] tracking-widest bg-kinpaku px-6 py-3 rounded-full">Change Logo</p></div></div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="text-2xl">📷</div>
                      <p className="text-[10px] font-black text-champagne uppercase tracking-widest">Tap to upload logo / photo</p>
                      <p className="text-[10px] text-faint font-bold uppercase tracking-tight">CROP TO 1:1 SQUARE</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Section */}
              <div className="pt-16 border-t border-rule text-center">
                <button type="submit" disabled={status === 'loading'} className="w-full md:w-auto md:min-w-[320px] bg-kinpaku text-lacquer-deep px-8 sm:px-12 py-5 sm:py-7 rounded-2xl text-[12px] sm:text-[14px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] shadow-2xl shadow-[rgba(232,119,34,0.3)] hover:bg-kinpaku-rich hover:-translate-y-1 transition-all disabled:opacity-50 active:scale-95 active:translate-y-0">
                  {status === 'loading' ? 'Processing...' : 'Submit Registration'}
                </button>
                <p className="mt-8 text-[11px] text-faint font-bold uppercase tracking-widest leading-relaxed">By submitting, you agree to our platform guidelines & terms</p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddBusiness;
