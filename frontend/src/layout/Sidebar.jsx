import {
    LayoutDashboard,
    Package,
    Users,
    ArrowLeftRight,
    ShoppingCart,
    ExternalLink,
    Settings,
    BarChart3,
    History,
    ShieldCheck,
    FileText
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';

const getNavItems = (isAdmin) => [
    {
        group: 'Principal', items: [
            { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
            { name: 'Relatórios', icon: BarChart3, path: '/reports' },
        ]
    },
    {
        group: 'Cadastros', items: [
            { name: 'Produtos', icon: Package, path: '/products' },
            { name: 'Fornecedores', icon: Users, path: '/suppliers' },
        ]
    },
    {
        group: 'Operações', items: [
            { name: 'Movimentações', icon: ArrowLeftRight, path: '/stock' },
            { name: 'Pedidos de Compra', icon: ShoppingCart, path: '/purchase-orders' },
            { name: 'Histórico', icon: History, path: '/history' },
        ]
    },
    ...(isAdmin ? [{
        group: 'Administração', items: [
            { name: 'Usuários', icon: Users, path: '/users' },
            { name: 'Solicitações', icon: FileText, path: '/access-requests' },
            { name: 'Logs de Acesso', icon: ShieldCheck, path: '/logs' },
            { name: 'Integrações', icon: ExternalLink, path: '/integrations' },
            { name: 'Configurações', icon: Settings, path: '/settings' },
        ]
    }] : []),
];

export function Sidebar() {
    const { isAdmin } = useAuth();
    const navItems = getNavItems(isAdmin);
    return (
        <aside className="w-64 h-screen bg-[#1F2937] text-gray-400 flex flex-col fixed left-0 top-0 z-30 transition-all shadow-xl">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <Package className="text-white" size={18} />
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">GestãoPRO</span>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {navItems.map((group, idx) => (
                    <div key={idx} className="mb-6 last:mb-0">
                        <h4 className="px-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                            {group.group}
                        </h4>
                        <div className="space-y-0.5">
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group
                    ${isActive
                                            ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-600 rounded-l-none'
                                            : 'hover:bg-gray-800 hover:text-white'}
                  `}
                                >
                                    <item.icon size={18} className="group-hover:scale-110 transition-transform" />
                                    {item.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-700 bg-gray-900/50">
                <p className="text-[10px] text-gray-500 text-center">ERP v1.0.0 © 2026</p>
            </div>
        </aside>
    );
}
