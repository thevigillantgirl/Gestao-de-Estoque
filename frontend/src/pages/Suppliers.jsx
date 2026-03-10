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
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
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

    const handleViewDetail = (supplier) => {
        setSelectedSupplier(supplier);
        setIsDetailModalOpen(true);
    };

    const handleSubmit = async (e) => {
        // ... existing handleSubmit logic ...
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
                <div onClick={() => handleViewDetail(row)} className="flex items-center gap-4 cursor-pointer group">
                    <div className="w-10 h-10 bg-indigo-50 text-[#4F46E5] rounded-[10px] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <Users size={20} />
                    </div>
                    <span className="font-bold text-[#4F46E5] group-hover:underline text-sm">{row.name}</span>
                </div>
            )
        },
        // ... remaining columns ...
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
                {/* ... form content ... */}
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

            {/* Modal de Detalhes */}
            <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Perfil do Fornecedor">
                {selectedSupplier && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-5 bg-gray-50 p-6 rounded-[12px] border border-gray-100">
                            <div className="w-16 h-16 bg-[#4F46E5] text-white rounded-[12px] flex items-center justify-center shadow-lg shadow-indigo-200">
                                <Users size={30} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedSupplier.name}</h3>
                                <p className="text-sm text-gray-500">{selectedSupplier.document || 'Sem documento'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl">
                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">E-mail de Contato</p>
                                <p className="text-sm font-medium flex items-center gap-2 dark:text-gray-200">
                                    <Mail size={14} className="text-blue-500" />
                                    {selectedSupplier.email || 'Não informado'}
                                </p>
                            </div>
                            <div className="p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl">
                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Telefone / WhatsApp</p>
                                <p className="text-sm font-medium flex items-center gap-2 dark:text-gray-200">
                                    <Phone size={14} className="text-green-500" />
                                    {selectedSupplier.phone || 'Não informado'}
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-slate-700 pt-6 flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)}>Fechar Perfil</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
