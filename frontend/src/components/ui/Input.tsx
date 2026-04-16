import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className={`input-container ${className}`}>
            {label && <label className="label">{label}</label>}
            <input
                className={`input ${error ? 'border-red-500' : ''}`}
                style={error ? { borderColor: '#ef4444' } : {}}
                {...props}
            />
            {error && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{error}</span>}
        </div>
    );
};
