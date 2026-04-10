export function InputField({ label, type = "text", value, onChange, placeholder, disabled = false, min, max }) {
  return (
    <div className="flex flex-col w-full gap-1 mb-4">
      <label className="text-sm font-medium text-gray-600 pl-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        min={min}
        max={max}
        className={`w-full px-4 py-2.5 rounded-xl border border-purple-200 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 ${disabled ? 'opacity-70 cursor-not-allowed bg-gray-50/50' : 'hover:border-purple-300'}`}
      />
    </div>
  );
}

export function ToggleGroup({ label, options, selected, onChange }) {
  return (
    <div className="flex flex-col w-full gap-1 mb-4">
      <label className="text-sm font-medium text-gray-600 pl-1">{label}</label>
      <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-xl border border-purple-100">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${selected === option ? 'bg-purple-500 text-white shadow-md' : 'text-gray-500 hover:text-purple-600 hover:bg-white/60'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function RadioGroup({ label, options, selected, onChange }) {
  return (
    <div className="flex flex-col w-full gap-1 mb-4">
      <label className="text-sm font-medium text-gray-600 pl-1">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label 
            key={option} 
            className={`flex items-center justify-center px-4 py-2 rounded-xl cursor-pointer border transition-all duration-300 flex-1 min-w-[30%] ${selected === option ? 'bg-purple-100 border-purple-400 text-purple-700' : 'bg-white/60 border-purple-100 text-gray-500 hover:border-purple-300'}`}
          >
            <input
              type="radio"
              name={label}
              value={option}
              checked={selected === option}
              onChange={() => onChange(option)}
              className="hidden"
            />
            <span className="text-sm font-medium">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
