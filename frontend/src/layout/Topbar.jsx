import React from 'react';
import { Moon, Sun, Search, Bell, User } from 'lucide-react';

export function Topbar({ isDarkMode, toggleDarkMode }) {
    return (
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 fixed top-0 right-0 left-64 z-20 flex items-center justify-between px-8 shadow-sm transition-colors">
            <div className="flex-1 max-w-md">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar global..."
                        className="w-full bg-gray-100 dark:bg-slate-900 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-700 dark:text-gray-200"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleDarkMode}
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title={isDarkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700 rounded-lg transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                </button>

                <div className="h-8 w-px bg-gray-200 dark:bg-slate-700 mx-2"></div>

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Maria Luiza</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Administrador</p>
                    </div>
                    <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold ring-2 ring-blue-100 dark:ring-blue-900/30">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
}
