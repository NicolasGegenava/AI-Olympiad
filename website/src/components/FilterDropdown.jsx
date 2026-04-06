import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import './FilterDropdown.css';

/**
 * FilterDropdown
 * Props:
 *   label   – e.g. "Year"
 *   options – array of strings, first element should be "All"
 *   value   – currently selected option
 *   onChange – (option) => void
 */
const FilterDropdown = ({ label, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = value && value !== 'All';

  return (
    <div className={`fd-root ${open ? 'fd-root--open' : ''}`} ref={ref}>
      <button
        className={`fd-trigger ${isActive ? 'fd-trigger--active' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="fd-trigger__label">{label}</span>
        {isActive && (
          <span className="fd-trigger__badge">{value}</span>
        )}
        <ChevronDown size={14} className={`fd-trigger__chevron ${open ? 'fd-trigger__chevron--up' : ''}`} />
      </button>

      {open && (
        <div className="fd-menu" role="listbox">
          <div className="fd-menu__inner">
            {options.map((opt) => {
              const selected = opt === value;
              return (
                <button
                  key={opt}
                  className={`fd-option ${selected ? 'fd-option--selected' : ''}`}
                  role="option"
                  aria-selected={selected}
                  onClick={() => { onChange(opt); setOpen(false); }}
                >
                  <span className="fd-option__check">
                    {selected && <Check size={13} />}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
