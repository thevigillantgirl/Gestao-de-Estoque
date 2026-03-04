import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, ShoppingCart, ArrowLeftRight, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { DataTable } from '../components/DataTable';
import api from '../api/client';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStockCount: 0,
        openOrders: 0,
        movementsToday: 0
    });
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [productsRes, lowStockRes, ordersRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/products/low-stock'),
                    api.get('/purchase-orders')
                ]);

                setStats({
                    totalProducts: productsRes.data.length,
                    lowStockCount: lowStockRes.data.length,
                    openOrders: ordersRes.data.filter(o => o.status === 'SENT' || o.status === 'DRAFT').length,
                    movementsToday: 12 // Mocked for now
                });
                setLowStockProducts(lowStockRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const columns = [
        { header: 'Produto', accessor: 'name' },
        { header: 'SKU', accessor: 'sku' },
        {
            header: 'Estoque Atual',
            render: (row) => (
                <span className="font-bold text-red-600 dark:text-red-400">
                    {row.stock} un
                </span>
            )
        },
        { header: 'Mínimo', accessor: 'min_stock' },
    ];

    return (
        <div className="space-y-8">
            {/* KPI Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Produtos" value={stats.totalProducts} icon={Package} color="blue" />
                <StatCard title="Estoque Crítico" value={stats.lowStockCount} icon={AlertTriangle} color="red" />
                <StatCard title="Pedidos em Aberto" value={stats.openOrders} icon={ShoppingCart} color="amber" />
                <StatCard title="Movimentações Hoje" value={stats.movementsToday} icon={ArrowLeftRight} color="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area (Mockup for now) */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="text-blue-600" size={20} />
                            Tendência de Movimentação
                        </h3>
                        <select className="bg-gray-100 dark:bg-slate-900 border-none rounded-lg px-3 py-1.5 text-xs font-medium outline-none">
                            <option>Últimos 7 dias</option>
                            <option>Últimos 30 dias</option>
                        </select>
                    </div>

                    <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 dark:border-slate-700 rounded-lg">
                        <div className="flex gap-4 items-end h-32 mb-4">
                            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                <div
                                    key={i}
                                    style={{ height: `${h}%` }}
                                    className="w-8 bg-blue-500/20 hover:bg-blue-500 rounded-t transition-all cursor-pointer group relative"
                                >
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500">Gráfico de desempenho semanal</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase">Entradas</span>
                                <ArrowUpRight size={16} className="text-green-600" />
                            </div>
                            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">+12.5%</p>
                        </div>
                        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-red-600 dark:text-red-400 uppercase">Saídas</span>
                                <ArrowDownRight size={16} className="text-red-600" />
                            </div>
                            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">-5.2%</p>
                        </div>
                    </div>
                </div>

                {/* Low Stock Table */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <AlertTriangle className="text-red-600" size={20} />
                            Atenção: Estoque Baixo
                        </h3>
                    </div>
                    <DataTable
                        columns={columns}
                        data={lowStockProducts}
                        isLoading={loading}
                        emptyMessage="Tudo sob controle! Nenhum item em falta."
                    />
                </div>
            </div>
        </div>
    );
}
