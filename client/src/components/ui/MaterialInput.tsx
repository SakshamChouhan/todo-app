import React, { forwardRef } from "react";

interface MaterialInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const MaterialInput = forwardRef<HTMLInputElement, MaterialInputProps>(
  ({ label, error, id, ...props }, ref) => {
    return (
      <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-1">
          {label}
        </label>
        <div className="relative">
          <input
            id={id}
            className={`w-full px-3 py-2 border ${error ? 'border-error-main' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light`}
            ref={ref}
            {...props}
          />
          {error && (
            <p className="text-error-main text-xs mt-1">{error}</p>
          )}
        </div>
      </div>
    );
  }
);

MaterialInput.displayName = "MaterialInput";

export default MaterialInput;
