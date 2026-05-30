import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://vanigan-app-automation-5il0.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const businessService = {
    // Get all businesses
    getAll: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            if (filters.category) params.append('category', filters.category);
            if (filters.subCategory) params.append('subCategory', filters.subCategory);
            if (filters.district) params.append('district', filters.district);
            if (filters.assembly) params.append('assembly', filters.assembly);
            if (filters.search) params.append('search', filters.search);
            if (filters.page) params.append('page', filters.page);
            params.append('limit', '12'); // Perfect for 3-col grid

            const response = await api.get(`/api/public/businesses?${params.toString()}`);
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
                const bPhone = (b.phone || '').replace(/\D/g, '').slice(-10);
                const bPhone2 = (b.phone2 || '').replace(/\D/g, '').slice(-10);
                const bWhatsapp = (b.whatsappNo || '').replace(/\D/g, '').slice(-10);
                return bPhone === phone || bPhone2 === phone || bWhatsapp === phone;
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
                        const bPhone = (b.phone || '').replace(/\D/g, '').slice(-10);
                        const bPhone2 = (b.phone2 || '').replace(/\D/g, '').slice(-10);
                        const bWhatsapp = (b.whatsappNo || '').replace(/\D/g, '').slice(-10);
                        const bLandline = (b.landline || '').replace(/\D/g, '').slice(-10);
                        return bPhone === phone || bPhone2 === phone || bWhatsapp === phone || bLandline === phone;
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

export default api;
