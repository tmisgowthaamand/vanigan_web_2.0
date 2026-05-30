
const axios = require('axios');
const API_BASE_URL = 'https://vanigan-app-automation-5il0.onrender.com';

async function findPage() {
    for (let i = 1; i <= 308; i++) {
        console.log(`Checking page ${i}...`);
        const res = await axios.get(`${API_BASE_URL}/api/public/businesses?limit=60&page=${i}`);
        const businesses = res.data.businesses || [];
        const match = businesses.find(b => b.name === 'Hari Perivi' || b.listingCode === 'LIST24157');
        if (match) {
            console.log(`FOUND on page ${i}!!`);
            console.log(JSON.stringify(match, null, 2));
            return;
        }
    }
    console.log('Not found in pages 1-308');
}

findPage();
