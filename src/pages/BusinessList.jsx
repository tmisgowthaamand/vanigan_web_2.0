import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import BusinessCard from '../components/BusinessCard';
import { businessService } from '../services/api';
import { districtAssemblies, districts as tnDistricts } from '../data/constituencies';
import { categorySubMap } from '../data/subCategories';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, AlertCircle, ChevronDown, MapPin, ChevronLeft, ChevronRight, Star, Sparkles, TrendingUp, Building2 } from 'lucide-react';

const ROTATING_WORDS = ["traders", "shops", "agencies", "partners"];

const BusinessList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    /* categorySubMap is imported from src/data/subCategories.js (shared with AddBusiness).
    const _inlineCategorySubMap = {
        "Advertising": ["All Sub-Categories", "Outdoor Advertising", "Digital Marketing Agencies", "Social Media Marketing", "Print Advertising", "Radio & TV Ads", "Brand Design Studios", "SEO & SEM Services", "Influencer Marketing", "Photography Studios", "Video Production"],
        "Advocate & Legal": ["All Sub-Categories", "Civil Lawyers", "Criminal Lawyers", "Family Law Advocates", "Property & Real Estate Lawyers", "Consumer Court Advocates", "Labor & Employment Lawyers", "Corporate Lawyers", "Notary Services", "Legal Document Services", "Cyber Law Consultants"],
        "Agriculture": ["All Sub-Categories", "Seed Suppliers", "Fertilizer Dealers", "Pesticide Shops", "Irrigation Equipment", "Farm Machinery Dealers", "Organic Farming Consultants", "Soil Testing Labs", "Agri Input Shops", "Poultry & Livestock Supplies", "Cold Storage & Warehousing"],
        "Automobile": ["All Sub-Categories", "Car Showrooms", "Bike Showrooms", "Car Service Centers", "Bike Service Centers", "Spare Parts Shops", "Tyre & Battery Dealers", "Auto Body Works", "Driving Schools", "Used Vehicle Dealers", "EV Charging Stations"],
        "B2B Services": ["All Sub-Categories", "Wholesale Suppliers", "Raw Material Suppliers", "Industrial Equipment", "Packaging Solutions", "Export & Import Services", "Manufacturing Units", "Quality Testing Labs", "Consulting Services", "HR & Staffing", "Freight & Logistics"],
        "Banking & Finance": ["All Sub-Categories", "Banks", "Credit Cooperative Societies", "Microfinance Companies", "Insurance Agents", "Mutual Fund Advisors", "Loan Services", "Chit Fund Companies", "Money Transfer Services", "Stock Brokers", "Financial Planning Services"],
        "Banquets & Event Halls": ["All Sub-Categories", "Wedding Halls", "Conference Halls", "Mini Auditoriums", "Rooftop Venues", "Outdoor Event Spaces", "Community Halls", "Corporate Event Venues", "Birthday Party Halls", "Stage & Event Setup", "Heritage Venues"],
        "Bills & Recharge": ["All Sub-Categories", "Mobile Recharge Shops", "DTH & Cable Services", "Electricity Bill Payment", "Insurance Premium Collection", "Aadhaar & PAN Services", "Xerox & Printing Shops", "Bank & Fintech Agents", "Ticket Booking", "Online Bill Payment Centers", "Government Service Centers"],
        "Caterers": ["All Sub-Categories", "Wedding Caterers", "Corporate Caterers", "Tiffin Services", "Home-Based Caterers", "Mess & Canteen Services", "Diet & Health Food", "Vegan & Organic Food Caterers", "Live Counter Catering", "Mini Meals Providers", "Snack & Sweets Caterers"],
        "Civil Contractors": ["All Sub-Categories", "Building Contractors", "Road Construction", "Plumbing Services", "Interior Works", "Floor & Tile Work", "Painting Services", "Waterproofing Services", "Steel Fabrication", "Masonry & Brick Work", "Roofing Services"],
        "Construction Materials": ["All Sub-Categories", "Cement Dealers", "Sand & Aggregate Suppliers", "Bricks & Blocks", "TMT Steel Bars", "Roofing Sheets", "Plumbing Materials", "Paints & Coatings", "Wood & Timber", "Glass & Aluminium", "Waterproofing Products"],
        "Courier Services": ["All Sub-Categories", "Local Courier Services", "National Courier", "International Courier", "Document Courier", "Parcel Delivery", "Cold Chain Logistics", "Bulk Cargo Shipping", "Same Day Delivery", "E-Commerce Fulfillment", "Fragile Item Delivery"],
        "Daily Needs": ["All Sub-Categories", "Supermarkets & Grocery", "Milk & Dairy", "Vegetable & Fruit Shops", "Bakery & Bread", "Personal Care Products", "Stationery & Books", "Meat & Fish Shops", "Pet Food & Supplies", "Household Items", "Local Kirana Stores"],
        "Demand Services": ["All Sub-Categories", "Plumbers on Demand", "Electricians on Demand", "Carpenters on Demand", "Painters on Demand", "Cleaning Services", "Laundry & Dry Cleaning", "Home Nursing", "Babysitters & Nannies", "Elderly Care Services", "AC Technicians"],
        "Digital & IT Products": ["All Sub-Categories", "Software Solutions", "Web Development", "Mobile App Development", "IT Hardware", "Networking & WiFi Solutions", "Cloud Services", "Cybersecurity", "Digital Printing", "CCTV Installation", "Data Recovery"],
        "Doctors": ["All Sub-Categories", "General Physicians", "Pediatricians", "Gynecologists", "Orthopedic Doctors", "Cardiologists", "Neurologists", "ENT Specialists", "Dermatologists", "Psychiatrists", "Ophthalmologists"],
        "Education": ["All Sub-Categories", "Coaching Centre", "School / College"],
        "Electricals & Electronics": ["All Sub-Categories", "CCTV & Security", "CCTV & Security Systems", "Computer & Laptop Shops", "Computer Shop", "Electrical Shop", "Electrical Shops", "Electronics Showrooms", "Electronics Stores", "Generator & Inverter", "Home Appliance Shops", "LED & Lighting", "Mobile & Accessories", "Mobile Shop", "Solar Panel Dealers", "Wiring & Electricians"],
        "Hire Services": ["All Sub-Categories", "Tent & Decor Hire", "Sound System Hire", "Projector & AV Hire", "Vehicle Hire", "Furniture Hire", "Generator Hire", "Event Equipment Hire", "Costume Hire", "Catering Equipment Hire", "Photography Equipment Hire"],
        "Home Appliances": ["All Sub-Categories", "Refrigerators", "Washing Machines", "Air Conditioners", "Water Purifiers", "Mixers & Grinders", "Televisions", "Microwaves & OTG", "Fans & Coolers", "Geysers & Water Heaters", "Home Theater Systems"],
        "Hospitals & Clinics": ["All Sub-Categories", "Clinics", "Hospitals"],
        "Hotels & Restaurants": ["All Sub-Categories", "Budget Hotels", "Luxury Hotels", "Restaurants", "Dhabas & Mess", "Fast Food Outlets", "Cafes & Coffee Shops", "Cloud Kitchens", "Multi-Cuisine Restaurants", "South Indian Restaurants", "Rooftop Dining"],
        "IT & Software": ["All Sub-Categories", "Custom Software Development", "ERP Solutions", "CRM Software", "POS Systems", "Website Design & Hosting", "SEO & Digital Marketing", "Accounting Software", "School & College ERP", "Hospital Management Software", "E-Commerce Development"],
        "Insurance": ["All Sub-Categories", "Life Insurance", "Health Insurance", "Vehicle Insurance", "Home Insurance", "Crop Insurance", "Fire & Burglary Insurance", "Travel Insurance", "Group Insurance", "ULIP & Investment Plans", "Insurance Claim Consultants"],
        "Jewellery": ["All Sub-Categories", "Gold Jewellery Shops", "Silver Jewellery", "Diamond Jewellery", "Platinum Jewellery", "Imitation Jewellery", "Antique Jewellery", "Temple Jewellery", "Bridal Jewellery", "Gemstone & Rings", "Custom Jewellery Makers"],
        "Jobs": ["All Sub-Categories", "Job Placement Agencies", "Government Job Coaching", "Private Company Recruitment", "IT & Software Jobs", "Healthcare Recruitment", "Driver & Delivery Jobs", "Home-Based Work", "Internship Programs", "Blue-Collar Workforce", "Freelance Platforms"],
        "Labs & Diagnostics": ["All Sub-Categories", "Blood Test Labs", "Scan Centers", "X-Ray & MRI Centers", "Pathology Labs", "COVID Testing Centers", "DNA Testing Centers", "Eye Testing Centers", "Dental X-Ray Labs", "Home Sample Collection", "Molecular Diagnostic Labs"],
        "Organic Products": ["All Sub-Categories", "Organic Grocery Stores", "Organic Farms", "Herbal & Ayurvedic Products", "Cold-Pressed Oils", "Organic Dairy Products", "Natural Skincare", "Organic Pulses & Grains", "Eco-Friendly Products", "Health Supplements", "Organic Fertilizers"],
        "Packers & Movers": ["All Sub-Categories", "Local Shifting Services", "Inter-City Movers", "International Movers", "Vehicle Transport", "Office Relocation", "Home Relocation", "Warehouse & Storage", "Fragile Item Packing", "Bike & Car Transport", "Loading & Unloading Services"],
        "Pest Control": ["All Sub-Categories", "Cockroach Control", "Termite Treatment", "Mosquito Control", "Rat & Rodent Control", "Bed Bug Treatment", "General Disinfection", "Commercial Pest Control", "Wood Borer Treatment", "Fly Control", "Honeybee Removal"],
        "Printing Services": ["All Sub-Categories", "Visiting Card Printing", "Banner & Flex Printing", "Brochure & Flyer Printing", "Book Printing", "T-Shirt Printing", "Digital Printing Shops", "Offset Printing", "Wedding Invitation Printing", "Packaging Printing", "Stamp & Seal Makers"],
        "Real Estate": ["All Sub-Categories", "Residential Plots", "Commercial Plots", "Apartment Sales", "Villa & Independent Houses", "Land Brokers", "Property Management", "Interior Designers", "Architect Services", "Rental Properties", "Real Estate Consultants"],
        "Religious": ["All Sub-Categories", "Temples", "Churches", "Mosques", "Puja Item Shops", "Religious Book Stores", "Astrology & Numerology", "Vastu Consultants", "Event Pooja Services", "Prasad Distribution", "Spiritual Retreat Centers"],
        "Repairs": ["All Sub-Categories", "Mobile Phone Repair", "Laptop & Computer Repair", "Home Appliance Repair", "TV Repair", "AC Service & Repair", "Watch Repair", "Shoe Repair", "Bike Repair", "Car Denting & Painting", "Plumbing Repairs"],
        "Spa & Beauty": ["All Sub-Categories", "Beauty Salons", "Barber Shops", "Spa & Wellness Centers", "Nail Studios", "Makeup Artists", "Bridal Packages", "Skin Care Clinics", "Hair Transplant Clinics", "Threading & Waxing", "Tattoo Studios"],
        "Sports": ["All Sub-Categories", "Fitness Centers & Gyms", "Yoga Studios", "Cricket Academies", "Football Clubs", "Swimming Pools", "Badminton Courts", "Basketball Courts", "Sports Equipment Shops", "Martial Arts", "Cycling Clubs"],
        "Textiles & Garments": ["All Sub-Categories", "Saree Shops", "Dress Materials", "Readymade Garments", "Tailoring & Boutiques", "School Uniform Suppliers", "Fabric Wholesalers", "Embroidery & Zari Work", "Silk Sarees", "Western Wear Shops", "Kids Wear"],
        "Transport": ["All Sub-Categories", "Ambulance Services", "Auto Rickshaw", "Bike Taxi", "Bus Services", "Cab & Taxi", "Car Rentals", "Courier Bikes", "Goods Transport", "Logistics", "Lorry & Truck Transport", "Mini Van Services", "School Van", "Taxi & Cab", "Travel Agency"],
        "Travel & Tourism": ["All Sub-Categories", "Travel Agencies", "Tour Operators", "Pilgrimage Tours", "Adventure Travel", "Holiday Packages", "Visa Consultants", "Hotel Booking Services", "Foreign Exchange", "Car Rentals for Tours", "Cruise & Air Bookings"],
        "Wedding Services": ["All Sub-Categories", "Wedding Services"]
    };
    */
    // District / assembly names are sourced from src/data/constituencies.js,
    // which is generated from the live backend DB so filter values match the
    // raw strings the public businesses API expects.
    const tamilNaduDistricts = ["All Districts", ...tnDistricts];

    const districtAssemblyMap = Object.fromEntries(
        Object.entries(districtAssemblies).map(([d, assemblies]) => [d, ["All Assemblies", ...assemblies]])
    );

    const selectedCategory = searchParams.get('category') || 'All Categories';
    const subCategory = searchParams.get('subcategory') || searchParams.get('subCategory') || 'All Sub-Categories';
    const district = searchParams.get('district') || 'All Districts';
    const assembly = searchParams.get('assembly') || 'All Assemblies';
    const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);
    const finalizedSearch = (searchParams.get('search') || '').trim();
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(finalizedSearch);

    useEffect(() => {
        const term = searchTerm.trim();
        if (term === finalizedSearch) return undefined;

        const timer = setTimeout(() => {
            const params = new URLSearchParams();
            if (term) params.set('search', term);
            params.set('page', '1');
            setSearchParams(params);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, finalizedSearch, setSearchParams]);

    const handleSearch = () => {
        const term = searchTerm.trim();
        const params = new URLSearchParams();
        if (term) {
            params.set('search', term);
        }
        params.set('page', '1');
        setSearchParams(params);
        setSearchTerm(term);
    };

    const handleCategorySelect = (cat) => {
        const params = new URLSearchParams(searchParams);
        if (cat === 'All Categories') {
            params.delete('category');
        } else {
            params.set('category', cat);
        }
        params.delete('subcategory');
        params.delete('subCategory');
        params.delete('district');
        params.delete('assembly');
        params.set('page', '1');
        setSearchParams(params);
    };

    const updateFilterParam = (key, value, allValue) => {
        const params = new URLSearchParams(searchParams);
        if (!value || value === allValue) {
            params.delete(key);
            if (key === 'subcategory') params.delete('subCategory');
        } else {
            params.set(key, value);
        }
        params.set('page', '1');
        setSearchParams(params);
    };

    const updatePage = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', String(Math.max(1, page)));
        setSearchParams(params);
    };

    const [totalCount, setTotalCount] = useState(0);
    const [globalTotal, setGlobalTotal] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await businessService.getStats();
                if (data && data.total) {
                    setGlobalTotal(data.total);
                }
            } catch (err) {
                console.error("Failed to fetch global stats:", err);
            }
        };
        fetchStats();
    }, []);

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                setLoading(true);
                const query = {
                    category: selectedCategory === 'All Categories' ? '' : selectedCategory,
                    subCategory: subCategory === 'All Sub-Categories' ? '' : subCategory,
                    district: district === 'All Districts' ? '' : district,
                    assembly: assembly === 'All Assemblies' ? '' : assembly,
                    search: finalizedSearch,
                    page: currentPage
                };
                const data = await businessService.getAll(query);
                let list = Array.isArray(data) ? data : (data.businesses || []);

                const seen = new Set();
                list = list.filter(item => {
                    const id = item._id || item.id;
                    if (seen.has(id)) return false;
                    seen.add(id);
                    return true;
                });

                setBusinesses(list);
                setTotalCount(data.total || list.length);
                setLoading(false);
            } catch (err) {
                console.error("Fetch Error:", err);
                setError("Could not load businesses. Please try again later.");
                setLoading(false);
            }
        };

        fetchBusinesses();
    }, [selectedCategory, subCategory, district, assembly, finalizedSearch, currentPage]);

    const uniqueSubCategories = categorySubMap[selectedCategory] || ['All Sub-Categories'];

    const uniqueDistricts = tamilNaduDistricts;

    const [wordIndex, setWordIndex] = useState(0);

    // Top trader categories by live DB volume (rank 1–10). Counts/percentages
    // are a snapshot; clicking a chip filters the list by that category.
    const TOP_CATEGORIES = [
        { rank: 1, name: 'B2B Services', count: 3120, pct: '17.1%' },
        { rank: 2, name: 'Electricals & Electronics', count: 1541, pct: '8.4%' },
        { rank: 3, name: 'Daily Needs', count: 1071, pct: '5.9%' },
        { rank: 4, name: 'Textiles & Garments', count: 909, pct: '5.0%' },
        { rank: 5, name: 'Real Estate', count: 810, pct: '4.4%' },
        { rank: 6, name: 'Hotels & Restaurants', count: 742, pct: '4.1%' },
        { rank: 7, name: 'Doctors', count: 708, pct: '3.9%' },
        { rank: 8, name: 'Transport', count: 672, pct: '3.7%' },
        { rank: 9, name: 'Agriculture', count: 636, pct: '3.5%' },
        { rank: 10, name: 'Construction Materials', count: 588, pct: '3.2%' },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="min-h-screen bg-raised" style={{ fontFamily: "'Saans', 'Inter', system-ui, sans-serif" }}>

            {/* ═══ HERO ═══ */}
            <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 bg-raised overflow-hidden relative">
                {/* Decorative background blurs to fill emptiness */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-kinpaku/5 blur-[120px] rounded-full -mr-40 -mt-40 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-patina/5 blur-[100px] rounded-full -ml-20 -mb-20 pointer-events-none"></div>

                <div className="max-w-[1280px] mx-auto px-5 sm:px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-16 lg:gap-20">

                        {/* Left — heading with rotating text */}
                        <div className="w-full lg:w-1/2 space-y-6">
                            <motion.p
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="text-[13px] font-bold text-kinpaku uppercase tracking-[0.12em] flex items-center gap-2"
                            >
                                <Sparkles size={16} /> Business Directory
                            </motion.p>

                            <h1 className="text-[34px] sm:text-[40px] md:text-[56px] font-extrabold text-champagne leading-[1.1] tracking-[-0.02em] min-h-[120px] sm:min-h-[140px] md:min-h-[130px]">
                                Find verified <br />
                                <span className="text-kinpaku relative inline-block whitespace-nowrap">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={wordIndex}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                            className="absolute left-0 top-0"
                                        >
                                            {ROTATING_WORDS[wordIndex]}
                                        </motion.span>
                                    </AnimatePresence>
                                    {/* Invisible spacer for max width */}
                                    <span className="opacity-0 pointer-events-none">associates</span>
                                </span>
                            </h1>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                className="text-[17px] text-muted font-normal leading-[1.7] max-w-md pt-2"
                            >
                                The largest platform to find verified businesses and list yours for free. Built for modern shops and associates.
                            </motion.p>

                            {/* Search inline */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="flex items-center gap-3 pt-4"
                            >
                                <form onSubmit={(event) => { event.preventDefault(); handleSearch(); }} className="flex-1 relative group max-w-sm">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-faint group-focus-within:text-kinpaku transition-colors" size={20} />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="I am looking for..."
                                        className="w-full border border-rule rounded-xl py-4 pl-12 pr-4 text-[15px] font-medium text-champagne outline-none focus:border-kinpaku/50 focus:ring-4 focus:ring-kinpaku/10 transition-all placeholder:text-faint shadow-sm"
                                    />
                                </form>
                                <button
                                    onClick={handleSearch}
                                    className="bg-kinpaku text-white h-[54px] px-8 rounded-xl text-[15px] font-bold hover:bg-kinpaku-rich hover:shadow-lg hover:shadow-kinpaku/20 transition-all shrink-0 active:scale-95"
                                >
                                    Search
                                </button>
                            </motion.div>
                        </div>

                        {/* Right — Animated Components instead of empty space */}
                        <div className="hidden lg:flex w-full lg:w-1/2 relative h-[400px] items-center justify-center">
                            {/* Main center mockup card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                                className="relative z-20 bg-raised rounded-2xl p-5 w-64 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-rule/50"
                            >
                                <div className="flex gap-4 items-center mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-graphite border border-rule flex items-center justify-center">
                                        <Building2 size={24} className="text-kinpaku" />
                                    </div>
                                    <div>
                                        <div className="h-2.5 w-20 bg-[#3A332A] rounded-full mb-2"></div>
                                        <div className="h-2 w-12 bg-graphite rounded-full"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-graphite rounded-full"></div>
                                    <div className="h-2 w-4/5 bg-graphite rounded-full"></div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-rule flex justify-between items-center">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-6 h-6 rounded-full border-2 border-raised bg-[#3A332A]" />
                                        ))}
                                    </div>
                                    <span className="ks-badge is-improved">Verified</span>
                                </div>
                            </motion.div>

                            {/* Floating Floating Element 1 - Stats */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-10 right-0 z-30 bg-lacquer-deep/85 backdrop-blur-md rounded-xl p-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-rule"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-graphite border border-rule-strong flex items-center justify-center text-kinpaku">
                                        <TrendingUp size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[18px] font-extrabold text-champagne leading-none mb-1">{globalTotal > 0 ? (globalTotal / 1000).toFixed(0) + 'K+' : '50K+'}</p>
                                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Listings</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Element 2 - Reviews */}
                            <motion.div
                                animate={{ y: [0, 15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-10 left-0 z-30 bg-lacquer-deep/85 backdrop-blur-md rounded-xl p-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-rule"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-graphite border border-rule-strong flex items-center justify-center text-kinpaku">
                                        <Star size={18} fill="currentColor" />
                                    </div>
                                    <div>
                                        <p className="text-[18px] font-extrabold text-champagne leading-none mb-1">4.9/5</p>
                                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Top Rated</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Decorative Grid Behind */}
                            <div className="absolute inset-0 z-0 bg-[radial-gradient(rgba(232,119,34,0.18)_1px,transparent_1px)] bg-size-[20px_20px] opacity-50 mask-[radial-gradient(ellipse_at_center,black_40%,transparent_70%)]"></div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ═══ FILTERS + LISTINGS ═══ */}
            <section className="py-12 sm:py-16 bg-lacquer">
                <div className="max-w-[1600px] w-full mx-auto px-5 sm:px-6 md:px-12">

                    {/* Breadcrumb + Category title */}
                    <div className="mb-8 sm:mb-10">
                        <nav className="flex items-center gap-2 text-[13px] text-muted font-medium mb-4">
                            <Link to="/" className="hover:text-kinpaku transition-colors">Home</Link>
                            <span className="text-faint">/</span>
                            <span className="text-champagne font-semibold">{selectedCategory}</span>
                        </nav>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-[26px] sm:text-[32px] font-extrabold text-champagne tracking-[-0.01em] mb-1">{selectedCategory}</h2>
                                <p className="text-[15px] text-muted font-normal italic">
                                    Showing {totalCount.toLocaleString()} verified listings in Tamil Nadu
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── Top categories (rank 1–10 by trader volume) ── */}
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-5">
                            <TrendingUp size={16} className="text-kinpaku" />
                            <h3 className="text-[12px] font-bold text-champagne uppercase tracking-[0.12em]">Top Categories</h3>
                            <span className="text-[12px] text-faint font-medium">— most listed by traders</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            {TOP_CATEGORIES.map(cat => {
                                const active = selectedCategory === cat.name;
                                return (
                                    <button
                                        key={cat.name}
                                        onClick={() => handleCategorySelect(cat.name)}
                                        className={`group text-left rounded-2xl border p-4 transition-all shadow-sm hover:-translate-y-0.5 ${active
                                            ? 'bg-graphite border-kinpaku/60'
                                            : 'bg-raised border-rule hover:border-kinpaku/40'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-[11px] font-black tabular-nums w-6 h-6 rounded-lg flex items-center justify-center ${active ? 'bg-kinpaku text-lacquer-deep' : 'bg-graphite text-kinpaku group-hover:bg-kinpaku group-hover:text-lacquer-deep'} transition-colors`}>
                                                {cat.rank}
                                            </span>
                                            <span className="text-[11px] font-bold text-kinpaku tabular-nums">{cat.pct}</span>
                                        </div>
                                        <p className={`text-[13.5px] font-bold leading-tight line-clamp-2 mb-1 ${active ? 'text-kinpaku' : 'text-champagne group-hover:text-kinpaku'} transition-colors`}>
                                            {cat.name}
                                        </p>
                                        <p className="text-[12px] text-muted font-medium tabular-nums">{cat.count.toLocaleString()} listings</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-10">

                        {/* ── Sidebar ── */}
                        <aside className="lg:col-span-3 lg:col-start-1 space-y-6">
                            {/* Mobile: categories as a dropdown */}
                            <div className="lg:hidden">
                                <label className="text-[12px] font-bold text-champagne uppercase tracking-wider mb-2 block pl-1">Browse Categories</label>
                                <div className="relative">
                                    <select
                                        value={Object.keys(categorySubMap).includes(selectedCategory) ? selectedCategory : ''}
                                        onChange={(e) => handleCategorySelect(e.target.value)}
                                        className="w-full bg-raised border border-rule rounded-xl py-3.5 px-5 text-[14px] font-medium text-champagne appearance-none outline-none focus:border-kinpaku/50 transition-all cursor-pointer shadow-sm"
                                    >
                                        <option value="" disabled>Select a category</option>
                                        {Object.keys(categorySubMap).map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
                                </div>
                            </div>

                            {/* Desktop: full category list */}
                            <div className="hidden lg:block bg-raised rounded-[20px] p-6 border border-rule shadow-[0_2px_12px_rgba(0,0,0,0.03)] sticky top-24">
                                <h4 className="text-[12px] font-bold text-champagne uppercase tracking-wider mb-5 pl-1">Browse Categories</h4>
                                <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-1 space-y-0.5">
                                    {Object.keys(categorySubMap).map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => handleCategorySelect(cat)}
                                            className={`w-full text-left px-4 py-2.5 rounded-lg text-[14px] font-medium transition-all ${selectedCategory === cat
                                                ? 'bg-graphite text-kinpaku font-semibold'
                                                : 'text-muted hover:bg-lacquer hover:text-champagne'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* ── Main Grid ── */}
                        <div className="lg:col-span-9 space-y-8">

                            {/* Filter Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="relative">
                                    <select value={subCategory} onChange={(e) => updateFilterParam('subcategory', e.target.value, 'All Sub-Categories')}
                                        className="w-full bg-raised border border-rule rounded-xl py-3.5 px-5 text-[14px] font-medium text-muted appearance-none outline-none focus:border-kinpaku/50 transition-all cursor-pointer shadow-sm">
                                        {uniqueSubCategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
                                </div>
                                <div className="relative">
                                    <select value={district} onChange={(e) => {
                                        const params = new URLSearchParams(searchParams);
                                        if (e.target.value === 'All Districts') {
                                            params.delete('district');
                                        } else {
                                            params.set('district', e.target.value);
                                        }
                                        params.delete('assembly');
                                        params.set('page', '1');
                                        setSearchParams(params);
                                    }}
                                        className="w-full bg-raised border border-rule rounded-xl py-3.5 px-5 text-[14px] font-medium text-muted appearance-none outline-none focus:border-kinpaku/50 transition-all cursor-pointer shadow-sm">
                                        {uniqueDistricts.map(dst => <option key={dst} value={dst}>{dst}</option>)}
                                    </select>
                                    <MapPin size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
                                </div>
                                <div className="relative">
                                    <select value={assembly} onChange={(e) => updateFilterParam('assembly', e.target.value, 'All Assemblies')}
                                        className="w-full bg-raised border border-rule rounded-xl py-3.5 px-5 text-[14px] font-medium text-muted appearance-none outline-none focus:border-kinpaku/50 transition-all cursor-pointer shadow-sm"
                                        disabled={district === 'All Districts'}>
                                        {(districtAssemblyMap[district] || ["All Assemblies"]).map(asm => <option key={asm} value={asm}>{asm}</option>)}
                                    </select>
                                    <MapPin size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
                                </div>
                            </div>

                            {/* Results */}
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-28 gap-4">
                                    <Loader2 size={36} className="animate-spin text-kinpaku" />
                                    <p className="text-[14px] font-medium text-faint">Finding businesses…</p>
                                </div>
                            ) : error ? (
                                <div className="p-8 bg-raised rounded-[20px] border border-warning/40 text-center">
                                    <AlertCircle size={36} className="mx-auto text-warning mb-3" />
                                    <p className="text-warning font-bold">{error}</p>
                                </div>
                            ) : businesses.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {businesses.map(biz => (
                                            <BusinessCard key={biz._id || biz.id} business={biz} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    <div className="flex items-center justify-center gap-4 pt-8">
                                        <button onClick={() => updatePage(currentPage - 1)} disabled={currentPage === 1}
                                            className="w-10 h-10 rounded-lg border border-rule bg-raised flex items-center justify-center hover:bg-lacquer transition-all disabled:opacity-30 disabled:cursor-not-allowed text-champagne shadow-sm">
                                            <ChevronLeft size={18} />
                                        </button>
                                        <span className="text-[14px] font-semibold text-champagne bg-raised px-4 py-2 rounded-lg border border-rule shadow-sm">Page {currentPage}</span>
                                        <button onClick={() => updatePage(currentPage + 1)} disabled={businesses.length < 12}
                                            className="w-10 h-10 rounded-lg border border-rule bg-raised flex items-center justify-center hover:bg-lacquer transition-all disabled:opacity-30 disabled:cursor-not-allowed text-champagne shadow-sm">
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-20 bg-raised rounded-[20px] border border-rule shadow-sm">
                                    <p className="text-faint font-medium text-[15px]">No businesses found matching your criteria.</p>
                                    <button onClick={() => { setSearchParams(new URLSearchParams({ page: '1' })); setSearchTerm(''); }}
                                        className="mt-4 text-kinpaku font-semibold text-[14px] underline underline-offset-4 hover:text-kinpaku-rich transition-colors">Clear filters</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
            `}} />
        </main>
    );
};

export default BusinessList;
