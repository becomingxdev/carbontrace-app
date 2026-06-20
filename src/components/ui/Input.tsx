import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

/**
 * Reusable numeric-safe form input with consistent styling and accessibility wiring.
 *
 * Encapsulates the repeated `<label>` + `<input>` block found across all five
 * calculator step components. The appearance is pixel-identical to the
 * original inline markup.
 */
export const Input: React.FC<InputProps> = ({ label, id, className = '', ...props }) => {
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
        {...props}
      />
    </div>
  );
};
