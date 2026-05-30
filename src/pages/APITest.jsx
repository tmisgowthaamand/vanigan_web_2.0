import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || 'https://vanigan-app-automation-5il0.onrender.com';

const APITest = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [endpoint, setEndpoint] = useState(BASE + '/');

    const testAPI = async (url) => {
        setLoading(true);
        setError(null);
        setData(null);
        try {
            const res = await axios.get(url);
            setData(res.data);
            setEndpoint(url);
        } catch (err) {
            setError(err.message + (err.response ? `: ${JSON.stringify(err.response.data)}` : ''));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        testAPI(BASE + '/');
    }, []);

    return (
        <div style={{ padding: '120px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>API Connection Test</h2>
            <p>Testing: <strong>{endpoint}</strong></p>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>The <code>/public/</code> endpoints work without authentication.</p>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => testAPI(BASE + '/')}>Test Root</button>
                <button className="btn btn-outline" onClick={() => testAPI(BASE + '/public/register')}>Test /public/register</button>
                <button className="btn btn-outline" onClick={() => testAPI(BASE + '/api/businesses')}>Test /api/businesses (401)</button>
            </div>

            {loading && <p>Connecting to backend...</p>}

            {error && (
                <div style={{ padding: '15px', background: '#FEF2F2', border: '1px solid #EF4444', borderRadius: '8px', color: '#EF4444', marginBottom: '20px' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {data && (
                <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <h4 style={{ marginBottom: '10px', color: '#16A34A' }}>✅ Response Data:</h4>
                    <pre style={{ overflowX: 'auto', whiteSpace: 'pre-wrap', fontSize: '0.85rem', lineHeight: '1.5' }}>
                        {typeof data === 'string' ? data.substring(0, 2000) + '...' : JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default APITest;
