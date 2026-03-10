import React from 'react';
import { BarChart3, Download, Calendar } from 'lucide-react';
import { Button } from '../components/Button';

const Reports = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-center py-20">
            <div className="w-20 h-20 bg-indigo-50 rounded-[20px] flex items-center justify-center mx-auto mb-6 text-[#4F46E5]">
                <BarChart3 size={40} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Centro de Relatórios</h1>
            <p className="text-gray-400 max-w-sm mx-auto">Visualize o desempenho da sua empresa com relatórios automáticos gerados pela AtlasOne.</p>
            <div className="flex justify-center gap-4 mt-8">
                <Button variant="secondary" className="gap-2">
                    <Calendar size={18} />
                    Período Personalizado
                </Button>
                <Button className="gap-2">
                    <Download size={18} />
                    Exportar Base Completa
                </Button>
            </div>
        </div>
    );
};

export default Reports;
