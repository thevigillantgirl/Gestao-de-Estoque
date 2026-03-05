import React, { useState, useEffect } from 'react';
import { Moon, Sun, Search as SearchIcon, Bell, User, LogOut, Package, Users as UsersIcon } from 'lucide-react';
import { useAuth } from '../api/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export function Topbar({ isDarkMode, toggleDarkMode }) {
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.length > 2) {
                performSearch();
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const performSearch = async () => {
        try {
            const response = await api.get(`/search/?q=${searchQuery}`);
            setSearchResults(response.data);
            setShowSearch(true);
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    const handleResultClick = (path) => {
        navigate(path);
        setShowSearch(false);
        setSearchQuery('');
    };

    return (
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 fixed top-0 right-0 left-64 z-20 flex items-center justify-between px-8 shadow-sm transition-colors">
            <div className="flex-1 max-w-md relative group">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar produtos, SKUs, fornecedores..."
                        className="w-full bg-gray-100 dark:bg-slate-900 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-700 dark:text-gray-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery.length > 2 && setShowSearch(true)}
                    />
                </div>

                {showSearch && searchResults.length > 0 && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowSearch(false)}></div>
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-20 animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="p-2 max-h-[400px] overflow-y-auto">
                                {searchResults.map((result, idx) => (
                                    <button
                                        key={`${result.type}-${result.id}-${idx}`}
                                        onClick={() => handleResultClick(result.path)}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-left group"
                                    >
                                        <div className={`p-2 rounded-lg ${result.type === 'product' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'bg-green-50 dark:bg-green-900/20 text-green-600'}`}>
                                            {result.type === 'product' ? <Package size={18} /> : <UsersIcon size={18} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                                                {result.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {result.subtitle}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleDarkMode}
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title={isDarkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                {/* ... existing user menu logic ... */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 pl-2 hover:bg-gray-50 dark:hover:bg-slate-700 p-1.5 rounded-lg transition-colors"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.email?.split('@')[0] || 'Usuário'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role === 'ADMIN' ? 'Administrador' : 'Operador'}</p>
                        </div>
                        <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold ring-2 ring-blue-100 dark:ring-blue-900/30">
                            <User size={20} />
                        </div>
                    </button>

                    {showUserMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)}></div>
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-1 z-20 animate-in fade-in zoom-in-95 duration-100">
                                <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Logado como</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.email}</p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                >
                                    <LogOut size={16} />
                                    <span>Sair do Sistema</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
