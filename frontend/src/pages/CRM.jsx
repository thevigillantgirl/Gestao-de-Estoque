import React, { useState } from 'react';
import {
    Search, Plus, Filter, MoreHorizontal,
    Mail, Phone, Building2, Calendar,
    ChevronRight, ArrowRight, UserPlus
} from 'lucide-react';

const Column = ({ title, count, color, leads }) => (
    <div className="bg-white/50 rounded-[10px] p-4 flex flex-col space-y-4 min-w-[320px] border border-gray-100/50 shadow-sm">
        <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex items-center space-x-2">
                <div className={`w-1.5 h-1.5 rounded-full ${color === 'indigo' ? 'bg-[#4F46E5]' : `bg-${color}-500`}`}></div>
                <h3 className="font-bold text-[#111827] uppercase tracking-wider text-[10px]">{title}</h3>
                <span className="bg-white px-2 py-0.5 rounded-md text-[10px] font-bold text-gray-400 border border-gray-100">{count}</span>
            </div>
            <button className="p-1.5 hover:bg-white rounded-[8px] transition-colors text-gray-400">
                <Plus className="w-4 h-4" />
            </button>
        </div>

        <div className="space-y-4">
            {leads.map((lead, i) => (
                <div key={i} className="bg-white p-5 rounded-[10px] border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-grab active:cursor-grabbing group">
                    <div className="flex items-start justify-between mb-4">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${lead.tag === 'Website' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'} uppercase tracking-tight`}>
                            {lead.tag}
                        </span>
                        <MoreHorizontal className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                    </div>
                    <h4 className="font-bold text-[#111827] group-hover:text-[#4F46E5] transition-colors text-sm">{lead.name}</h4>
                    <div className="mt-4 space-y-2.5">
                        <div className="flex items-center text-xs text-gray-500 font-medium">
                            <Building2 className="w-3.5 h-3.5 mr-2 text-gray-300" />
                            {lead.company}
                        </div>
                        <div className="flex items-center text-xs text-gray-400 font-medium">
                            <Calendar className="w-3.5 h-3.5 mr-2 text-gray-300" />
                            {lead.date}
                        </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex -space-x-2">
                            <div className="w-7 h-7 rounded-full bg-indigo-600 border-2 border-white text-[9px] flex items-center justify-center text-white font-bold">JD</div>
                        </div>
                        <div className="flex items-center space-x-1">
                            <button className="p-2 text-gray-300 hover:text-[#4F46E5] hover:bg-indigo-50 rounded-[8px] transition-all">
                                <Mail className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-300 hover:text-green-500 hover:bg-green-50 rounded-[8px] transition-all">
                                <Phone className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const CRM = () => {
    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#111827] tracking-tight">Vendas & CRM</h1>
                    <p className="text-gray-400 font-medium text-sm mt-1 uppercase tracking-widest text-[10px]">Pipeline de Gestão ATLAS</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative group hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#4F46E5]" />
                        <input
                            type="text"
                            placeholder="Buscar no pipeline..."
                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-[10px] outline-none focus:border-[#4F46E5] text-sm transition-all shadow-sm w-64"
                        />
                    </div>
                    <button className="flex items-center space-x-2 px-5 py-2.5 bg-[#4F46E5] text-white rounded-[10px] hover:bg-[#4338CA] font-bold text-sm transition-all shadow-lg shadow-indigo-100 active:scale-95">
                        <UserPlus className="w-4 h-4" />
                        <span>Novo Lead</span>
                    </button>
                </div>
            </div>

            <div className="flex space-x-6 overflow-x-auto pb-8 -mx-8 px-8 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                <Column
                    title="Propulsão (Leads)"
                    count="8"
                    color="blue"
                    leads={[
                        { name: 'Bernardo Ramos', company: 'LogiTech BR', date: 'Há 2 dias', tag: 'Website' },
                        { name: 'Carla Mendes', company: 'Global Agri', date: 'Há 5 dias', tag: 'Outbound' },
                    ]}
                />
                <Column
                    title="Qualificação"
                    count="4"
                    color="indigo"
                    leads={[
                        { name: 'Ricardo Dias', company: 'Dias Consultoria', date: 'Há 1 sem', tag: 'Website' },
                    ]}
                />
                <Column
                    title="Apresentação"
                    count="2"
                    color="orange"
                    leads={[
                        { name: 'Sandra Pires', company: 'Pires Advogados', date: 'Ontem', tag: 'Evento' },
                    ]}
                />
                <Column
                    title="Negociação Final"
                    count="3"
                    color="red"
                    leads={[
                        { name: 'Daniel Neves', company: 'Neves Software', date: 'Hoje', tag: 'Website' },
                    ]}
                />
                <Column
                    title="Atlas Won (Sucesso)"
                    count="145"
                    color="green"
                    leads={[
                        { name: 'Fabio Junior', company: 'FJ Participações', date: 'Há 2 sem', tag: 'Indicação' },
                    ]}
                />
            </div>
        </div>
    );
};

export default CRM;
