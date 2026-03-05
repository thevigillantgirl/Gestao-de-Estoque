import React, { useState } from 'react';
import { Send, User, Mail, Building, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Button } from '../components/Button';

export default function RequestAccess() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post('/access-requests/', formData);
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.detail || 'Erro ao enviar solicitação. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Send size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Solicitação Enviada!</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
                        Sua solicitação foi registrada com sucesso. Aguarde o contato do administrador através do e-mail informado.
                    </p>
                    <Link to="/login">
                        <Button className="w-full">Voltar para Login</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-8">
                <div className="mb-8">
                    <Link to="/login" className="text-blue-600 text-sm font-bold flex items-center gap-1 mb-4 hover:underline">
                        <ArrowLeft size={16} />
                        Voltar ao login
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Solicitar Acesso</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Preencha o formulário para que o administrador crie sua conta.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <User size={16} className="text-gray-400" />
                            Nome Completo
                        </label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                            placeholder="Seu nome"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Mail size={16} className="text-gray-400" />
                            E-mail Corporativo
                        </label>
                        <input
                            required
                            type="email"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Building size={16} className="text-gray-400" />
                            Empresa (Opcional)
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                            placeholder="Nome da empresa"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <FileText size={16} className="text-gray-400" />
                            Motivo / Observação
                        </label>
                        <textarea
                            rows="3"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none"
                            placeholder="Descreva brevemente sua função..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        ></textarea>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 text-xs font-bold rounded-lg border border-red-100 dark:border-red-900/30">
                            {error}
                        </div>
                    )}

                    <Button type="submit" loading={loading} className="w-full mt-4">
                        Enviar Solicitação
                    </Button>
                </form>
            </div>
        </div>
    );
}
