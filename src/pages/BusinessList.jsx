import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import BusinessCard from '../components/BusinessCard';
import { businessService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, AlertCircle, Plus, X, LayoutGrid, ChevronDown, MapPin, ChevronLeft, ChevronRight, Star, ArrowRight, Sparkles, TrendingUp, CheckCircle, Building2 } from 'lucide-react';

const BusinessList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categorySubMap = {
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

    const tamilNaduDistricts = [
        "All Districts", "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
        "Dindigul", "Erode", "Kallakuruchi", "Kancheepuram", "Kanniyakumari", "Karur", "Krishnagiri",
        "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukottai",
        "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thiruvallur",
        "Thiruvarur", "Thoothukudi", "Tiruchirapalli", "Tirunelveli", "Tirupathur", "Tiruppur",
        "Tiruvannamalai", "Vellore", "Vilupuram", "Virudhunagar"
    ];

    const districtAssemblyMap = {
        "Chennai": [
            "All Assemblies", "Anna Nagar", "Chepauk-Thiruvallikeni", "Dr.Radhakrishnan Nagar", "Egmore",
            "Harbour", "Kolathur", "Mylapore", "Perambur", "Royapuram", "Saidapet",
            "Thiru-Vi-Ka-Nagar", "Thiyagarayanagar", "Thousand Lights", "Velachery", "Villivakkam", "Virugampakkam"
        ],
        "Coimbatore": [
            "All Assemblies", "Coimbatore North", "Coimbatore South", "Kavundampalayam", "Singanallur",
            "Sulur", "Thondamuthur", "Kinathukadavu", "Pollachi", "Valparai", "Mettupalayam"
        ],
        "Madurai": [
            "All Assemblies", "Madurai North", "Madurai South", "Madurai Central", "Madurai West",
            "Madurai East", "Melur", "Samayanallur", "Thirumangalam", "Thirupparankundram", "Usilampatti"
        ],
        "Kancheepuram": [
            "All Assemblies", "Kancheepuram", "Sriperumbudur", "Uthiramerur", "Alandur", "Pallavaram", "Tambaram"
        ],
        "Thiruvallur": [
            "All Assemblies", "Thiruvallur", "Avadi", "Poonamallee", "Ambattur", "Maduravoyal", "Gummidipoondi"
        ]
    };

    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Categories');
    const [subCategory, setSubCategory] = useState('All Sub-Categories');
    const [district, setDistrict] = useState('All Districts');
    const [assembly, setAssembly] = useState('All Assemblies');
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [finalizedSearch, setFinalizedSearch] = useState('');

    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl);
        } else {
            setSelectedCategory('All Categories');
        }
        const searchFromUrl = searchParams.get('search');
        if (searchFromUrl) {
            setSearchTerm(searchFromUrl);
            setFinalizedSearch(searchFromUrl);
        } else {
            setSearchTerm('');
            setFinalizedSearch('');
        }
    }, [searchParams]);

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams);
        if (searchTerm) {
            params.set('search', searchTerm);
            // When performing a new search from the hero, we often want to search all categories
            params.delete('category');
        } else {
            params.delete('search');
        }
        params.set('page', '1');
        setSearchParams(params);
        setFinalizedSearch(searchTerm);
    };

    const handleCategorySelect = (cat) => {
        setSelectedCategory(cat);
        setSubCategory('All Sub-Categories');
        setDistrict('All Districts');
        setCurrentPage(1); // Reset to page 1
        const params = new URLSearchParams(searchParams);
        if (cat === 'All Categories') {
            params.delete('category');
        } else {
            params.set('category', cat);
        }
        params.set('page', '1');
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

    const ROTATING_WORDS = ["traders", "shops", "agencies", "partners"];
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="bg-white min-h-screen" style={{ fontFamily: "'Saans', 'Inter', system-ui, sans-serif" }}>

            {/* ═══ HERO ═══ */}
            <section className="pt-36 pb-16 bg-white overflow-hidden relative">
                {/* Decorative background blurs to fill emptiness */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E87722]/5 blur-[120px] rounded-full -mr-40 -mt-40 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full -ml-20 -mb-20 pointer-events-none"></div>

                <div className="max-w-[1280px] mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

                        {/* Left — heading with rotating text */}
                        <div className="w-full lg:w-1/2 space-y-6">
                            <motion.p
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="text-[13px] font-bold text-[#E87722] uppercase tracking-[0.12em] flex items-center gap-2"
                            >
                                <Sparkles size={16} /> Business Directory
                            </motion.p>

                            <h1 className="text-[40px] md:text-[56px] font-extrabold text-[#1A1A2E] leading-[1.1] tracking-[-0.02em] min-h-[140px] md:min-h-[130px]">
                                Find verified <br />
                                <span className="text-[#E87722] relative inline-block whitespace-nowrap">
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
                                className="text-[17px] text-[#4B5563] font-normal leading-[1.7] max-w-md pt-2"
                            >
                                The largest platform to find verified businesses and list yours for free. Built for modern shops and associates.
                            </motion.p>

                            {/* Search inline */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="flex items-center gap-3 pt-4"
                            >
                                <div className="flex-1 relative group max-w-sm">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] group-focus-within:text-[#E87722] transition-colors" size={20} />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        placeholder="I am looking for..."
                                        className="w-full border border-[#E5E7EB] rounded-xl py-4 pl-12 pr-4 text-[15px] font-medium text-[#1A1A2E] outline-none focus:border-[#E87722]/50 focus:ring-4 focus:ring-[#E87722]/10 transition-all placeholder:text-[#9CA3AF] shadow-sm"
                                    />
                                </div>
                                <button
                                    onClick={handleSearch}
                                    className="bg-[#E87722] text-white h-[54px] px-8 rounded-xl text-[15px] font-bold hover:bg-[#D36B1E] hover:shadow-lg hover:shadow-[#E87722]/20 transition-all shrink-0 active:scale-95"
                                >
                                    Search
                                </button>
                            </motion.div>
                        </div>

                        {/* Right — Animated Components instead of empty space */}
                        <div className="w-full lg:w-1/2 relative h-[400px] flex items-center justify-center">
                            {/* Main center mockup card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                                className="relative z-20 bg-white rounded-2xl p-5 w-64 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100/50"
                            >
                                <div className="flex gap-4 items-center mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                                        <Building2 size={24} className="text-[#E87722]" />
                                    </div>
                                    <div>
                                        <div className="h-2.5 w-20 bg-slate-200 rounded-full mb-2"></div>
                                        <div className="h-2 w-12 bg-slate-100 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                                    <div className="h-2 w-4/5 bg-slate-100 rounded-full"></div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className={`w-6 h-6 rounded-full border-2 border-white bg-slate-${i + 1}00`} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">VERIFIED</span>
                                </div>
                            </motion.div>

                            {/* Floating Floating Element 1 - Stats */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-10 right-0 z-30 bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-white"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#1A1A2E] flex items-center justify-center text-white">
                                        <TrendingUp size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[18px] font-extrabold text-[#1A1A2E] leading-none mb-1">{globalTotal > 0 ? (globalTotal / 1000).toFixed(0) + 'K+' : '50K+'}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Listings</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Element 2 - Reviews */}
                            <motion.div
                                animate={{ y: [0, 15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-10 left-0 z-30 bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-white"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white">
                                        <Star size={18} fill="currentColor" />
                                    </div>
                                    <div>
                                        <p className="text-[18px] font-extrabold text-[#1A1A2E] leading-none mb-1">4.9/5</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Top Rated</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Decorative Grid Behind */}
                            <div className="absolute inset-0 z-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:20px_20px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]"></div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ═══ FILTERS + LISTINGS ═══ */}
            <section className="py-16 bg-[#F9FAFB]">
                <div className="max-w-[1600px] w-full mx-auto px-6 md:px-12">

                    {/* Breadcrumb + Category title */}
                    <div className="mb-10">
                        <nav className="flex items-center gap-2 text-[13px] text-[#6B7280] font-medium mb-4">
                            <Link to="/" className="hover:text-[#E87722] transition-colors">Home</Link>
                            <span className="text-slate-300">/</span>
                            <span className="text-[#1A1A2E] font-semibold">{selectedCategory}</span>
                        </nav>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-[32px] font-extrabold text-[#1A1A2E] tracking-[-0.01em] mb-1">{selectedCategory}</h2>
                                <p className="text-[15px] text-[#4B5563] font-normal italic">
                                    Showing {totalCount.toLocaleString()} verified listings in Tamil Nadu
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-10">

                        {/* ── Sidebar ── */}
                        <aside className="lg:col-span-3 lg:col-start-1 space-y-6">
                            <div className="bg-white rounded-[20px] p-6 border border-[#F3F4F6] shadow-[0_2px_12px_rgba(0,0,0,0.03)] sticky top-24">
                                <h4 className="text-[12px] font-bold text-[#1A1A2E] uppercase tracking-wider mb-5 pl-1">Browse Categories</h4>
                                <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-1 space-y-0.5">
                                    {Object.keys(categorySubMap).map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => handleCategorySelect(cat)}
                                            className={`w-full text-left px-4 py-2.5 rounded-lg text-[14px] font-medium transition-all ${selectedCategory === cat
                                                ? 'bg-[#FFF8F0] text-[#E87722] font-semibold'
                                                : 'text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#1A1A2E]'
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
                                    <select value={subCategory} onChange={(e) => { setSubCategory(e.target.value); setCurrentPage(1); }}
                                        className="w-full bg-white border border-[#E5E7EB] rounded-xl py-3.5 px-5 text-[14px] font-medium text-[#4B5563] appearance-none outline-none focus:border-[#E87722]/50 transition-all cursor-pointer shadow-sm">
                                        {uniqueSubCategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                                </div>
                                <div className="relative">
                                    <select value={district} onChange={(e) => { setDistrict(e.target.value); setAssembly('All Assemblies'); setCurrentPage(1); }}
                                        className="w-full bg-white border border-[#E5E7EB] rounded-xl py-3.5 px-5 text-[14px] font-medium text-[#4B5563] appearance-none outline-none focus:border-[#E87722]/50 transition-all cursor-pointer shadow-sm">
                                        {uniqueDistricts.map(dst => <option key={dst} value={dst}>{dst}</option>)}
                                    </select>
                                    <MapPin size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                                </div>
                                <div className="relative">
                                    <select value={assembly} onChange={(e) => { setAssembly(e.target.value); setCurrentPage(1); }}
                                        className="w-full bg-white border border-[#E5E7EB] rounded-xl py-3.5 px-5 text-[14px] font-medium text-[#4B5563] appearance-none outline-none focus:border-[#E87722]/50 transition-all cursor-pointer shadow-sm"
                                        disabled={district === 'All Districts'}>
                                        {(districtAssemblyMap[district] || ["All Assemblies"]).map(asm => <option key={asm} value={asm}>{asm}</option>)}
                                    </select>
                                    <MapPin size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                                </div>
                            </div>

                            {/* Results */}
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-28 gap-4">
                                    <Loader2 size={36} className="animate-spin text-[#E87722]" />
                                    <p className="text-[14px] font-medium text-[#9CA3AF]">Finding businesses…</p>
                                </div>
                            ) : error ? (
                                <div className="p-8 bg-rose-50 rounded-[20px] border border-rose-100 text-center">
                                    <AlertCircle size={36} className="mx-auto text-rose-500 mb-3" />
                                    <p className="text-rose-600 font-bold">{error}</p>
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
                                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                                            className="w-10 h-10 rounded-lg border border-[#E5E7EB] bg-white flex items-center justify-center hover:bg-[#F9FAFB] transition-all disabled:opacity-30 disabled:cursor-not-allowed text-[#1A1A2E] shadow-sm">
                                            <ChevronLeft size={18} />
                                        </button>
                                        <span className="text-[14px] font-semibold text-[#1A1A2E] bg-white px-4 py-2 rounded-lg border border-[#E5E7EB] shadow-sm">Page {currentPage}</span>
                                        <button onClick={() => setCurrentPage(p => p + 1)} disabled={businesses.length < 12}
                                            className="w-10 h-10 rounded-lg border border-[#E5E7EB] bg-white flex items-center justify-center hover:bg-[#F9FAFB] transition-all disabled:opacity-30 disabled:cursor-not-allowed text-[#1A1A2E] shadow-sm">
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-[20px] border border-[#F3F4F6] shadow-sm">
                                    <p className="text-[#9CA3AF] font-medium text-[15px]">No businesses found matching your criteria.</p>
                                    <button onClick={() => { handleCategorySelect('All Categories'); setSearchTerm(''); setFinalizedSearch(''); }}
                                        className="mt-4 text-[#E87722] font-semibold text-[14px] underline underline-offset-4 hover:text-[#D36B1E] transition-colors">Clear filters</button>
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
