import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f1f3f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          maxWidth: '600px',
          width: '100%',
          padding: '48px 32px',
          textAlign: 'center',
        }}
      >
        {/* Flipkart-style top bar accent */}
        <div
          style={{
            width: '64px',
            height: '4px',
            background: 'linear-gradient(90deg, #2874f0, #fb641b)',
            borderRadius: '2px',
            margin: '0 auto 32px',
          }}
        />

        {/* 404 Illustration */}
        <div style={{ marginBottom: '24px' }}>
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ margin: '0 auto', display: 'block' }}
          >
            <circle cx="60" cy="60" r="58" stroke="#e0e7ff" strokeWidth="4" fill="#f5f8ff" />
            <text
              x="50%"
              y="52%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize="36"
              fontWeight="bold"
              fill="#2874f0"
              fontFamily="Roboto, sans-serif"
            >
              404
            </text>
            <text
              x="50%"
              y="72%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize="12"
              fill="#878787"
              fontFamily="Roboto, sans-serif"
            >
              Page Not Found
            </text>
          </svg>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#212121',
            margin: '0 0 12px',
          }}
        >
          Page Not Found
        </h1>

        {/* Subtext */}
        <p style={{ color: '#878787', fontSize: '15px', margin: '0 0 8px', lineHeight: '1.6' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Show the bad URL */}
        {location.pathname && location.pathname !== '/' && (
          <p
            style={{
              color: '#fb641b',
              fontSize: '13px',
              fontFamily: 'monospace',
              background: '#fff5f0',
              padding: '6px 12px',
              borderRadius: '4px',
              display: 'inline-block',
              margin: '0 0 28px',
              border: '1px solid #ffe0cc',
              wordBreak: 'break-all',
            }}
          >
            {location.pathname}
          </p>
        )}

        {/* Divider */}
        <div
          style={{
            borderTop: '1px solid #f0f0f0',
            margin: '24px 0',
          }}
        />

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '12px 28px',
              border: '1px solid #2874f0',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              color: '#2874f0',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#e8f0fe';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#ffffff';
            }}
          >
            ← Go Back
          </button>

          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 28px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#fb641b',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 6px rgba(251,100,27,0.4)',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#e55a14';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#fb641b';
            }}
          >
            🏠 Go to Home
          </button>
        </div>

        {/* Footer hint */}
        <p style={{ marginTop: '32px', color: '#c2c2c2', fontSize: '12px' }}>
          If you think this is a mistake, please check the URL and try again.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
