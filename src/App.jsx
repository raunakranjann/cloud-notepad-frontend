import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register'; 
import Editor from './components/Editor';
import AdminDashboard from './components/AdminDashboard'; // <-- Added the Admin import

// This wrapper protects routes. If there is no JWT, it kicks the user to the login screen.
function RequireAuth({ children }) {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" />;
    return children;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes (Require a valid JWT) */}
                <Route path="/" element={
                    <RequireAuth>
                        <Editor />
                    </RequireAuth>
                } />
                
                <Route path="/admin" element={
                    <RequireAuth>
                        <AdminDashboard/>
                    </RequireAuth>
                } />
            </Routes>
        </BrowserRouter>
    );
}