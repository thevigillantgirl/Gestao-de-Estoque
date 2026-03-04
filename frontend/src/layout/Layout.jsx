import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function Layout() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    const location = useLocation();

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    // Map paths to breadcrumb/page title
    const getPageTitle = (path) => {
        const titles = {
            '/': 'Dashboard Geral',
            '/products': 'Gestão de Produtos',
            '/suppliers': 'Fornecedores',
            '/stock': 'Movimentações de Estoque',
            '/purchase-orders': 'Pedidos de Compra',
            '/integrations': 'Integrações Externas',
            '/settings': 'Configurações do Sistema'
        };
        return titles[path] || 'Página';
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors">
                <Topbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

                <main className="mt-16 p-8 flex-1">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>ERP</span>
                            <span>/</span>
                            <span className="font-semibold text-blue-600 dark:text-blue-400 capitalize">
                                {location.pathname.replace('/', '') || 'Dashboard'}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {getPageTitle(location.pathname)}
                        </h1>
                    </div>

                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
