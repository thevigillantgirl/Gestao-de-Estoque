import React from 'react';

export function StatusBadge({ status }) {
    const styles = {
        DRAFT: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
        SENT: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        RECEIVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        INACTIVE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        FAILED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };

    const labels = {
        DRAFT: 'Rascunho',
        SENT: 'Enviado',
        RECEIVED: 'Recebido',
        CANCELLED: 'Cancelado',
        ACTIVE: 'Ativo',
        INACTIVE: 'Inativo',
        PENDING: 'Pendente',
        FAILED: 'Falhou',
    };

    const key = status?.toUpperCase() || 'DRAFT';

    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${styles[key] || styles.DRAFT}`}>
            {labels[key] || status}
        </span>
    );
}
