import React from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, DollarSign } from 'lucide-react';

const Finance = () => (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold">Financeiro</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border flex items-center space-x-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl"><ArrowUpCircle /></div>
                <div><p className="text-sm text-gray-500">Receitas</p><p className="text-xl font-bold">R$ 12.450,00</p></div>
            </div>
            <div className="bg-white p-6 rounded-2xl border flex items-center space-x-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-xl"><ArrowDownCircle /></div>
                <div><p className="text-sm text-gray-500">Despesas</p><p className="text-xl font-bold">R$ 5.200,00</p></div>
            </div>
            <div className="bg-white p-6 rounded-2xl border flex items-center space-x-4 shadow-sm border-indigo-100">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><DollarSign /></div>
                <div><p className="text-sm text-gray-500">Saldo Geral</p><p className="text-xl font-bold">R$ 7.250,00</p></div>
            </div>
        </div>
        <div className="bg-white rounded-2xl border h-96 flex items-center justify-center text-gray-400">
            Fluxo de Caixa e Extrato de Transações
        </div>
    </div>
);

export default Finance;
