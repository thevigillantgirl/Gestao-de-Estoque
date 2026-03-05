import React, { useState, useEffect } from 'react';
import { Save, Mail, Bell, Shield, Info } from 'lucide-react';
import { Button } from '../components/Button';
import api from '../api/client';
import { useAuth } from '../api/AuthContext';

export default function Settings() {
    const { user } = useAuth();
    const [settings, setSettings] = useState({
        low_stock_email_recipient: '',
        email_alerts_enabled: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/settings/');
                setSettings(response.data);
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/settings/', settings);
            alert('Configurações salvas com sucesso!');
        } catch (error) {
            alert('Erro ao salvar configurações');
        } finally {
            setSaving(false);
        }
    };

    if (user?.role !== 'ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm mt-8">
                <Shield size={48} className="text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Acesso Restrito</h2>
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                    Apenas administradores podem acessar as configurações globais do sistema.
                </p>
            </div>
        );
    }

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Carregando configurações...</div>;
    }

    return (
        <div className="max-w-4xl space-y-8">
            <section className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all">
                <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                        <Bell size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Alertas Automáticos</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Configure como o sistema deve alertar sobre estoque baixo</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-700/50">
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">Habilitar Alertas por E-mail</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">O sistema enviará e-mails automáticos quando o estoque atingir o nível mínimo.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.email_alerts_enabled}
                                onChange={e => setSettings({ ...settings, email_alerts_enabled: e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Mail size={16} className="text-gray-400" />
                            E-mail do Destinatário
                        </label>
                        <input
                            type="email"
                            placeholder="exemplo@empresa.com"
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white disabled:opacity-50 transition-all font-medium"
                            value={settings.low_stock_email_recipient}
                            onChange={e => setSettings({ ...settings, low_stock_email_recipient: e.target.value })}
                            disabled={!settings.email_alerts_enabled}
                        />
                        <p className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Info size={12} />
                            Este e-mail receberá notificações de todos os produtos com estoque baixo.
                        </p>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" disabled={saving} className="gap-2 min-w-[140px]">
                            {saving ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Save size={18} />
                            )}
                            Salvar Alterações
                        </Button>
                    </div>
                </form>
            </section>

            <section className="bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 p-6 flex items-start gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-lg shrink-0">
                    <Info size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">Dica de Configuração</h3>
                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                        Certifique-se de que o e-mail cadastrado seja monitorado frequentemente. Os alertas são disparados uma vez por dia ou imediatamente após movimentações que deixem o estoque abaixo do limite configurado no cadastro do produto.
                    </p>
                </div>
            </section>
        </div>
    );
}
