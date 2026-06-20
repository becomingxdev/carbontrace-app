import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  helperText?: string;
  helperId?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  helperText,
  helperId,
  className = '',
  ...props
}) => {
  const describedById = helperId ?? (helperText ? `${id}-help` : undefined);
  const inputClasses =
    'mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500';

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-200">
        {label}
      </label>
      <input
        id={id}
        className={`${inputClasses} ${className}`.trim()}
        placeholder="0"
        aria-describedby={describedById}
        {...props}
      />
      {helperText && (
        <p id={describedById} className="mt-1 text-xs text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  );
};
