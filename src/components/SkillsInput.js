import React, { useState } from 'react';

const PRESET_SKILLS = [
  'React', 'React Native', 'Node.js', 'Python', 'AWS', 'Product Management',
  'UX Design', 'Data Science', 'TypeScript', 'Kotlin', 'Java', 'Machine Learning',
  'DevOps', 'Flutter', 'Go', 'Rust', 'SQL', 'MongoDB', 'Angular', 'Vue.js',
  'Docker', 'Kubernetes', 'GraphQL', 'Swift', 'C++', 'C#', '.NET', 'PHP',
  'Ruby', 'Redis', 'PostgreSQL', 'MySQL', 'Firebase', 'Azure', 'GCP',
];

/**
 * SkillsInput
 * Props:
 *   value    — string[] of currently selected skills
 *   onChange — called with updated string[]
 */
export default function SkillsInput({ value = [], onChange }) {
  const [input, setInput]       = useState('');
  const [showAll, setShowAll]   = useState(false);

  const selected = value;

  const toggle = (skill) => {
    if (selected.includes(skill)) {
      onChange(selected.filter((s) => s !== skill));
    } else {
      onChange([...selected, skill]);
    }
  };

  const addCustom = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (selected.includes(trimmed)) { setInput(''); return; }
    onChange([...selected, trimmed]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addCustom(); }
    if (e.key === ',')     { e.preventDefault(); addCustom(); }
  };

  const remove = (skill) => onChange(selected.filter((s) => s !== skill));

  // Filter preset chips to match input search
  const filtered = input.trim()
    ? PRESET_SKILLS.filter((s) => s.toLowerCase().includes(input.toLowerCase()))
    : showAll ? PRESET_SKILLS : PRESET_SKILLS.slice(0, 18);

  const inputIsNew = input.trim() && !PRESET_SKILLS.some(
    (s) => s.toLowerCase() === input.trim().toLowerCase()
  ) && !selected.includes(input.trim());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* Text input to type/search */}
      <div style={{ position: 'relative' }}>
        <input
          className="input"
          placeholder="Type a skill and press Enter, or select below…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ paddingRight: input.trim() ? 90 : 14 }}
        />
        {input.trim() && (
          <button
            type="button"
            onClick={addCustom}
            style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 6,
              padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}
          >
            {inputIsNew ? '+ Add' : '+ Select'}
          </button>
        )}
      </div>

      {/* Selected skills (custom + preset) */}
      {selected.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {selected.map((s) => (
            <span
              key={s}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: '#eef2ff', color: '#4f46e5',
                border: '1.5px solid #4f46e5',
                padding: '4px 10px', borderRadius: 20,
                fontSize: 13, fontWeight: 700,
              }}
            >
              ✓ {s}
              <button
                type="button"
                onClick={() => remove(s)}
                style={{
                  background: 'none', border: 'none', color: '#6366f1',
                  cursor: 'pointer', fontSize: 14, lineHeight: 1,
                  padding: '0 0 0 2px', fontWeight: 900,
                }}
                title={`Remove ${s}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: 0.3 }}>
        QUICK SELECT
      </div>

      {/* Preset chips */}
      <div className="chips-wrap">
        {filtered.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => toggle(s)}
            className={`chip-btn ${selected.includes(s) ? 'selected' : 'unselected'}`}
          >
            {selected.includes(s) ? '✓ ' : ''}{s}
          </button>
        ))}

        {/* Show more / less toggle (only when not filtering) */}
        {!input.trim() && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            style={{
              padding: '5px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700,
              border: '1.5px dashed #c7d2fe', background: 'transparent',
              color: '#4f46e5', cursor: 'pointer',
            }}
          >
            {showAll ? '▲ Show less' : `+${PRESET_SKILLS.length - 18} more`}
          </button>
        )}
      </div>
    </div>
  );
}
