
import axios from 'axios';
import fs from 'fs';

const API_BASE_URL = 'https://vanigan-app-automation-5il0.onrender.com';

async function fetchAllCategories() {
    const categories = {};
    let page = 1;
    const limit = 60;
    let totalLoaded = 0;
    let totalRecords = 18424;

    console.log('Starting data extraction...');

    try {
        while (totalLoaded < totalRecords) {
            console.log(`Fetching page ${page}...`);
            const response = await axios.get(`${API_BASE_URL}/api/public/businesses`, {
                params: {
                    page: page,
                    limit: limit
                }
            });

            const data = response.data;
            const businesses = data.businesses || [];
            totalRecords = data.total || totalRecords;

            businesses.forEach(biz => {
                const cat = biz.category;
                const subCat = biz.subCategory;

                if (cat) {
                    if (!categories[cat]) {
                        categories[cat] = new Set();
                    }
                    if (subCat) {
                        categories[cat].add(subCat);
                    }
                }
            });

            totalLoaded += businesses.length;
            console.log(`Loaded ${totalLoaded} / ${totalRecords} businesses`);

            if (businesses.length === 0) break;
            page++;

            // To avoid Rate Limits and save time, we might only need a good sample if the user only wants "sub-categories of 40 categories"
            // But let's try to get a decent amount. If we get 2000 records, we likely have most common subcategories.
            if (totalLoaded > 5000) {
                console.log('Reached sample limit of 5000. Processing unique mappings...');
                break;
            }
        }

        const result = {};
        Object.keys(categories).sort().forEach(cat => {
            result[cat] = Array.from(categories[cat]).sort();
        });

        fs.writeFileSync('category_map.json', JSON.stringify(result, null, 2));
        console.log('Category map saved to category_map.json');
        console.log('Categories found:', Object.keys(result).length);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

fetchAllCategories();
