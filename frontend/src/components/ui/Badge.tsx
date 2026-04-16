import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: { background: 'var(--glass-bg)', color: 'var(--text-muted)' },
        success: { background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.2)' },
        warning: { background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.2)' },
        error: { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' },
        info: { background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.2)' },
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${className}`}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                ...variants[variant]
            }}
        >
            {children}
        </span>
    );
};
