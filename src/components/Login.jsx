import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Hit the Spring Boot login endpoint
            const response = await api.post('/users/login', {
                username,
                password
            });
            
            // Save the JWT to the browser's local storage
            localStorage.setItem('token', response.data);
            
            // Redirect to the Notepad Dashboard
            navigate('/');
            
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', fontFamily: 'sans-serif' }}>
            <h2>Login to CloudPad</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ padding: '10px', fontSize: '16px' }}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: '10px', fontSize: '16px' }}
                />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#0056b3', color: 'white', fontSize: '16px', border: 'none', cursor: 'pointer' }}>
                    Login
                </button>
            </form>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p style={{ color: '#666' }}>Don't have an account? <Link to="/register" style={{ color: '#0056b3', textDecoration: 'none', fontWeight: 'bold' }}>Sign up here</Link></p>
            </div>
        </div>
    );
}