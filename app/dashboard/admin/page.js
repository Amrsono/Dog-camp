'use client';
import Navbar from '../../components/Navbar';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function AdminDashboard() {
    const { t, lang } = useLanguage();
    const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' or 'stock'
    const [editingStock, setEditingStock] = useState(null);

    // Convex data
    const foodStockData = useQuery(api.users.getFoodStock);
    const bookingsData = useQuery(api.users.getAllBookings);
    const usersData = useQuery(api.users.getAllUsers);
    const rawActivitiesData = useQuery(api.users.getActivities);
    const updateStockMutation = useMutation(api.users.updateStock);
    const seedMutation = useMutation(api.users.seedAdminData);

    const isLoading = !foodStockData || !bookingsData || !usersData || !rawActivitiesData;

    const activitiesData = {
        today: rawActivitiesData?.filter(a => a.type === 'today') || [],
        week: rawActivitiesData?.filter(a => a.type === 'week') || [],
        month: rawActivitiesData?.filter(a => a.type === 'month') || []
    };

    const handleSeed = async () => {
        try {
            await seedMutation();
            alert("Database seeded successfully!");
        } catch (err) {
            console.error(err);
        }
    };

    const [servicesPricing, setServicesPricing] = useState([
        { id: 'luxuryHosting', price: '2,500' },
        { id: 'gourmetFeeding', price: '750' },
        { id: 'fullGrooming', price: '3,000' },
        { id: 'trainingBootCamp', price: '5,000' },
        { id: 'vetTeleHealth', price: '1,500' },
        { id: 'playGroup', price: '1,000' },
    ]);

    const lineData = {
        labels: lang === 'ar' ? ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: t?.admin?.charts?.revenue || 'Weekly Revenue (EGP)',
                data: [1200, 1900, 300, 500, 2000, 3000, 4500],
                borderColor: '#FF6B6B',
                backgroundColor: 'rgba(255, 107, 107, 0.5)',
                tension: 0.4,
            },
            {
                label: t?.admin?.charts?.bookings || 'New Bookings',
                data: [5, 8, 2, 4, 10, 15, 20],
                borderColor: '#4ECDC4',
                backgroundColor: 'rgba(78, 205, 196, 0.5)',
                tension: 0.4,
                yAxisID: 'y1',
            }
        ],
    };

    const doughnutData = {
        labels: lang === 'ar' ? ['المشي', 'التمشيط', 'الاستضافة', 'التدريب'] : ['Walking', 'Grooming', 'Hosting', 'Training'],
        datasets: [
            {
                data: [30, 20, 35, 15],
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#F7FFF7'],
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: { color: 'rgba(255,255,255,0.1)' }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { drawOnChartArea: false },
            },
            x: {
                grid: { color: 'rgba(255,255,255,0.1)' }
            }
        },
        plugins: {
            legend: { labels: { color: 'white' } }
        }
    };

    if (isLoading) return <div className="h-screen flex items-center justify-center text-[var(--primary)] text-2xl animate-pulse">Establishing Secure Uplink...</div>;

    return (
        <div className="min-h-screen bg-[var(--dark)] text-white pb-20">
            <Navbar />
            <div className="pt-52 px-4 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-8">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter text-white mb-2">
                            {t?.admin?.title || 'Admin Dashboard'}
                        </h1>
                        <p className="text-purple-400 font-medium tracking-widest text-xs uppercase mb-4">{t?.admin?.subtitle || 'Management Console'}</p>
                        <button
                            onClick={handleSeed}
                            className="text-[10px] px-3 py-1 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors uppercase tracking-widest text-gray-400"
                        >
                            Seed Demo Data
                        </button>
                    </div>
                    <div className="flex gap-4">
                        <div className="glass px-6 py-3 text-center">
                            <p className="text-xs text-gray-400">{t?.admin?.daily || 'Daily Income'}</p>
                            <p className="text-xl font-bold font-mono text-[var(--accent)]">62,000 EGP</p>
                        </div>
                        <div className="glass px-6 py-3 text-center">
                            <p className="text-xs text-gray-400">{t?.admin?.monthly || 'Monthly'}</p>
                            <p className="text-xl font-bold font-mono text-[var(--secondary)]">2,250,000 EGP</p>
                        </div>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-8 mb-12 border-b border-white/5">
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`pb-4 px-2 font-bold tracking-widest text-xs uppercase transition-all duration-300 relative ${activeTab === 'analytics' ? 'text-[var(--primary)]' : 'text-gray-500 hover:text-white'}`}
                    >
                        {t?.admin?.foodStock?.navAnalytics || 'Analytics'}
                        {activeTab === 'analytics' && (
                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('stock')}
                        className={`pb-4 px-2 font-bold tracking-widest text-xs uppercase transition-all duration-300 relative ${activeTab === 'stock' ? 'text-[var(--primary)]' : 'text-gray-500 hover:text-white'}`}
                    >
                        {t?.admin?.foodStock?.navStock || 'Food Stock'}
                        {activeTab === 'stock' && (
                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('activities')}
                        className={`pb-4 px-2 font-bold tracking-widest text-xs uppercase transition-all duration-300 relative ${activeTab === 'activities' ? 'text-[var(--primary)]' : 'text-gray-500 hover:text-white'}`}
                    >
                        {t?.admin?.activities?.navActivities || 'Schedule'}
                        {activeTab === 'activities' && (
                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('pricing')}
                        className={`pb-4 px-2 font-bold tracking-widest text-xs uppercase transition-all duration-300 relative ${activeTab === 'pricing' ? 'text-[var(--primary)]' : 'text-gray-500 hover:text-white'}`}
                    >
                        {t?.admin?.pricing?.navPricing || 'Pricing'}
                        {activeTab === 'pricing' && (
                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]" />
                        )}
                    </button>
                </div>

                {activeTab === 'analytics' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-2 glass p-6"
                        >
                            <h3 className="text-xl font-bold mb-6">{t?.admin?.trend || 'Revenue & Bookings Trend'}</h3>
                            <Line data={lineData} options={chartOptions} />
                        </motion.div>

                        {/* Service Distribution */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass p-6"
                        >
                            <h3 className="text-xl font-bold mb-6 text-center">{t?.admin?.popularity || 'Service Popularity'}</h3>
                            <div className="relative h-64 w-full flex justify-center">
                                <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: 'white' } } } }} />
                            </div>
                        </motion.div>

                        {/* User Database Table Snapshot */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="lg:col-span-3 glass p-6"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">{t?.admin?.recent || 'Recent Registrations'}</h3>
                                <button className="text-sm text-[var(--primary)] hover:underline">{t?.admin?.viewFull || 'View Full Database'}</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-700 text-gray-400">
                                            <th className="p-3">{t?.admin?.table?.user || 'User'}</th>
                                            <th className="p-3">{t?.admin?.table?.dog || 'Dog Name'}</th>
                                            <th className="p-3">{t?.admin?.table?.service || 'Service'}</th>
                                            <th className="p-3">{t?.admin?.table?.status || 'Status'}</th>
                                            <th className="p-3">{t?.admin?.table?.payment || 'Payment'}</th>
                                            <th className="p-3">{t?.admin?.table?.amount || 'Amount (EGP)'}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {usersData?.slice(0, 5).map((user) => (
                                            <tr key={user._id}>
                                                <td className="p-3">{user.name || 'Incognito'}</td>
                                                <td className="p-3">{user.dogName || '-'}</td>
                                                <td className="p-3">Standard</td>
                                                <td className="p-3"><span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">{t?.admin?.status?.active || 'Active'}</span></td>
                                                <td className="p-3">Pending</td>
                                                <td className="p-3 font-mono font-bold">0</td>
                                            </tr>
                                        ))}
                                        {usersData?.length === 0 && (
                                            <tr><td colSpan="6" className="p-10 text-center text-gray-500 italic">No cosmic travelers registered yet. Click Seed data.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>
                ) : activeTab === 'stock' ? (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass p-8"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black">{t?.admin?.foodStock?.title || 'Food Stock Management'}</h3>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase tracking-widest">{t?.admin?.foodStock?.totalStock || 'Total Inventory'}</p>
                                <p className="text-2xl font-bold font-mono text-[var(--primary)]">
                                    {foodStockData?.reduce((acc, curr) => acc + curr.level, 0) || 0} {t?.admin?.foodStock?.kg || 'kg'}
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-widest">
                                        <th className="p-4">{t?.admin?.foodStock?.brand || 'Brand'}</th>
                                        <th className="p-4">{t?.admin?.foodStock?.type || 'Formula'}</th>
                                        <th className="p-4">{t?.admin?.foodStock?.level || 'Stock Level'}</th>
                                        <th className="p-4">{t?.admin?.foodStock?.threshold || 'Threshold'}</th>
                                        <th className="p-4">{t?.admin?.foodStock?.status || 'Status'}</th>
                                        <th className="p-4 text-right">{t?.admin?.foodStock?.edit || 'Edit'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {foodStockData?.map((item) => (
                                        <tr key={item._id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-4 font-bold">{item.brand}</td>
                                            <td className="p-4 text-gray-400">{item.formula}</td>
                                            <td className="p-4">
                                                {editingStock === item._id ? (
                                                    <input
                                                        type="number"
                                                        defaultValue={item.level}
                                                        onBlur={async (e) => {
                                                            await updateStockMutation({ id: item._id, level: parseInt(e.target.value) || 0 });
                                                            setEditingStock(null);
                                                        }}
                                                        className="w-20 bg-white/10 border border-white/20 rounded px-2 py-1 focus:outline-none focus:border-[var(--primary)]"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <span className="font-mono font-bold">{item.level} {t?.admin?.foodStock?.kg || 'kg'}</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-gray-500 font-mono">{item.threshold} {t?.admin?.foodStock?.kg || 'kg'}</td>
                                            <td className="p-4">
                                                {item.level <= item.threshold ? (
                                                    <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter">
                                                        {t?.admin?.foodStock?.lowStock || 'LOW STOCK'}
                                                    </span>
                                                ) : (
                                                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter">
                                                        {t?.admin?.foodStock?.inStock || 'IN STOCK'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => setEditingStock(editingStock === item._id ? null : item._id)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--primary)] hover:underline text-sm font-bold"
                                                >
                                                    {editingStock === item._id ? (t?.admin?.foodStock?.save || 'Save') : (t?.admin?.foodStock?.edit || 'Edit')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : activeTab === 'activities' ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Activities Tab Content */}
                        {[
                            { title: t?.admin?.activities?.todayTitle || 'Today\'s Schedule', data: activitiesData.today, type: 'today' },
                            { title: t?.admin?.activities?.weekTitle || 'This Week', data: activitiesData.week, type: 'week' },
                            { title: t?.admin?.activities?.monthTitle || 'This Month', data: activitiesData.month, type: 'month' }
                        ].map((section, idx) => (
                            <div key={idx} className="glass p-6">
                                <h3 className="text-xl font-bold mb-6 text-[var(--primary)]">{section.title}</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-widest">
                                                <th className="p-3">{t?.admin?.activities?.tableDog || 'Dog Name'}</th>
                                                <th className="p-3">{t?.admin?.activities?.tableActivity || 'Activity'}</th>
                                                <th className="p-3">{section.type === 'today' ? (t?.admin?.activities?.tableTime || 'Time') : (t?.admin?.activities?.tableDate || 'Date')}</th>
                                                <th className="p-3">{t?.admin?.activities?.tableStatus || 'Status'}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {section.data.map((item) => (
                                                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="p-3 font-bold">{item.dog}</td>
                                                    <td className="p-3 text-gray-300">{item.activity}</td>
                                                    <td className="p-3 text-gray-400 font-mono text-sm">{section.type === 'today' ? item.time : item.date}</td>
                                                    <td className="p-3">
                                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${item.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                                            item.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                                                                'bg-yellow-500/20 text-yellow-400'
                                                            }`}>
                                                            {t?.admin?.status?.[item.status] || item.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass p-8"
                    >
                        <h3 className="text-2xl font-black mb-8">{t?.admin?.pricing?.title || 'Services Pricing Management'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {servicesPricing.map((service) => (
                                <div key={service.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-[var(--primary)]/50 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-gray-200">{t?.services?.[service.id]?.title || service.id}</h4>
                                        <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                                            💸
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{t?.admin?.pricing?.currentPrice || 'Current Price'}</p>
                                            <div className="flex gap-2 items-end">
                                                <input
                                                    type="text"
                                                    value={service.price}
                                                    onChange={(e) => {
                                                        const newPricing = [...servicesPricing];
                                                        newPricing.find(s => s.id === service.id).price = e.target.value;
                                                        setServicesPricing(newPricing);
                                                    }}
                                                    className="bg-transparent border-b border-white/10 focus:border-[var(--primary)] focus:outline-none text-xl font-mono font-bold w-32"
                                                />
                                                <span className="text-sm text-gray-400 mb-1">EGP</span>
                                            </div>
                                        </div>
                                        <button className="w-full py-2 rounded-lg bg-[var(--primary)] hover:opacity-90 transition-opacity text-sm font-bold">
                                            {t?.admin?.pricing?.updatePrice || 'Update Price'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div >
    );
}
