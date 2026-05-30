import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://vanigan-app-automation-5il0.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const businessService = {
    // Get all businesses (requires authentication / returns 401 without key)
    getAll: async () => {
        try {
            const response = await api.get('/api/businesses');
            return response.data;
        } catch (error) {
            console.error('Error fetching businesses:', error);
            throw error;
        }
    },

    // Register a new business (public endpoint, multipart/form-data)
    register: async (formData) => {
        try {
            const response = await api.post('/public/register', formData);
            return response.data;
        } catch (error) {
            console.error('Error registering business:', error);
            throw error;
        }
    }
};

export default api;
