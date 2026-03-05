import React, { useState, useEffect } from 'react';
import api from '../api/client';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, Package, AlertTriangle, ShoppingCart, DollarSign, Download, Calendar } from 'lucide-react';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const Reports = () => {
    const [stats, setStats] = useState(null);
    const [charts, setCharts] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, chartsRes] = await Promise.all([
                api.get('/reports/dashboard/stats'),
                api.get('/reports/dashboard/charts')
            ]);
            setStats(statsRes.data);
            setCharts(chartsRes.data);
        } catch (error) {
            console.error('Erro ao buscar dados do dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium animate-pulse">Carregando indicadores...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 bg-gray-50/30 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="text-indigo-600" />
                        Dashboard Executivo
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Análise em tempo real do seu inventário e operações</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all shadow-sm">
                        <Calendar size={16} />
                        Últimos 30 dias
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                        <Download size={16} />
                        Gerar PDF
                    </button>
                </div>
            </div>

            {/* Micro Stats Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Valor Total Stock', value: `R$ ${stats.total_inventory_value.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Produtos Ativos', value: stats.total_products, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Estoque Crítico', value: stats.low_stock_count, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Pedidos Pendentes', value: stats.open_purchase_orders, icon: ShoppingCart, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center transition-all hover:shadow-md hover:-translate-y-1">
                        <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mr-4`}>
                            <item.icon size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.label}</p>
                            <p className="text-xl font-bold text-gray-900 mt-1">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Evolution Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-800">Evolução de Movimentações</h3>
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded font-bold">+12.5% vs mês anterior</span>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={charts.stock_movements}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="entradas" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} name="Entradas" />
                                <Line type="monotone" dataKey="saidas" stroke="#EF4444" strokeWidth={3} dot={{ r: 4, fill: '#EF4444', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} name="Saídas" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribution Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6">Curva ABC (Top 5 Produtos)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={charts.top_products} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#4B5563', fontWeight: 500 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="stock" fill="#4F46E5" radius={[0, 4, 4, 0]} barSize={20} name="Estoque Atual" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Categories Pie */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="font-bold text-gray-800 mb-6 text-center">Distribuição do Valor de Inventário por Categoria</h3>
                    <div className="h-[300px] flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={charts.category_distribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {charts.category_distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
