import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, UserX, UserCheck, Search } from 'lucide-react';
import api from '../../api/client';
import { Button } from '../../components/Button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'USER' });

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleStatus = async (user) => {
        try {
            await api.patch(`/admin/users/${user.id}/status`, { is_active: !user.is_active });
            fetchUsers();
        } catch (error) {
            alert('Erro ao alterar status do usuário');
        }
    };

    const changeRole = async (user, newRole) => {
        try {
            await api.patch(`/admin/users/${user.id}/role`, { role: newRole });
            fetchUsers();
        } catch (error) {
            alert('Erro ao alterar cargo do usuário');
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/users', newUser);
            setShowCreateModal(false);
            setNewUser({ name: '', email: '', password: '', role: 'USER' });
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.detail || 'Erro ao criar usuário');
        }
    };

    const filteredUsers = users.filter(u =>
        (u.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-gray-500">Carregando usuários...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou e-mail..."
                        className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                    <UserPlus size={18} />
                    Novo Usuário
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Usuário</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Permissão</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Criado em</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-900/40 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                                            {user.name ? user.name.substring(0, 2) : user.email.substring(0, 2)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name || 'Sem nome'}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${user.role === 'ADMIN'
                                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}>
                                        <Shield size={12} />
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-bold ${user.is_active ? 'text-green-600' : 'text-red-500'}`}>
                                        {user.is_active ? 'Ativo' : 'Inativo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                                    {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => changeRole(user, user.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                                            title="Alterar Permissão"
                                            className="p-1.5 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg text-gray-500 transition-colors"
                                        >
                                            <Shield size={16} />
                                        </button>
                                        <button
                                            onClick={() => toggleStatus(user)}
                                            title={user.is_active ? "Desativar" : "Ativar"}
                                            className={`p-1.5 rounded-lg transition-colors ${user.is_active
                                                    ? 'hover:bg-red-100 text-red-500 dark:hover:bg-red-900/20'
                                                    : 'hover:bg-green-100 text-green-600 dark:hover:bg-green-900/20'
                                                }`}
                                        >
                                            <Shield size={16} /> {/* Generic icon for status toggle */}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Cadastrar Novo Usuário</h2>
                        </div>
                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nome</label>
                                <input
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                    value={newUser.name}
                                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">E-mail</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Senha Temporária</label>
                                <input
                                    required
                                    type="password"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cargo</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                    value={newUser.role}
                                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="USER">Operador (USER)</option>
                                    <option value="ADMIN">Administrador (ADMIN)</option>
                                </select>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">Cancelar</Button>
                                <Button type="submit" className="flex-1">Criar Conta</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
