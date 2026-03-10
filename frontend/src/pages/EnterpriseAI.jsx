import React, { useState } from 'react';
import {
    Sparkles, Brain, Zap, MessageSquare,
    Send, Bot, LineChart, ShieldCheck,
    ArrowRight, Lightbulb
} from 'lucide-react';

const EnterpriseAI = () => {
    const [prompt, setPrompt] = useState('');

    const insights = [
        { icon: LineChart, title: 'Tendência de Vendas', desc: 'Crescimento de 15% projetado para o próximo trimestre em eletrônicos.', color: 'indigo' },
        { icon: ShieldCheck, title: 'Análise de Risco', desc: 'Exposição financeira reduzida em 8% após renegociação.', color: 'green' },
        { icon: Lightbulb, title: 'Sugestão de Estoque', desc: 'Aumentar SKU-092 (Mouse Gamer) em 20 unidades.', color: 'orange' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in slide-in-from-bottom duration-700">
            <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-tr from-[#4F46E5] to-[#6366F1] rounded-[24px] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-200 ring-4 ring-indigo-50">
                    <Sparkles className="text-white w-10 h-10" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Atlas Intelligence</h1>
                    <p className="text-gray-400 mt-2 font-medium max-w-md mx-auto">
                        A camada de inteligência de dados que potencializa suas decisões empresariais.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {insights.map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-[12px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                        <div className={`w-10 h-10 rounded-[10px] bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-indigo-50 transition-colors`}>
                            <item.icon className={`w-5 h-5 text-gray-400 group-hover:text-[#4F46E5]`} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="bg-[#1F2937] rounded-[20px] p-8 shadow-2xl relative overflow-hidden text-white border border-gray-700">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] -mr-32 -mt-32" />

                <div className="relative flex flex-col space-y-8">
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-widest text-[#FBBF24]">Analista IA Online</span>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-[#111827] p-5 rounded-[12px] border border-gray-700/50 max-w-2xl">
                            <p className="text-sm italic text-gray-300">
                                "Olá! Estou pronto para analisar seus dados. Você pode me perguntar sobre faturamento, estoque ou previsões de venda."
                            </p>
                        </div>
                    </div>

                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Como está o giro de estoque dos produtos mais vendidos?"
                            className="w-full bg-[#111827] border border-gray-700 p-5 pr-16 rounded-[15px] outline-none focus:border-[#4F46E5] transition-all text-sm placeholder:text-gray-600 text-white"
                        />
                        <button className="absolute right-4 p-3 bg-[#4F46E5] rounded-[10px] hover:bg-[#4338CA] transition-all shadow-lg active:scale-90">
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center space-x-8 text-gray-400">
                <div className="flex items-center space-x-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-tighter">Fast Analysis</span>
                </div>
                <div className="flex items-center space-x-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-tighter">Private Data</span>
                </div>
            </div>
        </div>
    );
};

export default EnterpriseAI;
