import { useRef } from "react";
import { FiSearch, FiCamera } from "react-icons/fi";

interface Props {
  query: string;
  setQuery: (value: string) => void;
  onSearch: () => void;
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

const SearchBar = ({ query, setQuery, onSearch, onImageUpload, isLoading }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto 48px' }}>
      {/* Search Container */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '6px',
          borderRadius: '18px',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1.5px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04)',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Search Icon */}
        <div style={{ paddingLeft: '16px', color: '#64748b', display: 'flex' }}>
          <FiSearch style={{ width: 20, height: 20 }} />
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="Search any product to compare prices..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          style={{
            flex: 1,
            padding: '14px 8px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#e2e8f0',
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        />

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '6px' }}>
          {/* File Upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Search by image"
            style={{
              padding: '10px',
              borderRadius: '12px',
              border: 'none',
              background: 'transparent',
              color: '#64748b',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(99,102,241,0.12)';
              e.currentTarget.style.color = '#a78bfa';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            <FiCamera style={{ width: 18, height: 18 }} />
          </button>

          {/* Compare Button */}
          <button
            onClick={onSearch}
            disabled={isLoading}
            style={{
              padding: '12px 28px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 800,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: "'Inter', system-ui, sans-serif",
              background: isLoading
                ? 'rgba(255,255,255,0.06)'
                : 'linear-gradient(135deg, #6366f1, #7c3aed)',
              color: isLoading ? '#64748b' : '#fff',
              boxShadow: isLoading
                ? 'none'
                : '0 4px 20px rgba(99,102,241,0.3)',
            }}
            onMouseEnter={e => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'scale(1.04)';
                e.currentTarget.style.boxShadow = '0 6px 28px rgba(99,102,241,0.4)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = isLoading ? 'none' : '0 4px 20px rgba(99,102,241,0.3)';
            }}
          >
            {isLoading ? "Scanning..." : "Compare"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;