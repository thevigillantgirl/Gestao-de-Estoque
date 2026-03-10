import React from 'react';

export function DataTable({ columns, data, isLoading, emptyMessage = "Nenhum registro encontrado." }) {
    if (isLoading) {
        return (
            <div className="w-full h-48 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-100 bg-[#F8FAFC]">
                        {columns.map((col, idx) => (
                            <th key={idx} className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {data.length > 0 ? (
                        data.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-gray-50/50 transition-colors group">
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
