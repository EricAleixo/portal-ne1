interface FormInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}

export const FormInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  type = "text" 
}: FormInputProps) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
      />
    </div>
  );
};