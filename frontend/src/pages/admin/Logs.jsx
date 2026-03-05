import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import api from '../../api/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Logs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eventFilter, setEventFilter] = useState('');

    const fetchLogs = async () => {
        try {
            const response = await api.get('/admin/logs' + (eventFilter ? `?event_type=${eventFilter}` : ''));
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [eventFilter]);

    const getEventColor = (event) => {
        if (event.includes('FAILED') || event.includes('DISABLED') || event.includes('REJECTED')) return 'text-red-600 bg-red-50 dark:bg-red-900/20';
        if (event.includes('SUCCESS') || event.includes('CREATED') || event.includes('APPROVED')) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Carregando logs...</div>;

    return (
        <div className="space-y-6">
            <div className="flex bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm items-center gap-4">
                <Filter size={18} className="text-gray-400" />
                <select
                    className="bg-transparent text-sm font-bold text-gray-700 dark:text-gray-300 outline-none"
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                >
                    <option value="">Todos os Eventos</option>
                    <option value="LOGIN_SUCCESS">Login Sucesso</option>
                    <option value="LOGIN_FAILED">Login Falha</option>
                    <option value="ACCESS_REQUEST_CREATED">Nova Solicitação</option>
                    <option value="USER_CREATED">Usuário Criado</option>
                    <option value="LOGOUT">Logout</option>
                </select>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Data/Hora</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Usuário</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Evento</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">IP / Agente</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Detalhes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-slate-900/40 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                                        {format(new Date(log.timestamp), 'dd/MM/yyyy', { locale: ptBR })}
                                    </p>
                                    <p className="text-[10px] text-gray-500 font-medium tracking-tight">
                                        {format(new Date(log.timestamp), 'HH:mm:ss')}
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                                        {log.user ? log.user.name || log.user.email : 'SISTEMA'}
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getEventColor(log.event_type)}`}>
                                        {log.event_type}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{log.ip_address}</p>
                                    <p className="text-[10px] text-gray-400 font-medium truncate max-w-[120px]" title={log.user_agent}>
                                        {log.user_agent ? log.user_agent.split(') ')[0] : 'N/A'}
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-tight max-w-xs">
                                        {log.details || '-'}
                                    </p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
