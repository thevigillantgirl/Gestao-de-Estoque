import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingCart, Users, UserRound,
    BarChart3, Settings, LogOut, Menu, X,
    Briefcase, Wallet, Package, Search, Bell,
    Sparkles, Moon, Sun, ChevronRight, Plus,
    Cpu, ClipboardList
} from 'lucide-react';
import { useAuth } from '../api/AuthContext';

const SidebarItem = ({ icon: Icon, label, path, active, collapsed }) => (
    <Link
        to={path}
        className={`flex items-center space-x-3 px-4 py-3 rounded-[10px] transition-all duration-200 group ${active
            ? 'bg-[#4F46E5] text-white shadow-lg shadow-indigo-200/50'
            : 'text-gray-400 hover:bg-[#2D3748] hover:text-white'
            }`}
    >
        <Icon className={`w-5 h-5 ${active ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
        {!collapsed && <span className="font-medium text-sm tracking-wide">{label}</span>}
        {active && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80" />}
    </Link>
);

const Layout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: ShoppingCart, label: 'Compras', path: '/purchases' },
        { icon: Briefcase, label: 'CRM', path: '/crm' },
        { icon: UserRound, label: 'Clientes', path: '/clients' },
        { icon: Users, label: 'Fornecedores', path: '/suppliers' },
        { icon: Wallet, label: 'Financeiro', path: '/finance' },
        { icon: Package, label: 'Estoque', path: '/stock' },
        { icon: ClipboardList, label: 'Produtos', path: '/products' },
        { icon: BarChart3, label: 'Relatórios', path: '/reports' },
        { icon: Cpu, label: 'IA Empresarial', path: '/ai' },
        { icon: Users, label: 'Usuários', path: '/admin/users' },
        { icon: Settings, label: 'Configurações', path: '/settings' },
    ];

    return (
        <div className="min-h-screen bg-[#F6F7FB] flex flex-col md:flex-row font-sans text-[#111827]">
            {/* Mobile Header */}
            <header className="md:hidden bg-[#1F2937] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-[#4F46E5] rounded-lg flex items-center justify-center">
                        <Sparkles className="text-white w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">AtlasOne</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </header>

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 bg-[#1F2937] transition-all duration-300 transform 
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
                ${collapsed ? 'w-20' : 'w-64'} h-screen flex flex-col shadow-2xl`}>

                <div className="p-6 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#4F46E5] rounded-[10px] flex items-center justify-center shadow-lg shadow-indigo-900/20">
                        <Sparkles className="text-white w-6 h-6" />
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="font-bold text-xl text-white tracking-tight">AtlasOne</span>
                            <span className="text-[10px] font-bold text-[#FBBF24] uppercase tracking-widest opacity-80">Enterprise OS</span>
                        </div>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-gray-700">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            {...item}
                            active={location.pathname === item.path}
                            collapsed={collapsed}
                        />
                    ))}
                </nav>

                <div className="p-4 bg-[#111827]/50 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-[10px] hover:bg-red-500/10 text-red-400 transition-colors ${collapsed ? 'justify-center' : ''}`}
                    >
                        <LogOut className="w-5 h-5" />
                        {!collapsed && <span className="font-medium text-sm">Sair do Sistema</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                {/* Topbar */}
                <header className="bg-white border-b sticky top-0 z-30 px-8 py-4 flex items-center justify-between shadow-sm">
                    <div className="relative group max-w-md w-full hidden lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Pesquisar em AtlasOne..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-[10px] focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-sm placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <button
                                onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
                                className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-[#4F46E5] text-white rounded-[10px] hover:bg-[#4338CA] transition-all font-bold text-sm shadow-lg shadow-indigo-100 active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Novo Registro</span>
                            </button>

                            {isNewMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsNewMenuOpen(false)}></div>
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-[10px] shadow-xl border border-gray-100 z-50 py-2 animate-in slide-in-from-top-2 duration-200">
                                        <button
                                            onClick={() => { navigate('/finance'); setIsNewMenuOpen(false); }}
                                            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 hover:bg-indigo-50 hover:text-[#4F46E5] transition-colors"
                                        >
                                            <Wallet className="w-4 h-4" />
                                            <span className="font-bold">Nova Transação</span>
                                        </button>
                                        <button
                                            onClick={() => { navigate('/reports'); setIsNewMenuOpen(false); }}
                                            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 hover:bg-indigo-50 hover:text-[#4F46E5] transition-colors"
                                        >
                                            <BarChart3 className="w-4 h-4" />
                                            <span className="font-bold">Gerar Relatório</span>
                                        </button>
                                        <div className="h-px bg-gray-50 my-1"></div>
                                        <button
                                            onClick={() => { navigate('/products'); setIsNewMenuOpen(false); }}
                                            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 hover:bg-indigo-50 hover:text-[#4F46E5] transition-colors"
                                        >
                                            <Package className="w-4 h-4" />
                                            <span className="font-bold">Novo Produto</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-400 hover:text-[#4F46E5] transition-colors relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#EF4444] rounded-full border-2 border-white"></span>
                            </button>
                            <div className="h-6 w-px bg-gray-200"></div>
                            <div className="flex items-center space-x-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-gray-900 leading-none">{user?.name || 'Admin User'}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">Proprietário</p>
                                </div>
                                <div className="w-10 h-10 rounded-[10px] bg-[#4F46E5] flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
                                    {user?.name?.substring(0, 2).toUpperCase() || 'AO'}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-[1600px] mx-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
