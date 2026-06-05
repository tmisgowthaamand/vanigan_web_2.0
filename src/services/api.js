import axios from 'axios';

// Always route through the same-origin proxy path to avoid CORS on any
// Vercel domain. vercel.json rewrites /proxy-api/* to the Render backend,
// and vite.config.js proxies it during local dev. We intentionally ignore
// VITE_API_BASE_URL here because the proxy path must stay same-origin.
const API_BASE_URL = '/proxy-api';

// NOTE: do not force a global 'Content-Type' header. Axios sets it per request
// automatically — 'application/json' for plain objects (reviews, etc.) and
// 'multipart/form-data; boundary=…' for FormData (business registration with
// file uploads). Forcing JSON here previously broke the multipart /public/register
// submission with an HTTP 500.
const api = axios.create({
    baseURL: API_BASE_URL,
});

const businessPhoneFields = (business) => [
    business.phone,
    business.phone2,
    business.whatsappNo,
    business.landline,
    business.alternatePhone,
    business.whatsappPrimary,
];

const hasBusinessPhone = (business, phone) => (
    businessPhoneFields(business)
        .map(value => (value || '').replace(/\D/g, '').slice(-10))
        .some(value => value === phone)
);

const normalizeSearchText = (value) => (
    String(value || '')
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
);

const businessSearchText = (business) => normalizeSearchText([
    business.name,
    business.description,
    business.category,
    business.subCategory,
    business.district,
    business.assembly,
    business.address,
    business.landmark,
    business.listingCode,
    business.phone,
    business.phone2,
].filter(Boolean).join(' '));

const rankBusinessSearchMatch = (business, rawSearch) => {
    const query = normalizeSearchText(rawSearch);
    const text = businessSearchText(business);
    if (!query || !text) return 0;

    const words = query.split(/\s+/).filter(Boolean);
    if (text.includes(query)) return 100;
    if (words.every(word => text.includes(word))) return 80;

    const prefixMatches = words.filter(word => word.length >= 4 && text.includes(word.slice(0, 4))).length;
    if (prefixMatches === words.length && prefixMatches > 0) return 45;
    if (prefixMatches > 0) return 25;

    return 0;
};

const getSearchFallbackSeeds = (rawSearch) => {
    const words = normalizeSearchText(rawSearch).split(/\s+/).filter(word => word.length >= 3);
    return [...new Set(words.flatMap(word => [
        word,
        word.length >= 4 ? word.slice(0, 4) : '',
        word.length >= 3 ? word.slice(0, 3) : '',
    ]).filter(Boolean))];
};

export const businessService = {
    // Get all businesses
    getAll: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            if (filters.category) params.append('category', filters.category);
            if (filters.subCategory) params.append('subcategory', filters.subCategory);
            if (filters.district) params.append('district', filters.district);
            if (filters.assembly) params.append('assembly', filters.assembly);
            if (filters.search) params.append('search', filters.search);
            if (filters.page) params.append('page', filters.page);
            params.append('limit', '12'); // Perfect for 3-col grid

            const response = await api.get(`/api/public/businesses?${params.toString()}`);
            const list = response.data?.businesses || [];
            const needsFallback = filters.search && list.length === 0 && Number(filters.page || 1) === 1;
            if (!needsFallback) return response.data;

            const fallbackParams = new URLSearchParams();
            if (filters.category) fallbackParams.append('category', filters.category);
            if (filters.subCategory) fallbackParams.append('subcategory', filters.subCategory);
            if (filters.district) fallbackParams.append('district', filters.district);
            if (filters.assembly) fallbackParams.append('assembly', filters.assembly);
            fallbackParams.append('limit', '60');
            fallbackParams.append('page', '1');

            for (const seed of getSearchFallbackSeeds(filters.search)) {
                fallbackParams.set('search', seed);
                const fallbackResponse = await api.get(`/api/public/businesses?${fallbackParams.toString()}`);
                const ranked = (fallbackResponse.data?.businesses || [])
                    .map(business => ({
                        business,
                        score: rankBusinessSearchMatch(business, filters.search),
                    }))
                    .filter(item => item.score > 0)
                    .sort((a, b) => b.score - a.score)
                    .map(item => item.business);

                if (ranked.length > 0) {
                    return {
                        ...fallbackResponse.data,
                        businesses: ranked.slice(0, 12),
                        total: ranked.length,
                        page: 1,
                        limit: 12,
                        fuzzy: true,
                    };
                }
            }

            return response.data;
        } catch (error) {
            console.error('Error fetching businesses:', error);
            throw error;
        }
    },

    // Get a specific business by ID
    getById: async (id) => {
        try {
            const response = await api.get(`/api/public/businesses/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching business by ID:', error);
            throw error;
        }
    },

    // Register a new business (Public endpoint)
    add: async (businessData) => {
        try {
            const response = await api.post('/public/register', businessData);
            return response.data;
        } catch (error) {
            console.error('Error registering business:', error);
            throw error;
        }
    },

    // Robust search by phone using high-concurrency scanning
    getByPhone: async (phone, onProgress) => {
        try {
            // First wave: Fast-track check for first page
            const initial = await api.get('/api/public/businesses?limit=60&page=1');
            const total = initial.data.total || 0;
            if (total === 0) return [];

            const batchSize = 60;
            const totalPages = Math.ceil(total / batchSize);
            const concurrency = 20;
            let allMatches = [];

            // Check first page results immediately
            const firstPageMatches = (initial.data.businesses || []).filter(b => {
                return hasBusinessPhone(b, phone);
            });
            if (firstPageMatches.length > 0) {
                allMatches = [...firstPageMatches];
                // If it's on the first page, we can return immediately
                return allMatches;
            }

            for (let waveStart = 2; waveStart <= totalPages; waveStart += concurrency) {
                if (onProgress) onProgress(Math.min(Math.round((waveStart / totalPages) * 100), 100));

                const promises = [];
                for (let i = waveStart; i < Math.min(totalPages + 1, waveStart + concurrency); i++) {
                    promises.push(
                        api.get(`/api/public/businesses?limit=${batchSize}&page=${i}`, { timeout: 15000 })
                            .catch(() => ({ data: { businesses: [] } }))
                    );
                }

                const results = await Promise.all(promises);
                for (const res of results) {
                    const list = res.data.businesses || [];
                    const matches = list.filter(b => {
                        return hasBusinessPhone(b, phone);
                    });
                    if (matches.length > 0) allMatches = [...allMatches, ...matches];
                }

                if (allMatches.length > 0) break; // Return early once found
            }

            if (onProgress) onProgress(100);
            return allMatches;
        } catch (error) {
            console.error('Error searching by phone:', error);
            throw error;
        }
    },

    // Get category-wise statistics
    getStats: async () => {
        try {
            // NEVER fetch 100,000 records in one go. It crashes the server.
            // We just fetch 1 record to get the 'total' count from pagination metadata.
            const response = await api.get('/api/public/businesses?limit=1');
            const total = response.data.total || 0;

            // If the backend doesn't provide a category breakdown, we return the total.
            // In a production app, you should have a dedicated /stats endpoint.
            return { total, categories: {} };
        } catch (error) {
            console.error('Error fetching stats:', error);
            return { total: 0, categories: {} };
        }
    },

    // Submit a review for a business
    submitReview: async (reviewData) => {
        try {
            const response = await api.post('/api/public/reviews', {
                targetId: reviewData.businessId,
                targetKind: 'business',
                reviewerName: reviewData.name,
                rating: parseInt(reviewData.rating),
                text: reviewData.comment,
                phone: reviewData.phone
            });
            return response.data;
        } catch (error) {
            console.error('Error submitting review:', error);
            throw error;
        }
    },

    // Fetch reviews for a specific business
    getReviews: async (businessId) => {
        try {
            const response = await api.get(`/api/public/reviews?targetId=${businessId}`);
            return response.data.reviews || response.data || [];
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return [];
        }
    },
};

// Owner authentication. The backend has no traditional signup/login — an
// "account" is a business owner's phone number secured by a 4-digit PIN.
//   set-pin    : create the PIN right after registering a business
//   verify-pin : log in to the owner dashboard (My Business)
export const authService = {
    // Set / create a 4-digit PIN for the owner phone (post-registration).
    setPin: async (ownerPhone, pin) => {
        const response = await api.post('/api/public/owner/set-pin', { ownerPhone, pin });
        return response.data;
    },

    // Verify phone + PIN. Returns the owner's business data on success.
    // Throws on failure: 404 {error:'no_business'} (phone has no listing) or
    // 401/400 for an incorrect/invalid PIN.
    verifyPin: async (ownerPhone, pin) => {
        const response = await api.post('/api/public/owner/verify-pin', { ownerPhone, pin });
        return response.data;
    },
};

// Full web-account auth. Unlike the legacy phone+PIN owner model, this is a
// real user account: signup creates a user record, login authenticates it,
// and a user can optionally be linked to a business listing.
//   signup        : create a user account (+ optional business metadata)
//   login         : { phone, pin } -> { user, business }
//   me            : fetch the current account by phone -> { user, business }
//   checkPhone    : { exists, name } — used to detect existing accounts
//   linkBusiness  : attach an existing business listing to the user account
export const webAuthService = {
    signup: async (payload) => {
        // payload: { phone, name, district, assembly, pin, confirmPin,
        //            bizName, bizCategory, bizSubCat }
        const response = await api.post('/api/web-auth/signup', payload);
        return response.data;
    },

    login: async (phone, pin) => {
        const response = await api.post('/api/web-auth/login', { phone, pin });
        return response.data; // { user, business }
    },

    me: async (phone) => {
        const response = await api.get('/api/web-auth/me', { params: { phone } });
        return response.data; // { user, business }
    },

    checkPhone: async (phone) => {
        const response = await api.get('/api/web-auth/check-phone', { params: { phone } });
        return response.data; // { exists, name }
    },

    linkBusiness: async (phone, businessId) => {
        const response = await api.post('/api/web-auth/link-business', { phone, businessId });
        return response.data;
    },
};

// Lightweight session persistence shared by Login / Signup / Navbar /
// MyBusiness. We persist the full auth object in localStorage (so the session
// survives reloads, matching the account model) and mirror the owner phone +
// business into the keys the dashboard and navbar already read.
const AUTH_KEY = 'vanigan_auth';

export const session = {
    get: () => {
        try { return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); }
        catch { return null; }
    },

    // Store { user, business } and mirror compatibility keys.
    set: (auth) => {
        if (!auth) { session.clear(); return; }
        localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
        const phone = (auth.user?.phone || '').replace(/\D/g, '').slice(-10);
        if (phone) {
            localStorage.setItem('vanigan_owner_phone', phone);
            sessionStorage.setItem('vanigan_owner_phone', phone);
        }
        if (auth.business) {
            const bizStr = JSON.stringify(auth.business);
            localStorage.setItem('vanigan_owner_business', bizStr);
            sessionStorage.setItem('vanigan_owner_business', bizStr);
        } else {
            localStorage.removeItem('vanigan_owner_business');
            sessionStorage.removeItem('vanigan_owner_business');
        }
    },

    clear: () => {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem('vanigan_owner_phone');
        localStorage.removeItem('vanigan_owner_business');
        sessionStorage.removeItem('vanigan_owner_phone');
        sessionStorage.removeItem('vanigan_owner_business');
    },
};

export default api;
