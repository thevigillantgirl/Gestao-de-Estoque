import React, { useState, useEffect } from 'react';
import { Check, X, Mail, Building, Clock } from 'lucide-react';
import api from '../../api/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AccessRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('PENDING');

    const fetchRequests = async () => {
        try {
            const response = await api.get(`/admin/access-requests?status=${filter}`);
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const handleReview = async (id, status) => {
        try {
            await api.patch(`/admin/access-requests/${id}`, { status });
            fetchRequests();
        } catch (error) {
            alert('Erro ao processar solicitação');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Carregando solicitações...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                    {['PENDING', 'APPROVED', 'REJECTED'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === s
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700'
                                }`}
                        >
                            {s === 'PENDING' ? 'Pendentes' : s === 'APPROVED' ? 'Aprovadas' : 'Rejeitadas'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.length === 0 && !loading && (
                    <div className="col-span-full py-12 text-center text-gray-500 font-medium bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                        Nenhuma solicitação encontrada com este status.
                    </div>
                )}

                {requests.map((req) => (
                    <div key={req.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col hover:border-blue-300 dark:hover:border-blue-900 transition-all group">
                        <div className="p-6 space-y-4 flex-1">
                            <div className="flex items-start justify-between">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center font-bold text-lg uppercase">
                                    {req.name.substring(0, 1)}
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                    <Clock size={12} />
                                    {format(new Date(req.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors uppercase">{req.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                                    <Mail size={14} />
                                    {req.email}
                                </div>
                                {req.company && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                                        <Building size={14} />
                                        {req.company}
                                    </div>
                                )}
                            </div>

                            {req.message && (
                                <div className="p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium italic leading-relaxed">
                                        "{req.message}"
                                    </p>
                                </div>
                            )}
                        </div>

                        {filter === 'PENDING' && (
                            <div className="flex border-t border-gray-100 dark:border-slate-700">
                                <button
                                    onClick={() => handleReview(req.id, 'REJECTED')}
                                    className="flex-1 py-3 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
                                >
                                    <X size={16} /> Rejeitar
                                </button>
                                <button
                                    onClick={() => handleReview(req.id, 'APPROVED')}
                                    className="flex-1 py-3 text-xs font-bold text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors border-l border-gray-100 dark:border-slate-700 flex items-center justify-center gap-2"
                                >
                                    <Check size={16} /> Aprovar
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
