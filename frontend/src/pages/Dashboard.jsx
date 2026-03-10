import React, { useState, useEffect } from 'react';
import {
    TrendingUp, TrendingDown, Users, Package,
    ShoppingCart, AlertCircle, ArrowUpRight, Plus,
    BarChart3, Activity, Briefcase, FileText,
    Wallet, DollarSign, Sparkles, Box, Zap
} from 'lucide-react';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import api from '../api/client';

const StatCard = ({ title, value, change, trend, icon: Icon, color, premium, alert }) => (
    <div className={`bg-white p-6 rounded-[10px] shadow-sm border ${premium ? 'border-amber-100' : 'border-gray-100'} flex flex-col space-y-4 hover:shadow-md transition-all group relative overflow-hidden ${alert ? 'ring-2 ring-red-50' : ''}`}>
        {premium && <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-amber-50 rounded-full blur-2xl opacity-50" />}
        <div className="flex items-center justify-between">
            <div className={`p-3 rounded-[10px] ${premium ? 'bg-amber-50 text-amber-600' : `bg-indigo-50 text-indigo-600`} group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
            <div className={`flex items-center space-x-1 text-[10px] font-bold px-2 py-1 rounded-full ${change?.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                {change?.startsWith('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{change || '0%'}</span>
            </div>
        </div>
        <div>
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        revenue: 0,
        profit: 0,
        sales_volume: 0,
        new_clients: 0,
        low_stock: 0,
        trends: {
            revenue: "+0%",
            profit: "+0%",
            sales: "+0%",
            clients: "+0%"
        }
    });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, chartRes] = await Promise.all([
                    api.get('/dashboard/stats'),
                    api.get('/dashboard/charts')
                ]);
                setStats(statsRes.data);
                setChartData(chartRes.data);
            } catch (error) {
                console.error("Erro ao carregar dados do dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const cards = [
        { title: 'Faturamento Bruto', value: formatCurrency(stats.revenue), change: stats.trends.revenue, icon: DollarSign, premium: true },
        { title: 'Lucro Líquido', value: formatCurrency(stats.profit), change: stats.trends.profit, icon: TrendingUp },
        { title: 'Volume de Vendas', value: stats.sales_volume.toLocaleString(), change: stats.trends.sales, icon: ShoppingCart },
        { title: 'Novos Clientes', value: stats.new_clients.toLocaleString(), change: stats.trends.clients, icon: Users },
        { title: 'Estoque Baixo', value: stats.low_stock.toLocaleString(), change: '+0', icon: Box, alert: stats.low_stock > 0 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Atlas Dashboard</h1>
                    <p className="text-gray-400 font-medium text-sm mt-1">Visão 360° da sua operação empresarial real-time.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-200 rounded-[10px] text-gray-600 hover:bg-gray-50 font-bold text-sm transition-all">
                        <FileText size={16} />
                        <span>Gerar Relatório</span>
                    </button>
                    <button className="flex items-center space-x-2 px-5 py-2.5 bg-[#4F46E5] text-white rounded-[10px] hover:bg-[#4338CA] font-bold text-sm transition-all shadow-lg shadow-indigo-100 active:scale-95">
                        <Plus size={16} />
                        <span>Nova Transação</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {cards.map((card, i) => (
                    <StatCard key={i} {...card} />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-[10px] border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Performance Analítica</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Receita vs Despesas Operacionais</p>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-tighter">
                                <div className="w-2.5 h-2.5 rounded-sm bg-[#4F46E5]"></div>
                                <span className="text-gray-500">Receita</span>
                            </div>
                            <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-tighter">
                                <div className="w-2.5 h-2.5 rounded-sm bg-red-400"></div>
                                <span className="text-gray-500">Despesa</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorAtlas" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={4} fillOpacity={1} fill="url(#colorAtlas)" />
                                <Line type="monotone" dataKey="expenses" stroke="#f87171" strokeWidth={2} dot={false} strokeDasharray="4 4" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#1F2937] text-white rounded-[10px] p-8 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                        <Zap size={80} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                <Zap size={18} />
                            </div>
                            <h3 className="font-bold text-sm tracking-wide uppercase">Atlas Intelligence</h3>
                        </div>

                        <div className="space-y-6 flex-1">
                            {stats.revenue === 0 ? (
                                <div className="space-y-4">
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Nenhuma movimentação encontrada. Cadastre vendas, despesas e clientes para visualizar análises inteligentes.
                                    </p>
                                    <div className="p-4 bg-white/5 rounded-lg border border-white/10 italic text-xs text-indigo-300">
                                        "Sem dados suficientes para gerar insights automáticos."
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-indigo-100 text-sm leading-relaxed">
                                        Seu faturamento atual é de <span className="font-bold text-amber-400">{formatCurrency(stats.revenue)}</span>.
                                    </p>
                                    <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                                        <p className="text-[10px] text-indigo-300 uppercase font-bold tracking-widest mb-1">Estratégia Atlas</p>
                                        <p className="text-xs text-white">Otimizar conversão no funil de CRM para aumentar Lucro Líquido.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-[10px] transition-all font-bold text-xs uppercase tracking-widest border border-white/10">
                            Acessar IA Completa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
