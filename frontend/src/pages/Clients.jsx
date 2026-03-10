import React from 'react';
import { Users, Plus, Search } from 'lucide-react';
import { Button } from '../components/Button';
import { DataTable } from '../components/DataTable';

const Clients = () => {
    const columns = [
        { header: 'Nome', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Telefone', accessor: 'phone' },
        { header: 'Status', accessor: 'status' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Carteira de Clientes</h1>
                    <p className="text-gray-400 font-medium text-sm mt-1 uppercase tracking-widest text-[10px]">Gestão de Relacionamento Atlas</p>
                </div>
                <Button className="gap-2">
                    <Plus size={18} />
                    Novo Cliente
                </Button>
            </div>

            <div className="bg-white rounded-[10px] border border-gray-100 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={[]} emptyMessage="Nenhum cliente cadastrado no AtlasOne." />
            </div>
        </div>
    );
};

export default Clients;
