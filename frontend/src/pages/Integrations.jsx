import React, { useState, useEffect } from 'react';
import { ExternalLink, Plus, Zap, CheckCircle, XCircle, Globe, Shield } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { StatusBadge } from '../components/StatusBadge';
import api from '../api/client';

export default function Integrations() {
    const [endpoints, setEndpoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dispatching, setDispatching] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        event_type: 'stock.low',
        target_url: '',
        secret: ''
    });

    async function fetchEndpoints() {
        try {
            setLoading(true);
            const res = await api.get('/integrations/endpoints');
            setEndpoints(res.data);
        } catch (error) {
            alert('Erro ao carregar integrações');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEndpoints();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/integrations/endpoints', formData);
            setIsModalOpen(false);
            setFormData({ name: '', event_type: 'stock.low', target_url: '', secret: '' });
            fetchEndpoints();
        } catch (error) {
            alert('Erro ao salvar endpoint');
        }
    };

    const handleDispatch = async (eventType) => {
        try {
            setDispatching(eventType);
            const res = await api.post(`/integrations/dispatch/${eventType}`);
            alert(`Dispatch finalizado: ${res.data.dispatched} enviados, ${res.data.failed} falhas.`);
        } catch (error) {
            alert('Erro ao disparar eventos');
        } finally {
            setDispatching(null);
        }
    };

    const columns = [
        {
            header: 'Nome/Integração',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded flex items-center justify-center">
                        <Globe size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">{row.name}</p>
                        <StatusBadge status={row.is_active ? 'ACTIVE' : 'INACTIVE'} />
                    </div>
                </div>
            )
        },
        {
            header: 'Tipo de Evento',
            render: (row) => (
                <code className="text-xs font-mono bg-gray-100 dark:bg-slate-900 p-1 rounded">
                    {row.event_type}
                </code>
            )
        },
        {
            header: 'Endpoint URL',
            render: (row) => (
                <span className="text-sm text-gray-500 truncate block max-w-xs">{row.target_url}</span>
            )
        },
        {
            header: 'Segurança',
            render: (row) => row.secret ? <Shield size={16} className="text-green-500" title="Possui secret key" /> : <span className="text-xs text-gray-400">Sem Secret</span>
        },
        {
            header: 'Ações',
            render: (row) => (
                <Button
                    size="sm"
                    variant="secondary"
                    className="gap-2"
                    onClick={() => handleDispatch(row.event_type)}
                    disabled={dispatching === row.event_type}
                >
                    <Zap size={14} className={dispatching === row.event_type ? 'animate-pulse' : ''} />
                    {dispatching === row.event_type ? 'Disparando...' : 'Testar'}
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl text-white shadow-lg">
                    <h3 className="text-xl font-bold mb-2">Padrão Outbox</h3>
                    <p className="text-sm opacity-90 leading-relaxed">
                        O sistema registra eventos e você os dispara manualmente ou via cron.
                        Isso garante que sua aplicação nunca trave se o n8n ou outro serviço estiver offline.
                    </p>
                    <div className="mt-4 flex gap-4">
                        <div className="flex items-center gap-2 text-xs">
                            <CheckCircle size={14} /> Tolerância a falhas
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <CheckCircle size={14} /> Logs completos
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 flex flex-col justify-center">
                    <h4 className="text-sm font-bold text-gray-400 uppercase mb-4">Ações Rápidas</h4>
                    <div className="flex gap-4">
                        <Button onClick={() => handleDispatch('stock.low')} variant="secondary" className="flex-1 gap-2">
                            <Zap size={16} /> Dispatch Low Stock
                        </Button>
                        <Button onClick={() => handleDispatch('stock.updated')} variant="secondary" className="flex-1 gap-2">
                            <Zap size={16} /> Dispatch Updates
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Webhooks Cadastrados</h3>
                <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                    <Plus size={18} />
                    Novo Endpoint
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={endpoints} isLoading={loading} />
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Conectar Integração (Webhook)">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                        <input
                            required placeholder="Ex: n8n Recebimento de Estoque"
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Evento</label>
                            <select
                                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                value={formData.event_type}
                                onChange={e => setFormData({ ...formData, event_type: e.target.value })}
                            >
                                <option value="stock.low">Estoque Baixo</option>
                                <option value="stock.updated">Estoque Atualizado</option>
                                <option value="purchase_order.sent">PO Enviado</option>
                                <option value="purchase_order.received">PO Recebido</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Secret Key (X-Webhook-Secret)</label>
                            <input
                                placeholder="Opcional"
                                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                value={formData.secret}
                                onChange={e => setFormData({ ...formData, secret: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL de Destino</label>
                        <input
                            required placeholder="https://webhook.n8n.io/..."
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            value={formData.target_url}
                            onChange={e => setFormData({ ...formData, target_url: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Salvar Webhook</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
