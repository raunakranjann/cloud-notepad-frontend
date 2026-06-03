import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function AdminDashboard() {
    const [allNotes, setAllNotes] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllNotes();
    }, []);

    const fetchAllNotes = async () => {
        try {
            // Hit the protected Admin-only endpoint!
            const response = await api.get('/notes/admin/all');
            setAllNotes(response.data);
        } catch (err) {
            // If a standard user tries to view this, Java throws a 403 or 500 error
            setError("Access Denied: You do not have admin privileges.");
        }
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ margin: 0, color: '#d32f2f' }}>Admin Command Center</h1>
                <button onClick={() => navigate('/')} style={{ padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Back to My Notes
                </button>
            </div>

            {error ? (
                <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '20px', borderRadius: '8px', fontWeight: 'bold' }}>
                    ⚠️ {error}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {allNotes.map(note => (
                        <div key={note.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderTop: '4px solid #d32f2f' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                                <span style={{ fontWeight: 'bold', color: '#555' }}>User ID: {note.user?.id}</span>
                                <span style={{ color: '#888', fontSize: '0.85rem' }}>{new Date(note.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 style={{ margin: '0 0 10px 0' }}>{note.title}</h3>
                            <p style={{ color: '#444', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{note.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}