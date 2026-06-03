import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            // Hit the Spring Boot register endpoint we built in Phase 1
            await api.post('/users/register', {
                username,
                password
            });
            
            setSuccess(true);
            
            // Wait 2 seconds, then redirect to login screen
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        } catch (err) {
            setError('Registration failed. That username might already be taken.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', fontFamily: 'sans-serif', padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Create an Account</h2>
            
            {error && <p style={{ color: 'red', textAlign: 'center', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px' }}>{error}</p>}
            {success && <p style={{ color: 'green', textAlign: 'center', backgroundColor: '#e8f5e9', padding: '10px', borderRadius: '4px' }}>Account created successfully! Redirecting...</p>}
            
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <input 
                    type="text" 
                    placeholder="Choose a Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ padding: '12px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <input 
                    type="password" 
                    placeholder="Choose a Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: '12px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <button type="submit" disabled={success} style={{ padding: '12px', backgroundColor: '#28a745', color: 'white', fontSize: '16px', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: success ? 'not-allowed' : 'pointer' }}>
                    Sign Up
                </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p style={{ color: '#666' }}>Already have an account? <Link to="/login" style={{ color: '#0056b3', textDecoration: 'none', fontWeight: 'bold' }}>Login here</Link></p>
            </div>
        </div>
    );
}