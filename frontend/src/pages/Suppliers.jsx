import React, { useState, useEffect } from 'react';
import { Plus, Users, Mail, Phone, FileText } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import api from '../api/client';

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        document: '',
        email: '',
        phone: ''
    });

    async function fetchSuppliers() {
        try {
            setLoading(true);
            const res = await api.get('/suppliers');
            setSuppliers(res.data);
        } catch (error) {
            alert('Erro ao carregar fornecedores');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/suppliers/', formData);
            setIsModalOpen(false);
            setFormData({ name: '', document: '', email: '', phone: '' });
            fetchSuppliers();
        } catch (error) {
            alert('Erro ao criar fornecedor');
        }
    };

    const columns = [
        {
            header: 'Nome',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded flex items-center justify-center">
                        <Users size={20} />
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">{row.name}</span>
                </div>
            )
        },
        {
            header: 'Contato',
            render: (row) => (
                <div className="space-y-1">
                    {row.email && <p className="text-xs flex items-center gap-2 text-gray-500"><Mail size={12} /> {row.email}</p>}
                    {row.phone && <p className="text-xs flex items-center gap-2 text-gray-500"><Phone size={12} /> {row.phone}</p>}
                </div>
            )
        },
        {
            header: 'Documento',
            render: (row) => (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <FileText size={14} />
                    <span className="text-sm font-medium">{row.document || 'N/A'}</span>
                </div>
            )
        },
        { header: 'Data Cadastro', render: (row) => new Date(row.created_at).toLocaleDateString() },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                    <Plus size={18} />
                    Novo Fornecedor
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={suppliers} isLoading={loading} />
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Cadastrar Novo Fornecedor">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome/Razão Social</label>
                        <input
                            required
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CNPJ / CPF</label>
                        <input
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            value={formData.document}
                            onChange={e => setFormData({ ...formData, document: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
                            <input
                                type="email"
                                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone</label>
                            <input
                                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Salvar Fornecedor</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
