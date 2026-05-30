
import axios from 'axios';
import fs from 'fs';

const API_BASE_URL = 'https://vanigan-app-automation-5il0.onrender.com';

async function fetchDeepCatMap() {
    const categories = {};
    let page = 1;
    const limit = 60;
    let totalLoaded = 0;
    let totalRecords = 18424;

    console.log('Starting Deep Data Extraction...');

    try {
        // Fetch more samples to get all those subcategories in the screenshots
        while (totalLoaded < 15000) {
            console.log(`Fetching page ${page}...`);
            const response = await axios.get(`${API_BASE_URL}/api/public/businesses`, {
                params: { page, limit }
            });

            const businesses = response.data.businesses || [];
            if (businesses.length === 0) break;

            businesses.forEach(biz => {
                const cat = biz.category;
                const subCat = biz.subCategory;
                if (cat) {
                    if (!categories[cat]) categories[cat] = new Set();
                    if (subCat) categories[cat].add(subCat);
                }
            });

            totalLoaded += businesses.length;
            console.log(`Loaded ${totalLoaded} businesses`);
            page++;
        }

        const result = {};
        Object.keys(categories).sort().forEach(cat => {
            result[cat] = Array.from(categories[cat]).sort();
        });

        // Ensure "Transport" and "Electricals & Electronics" have the specific ones from the screenshots if they missed any
        const transportFix = [
            "Auto Rickshaw", "Bus Services", "Cab & Taxi", "Car Rentals",
            "Lorry & Truck Transport", "Mini Van Services", "Bike Taxi",
            "Ambulance Services", "School Van", "Courier Bikes"
        ];
        const elecFix = [
            "Electrical Shops", "Electronics Stores", "LED & Lighting",
            "CCTV & Security Systems", "Solar Panel Dealers", "Home Appliance Shops",
            "Wiring & Electricians", "Generator & Inverter", "Mobile & Accessories",
            "Computer & Laptop Shops"
        ];

        // Merge logic: ensure we use the more complete lists for these specific categories
        if (result["Transport"]) {
            result["Transport"] = Array.from(new Set([...result["Transport"], ...transportFix])).sort();
        }
        if (result["Electricals & Electronics"]) {
            result["Electricals & Electronics"] = Array.from(new Set([...result["Electricals & Electronics"], ...elecFix])).sort();
        }

        fs.writeFileSync('deep_category_map.json', JSON.stringify(result, null, 2));
        console.log('Deep Category map saved.');

    } catch (error) {
        console.error('Error:', error.message);
    }
}

fetchDeepCatMap();
