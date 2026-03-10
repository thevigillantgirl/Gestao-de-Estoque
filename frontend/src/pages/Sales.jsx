import React from 'react';
import { ShoppingBag, Plus, Search, Filter } from 'lucide-react';
import { Button } from '../components/Button';
import { DataTable } from '../components/DataTable';

const Sales = () => {
    const columns = [
        { header: 'ID Venda', accessor: 'id' },
        { header: 'Cliente', accessor: 'client' },
        { header: 'Total', accessor: 'total' },
        { header: 'Status', accessor: 'status' },
        { header: 'Data', accessor: 'date' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Vendas</h1>
                    <p className="text-gray-400 font-medium text-sm mt-1 uppercase tracking-widest text-[10px]">Gestão de Pedidos Atlas</p>
                </div>
                <Button className="gap-2">
                    <Plus size={18} />
                    Nova Venda
                </Button>
            </div>

            <div className="bg-white rounded-[10px] border border-gray-100 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={[]} emptyMessage="Nenhuma venda registrada ainda." />
            </div>
        </div>
    );
};

export default Sales;
