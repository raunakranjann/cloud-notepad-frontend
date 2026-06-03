import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Editor() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    
    // NEW STATE: Tracks if we are editing an existing note
    const [editingNoteId, setEditingNoteId] = useState(null); 
    const navigate = useNavigate();


    // Decode the JWT to check the user's role without asking the backend!
const checkIsAdmin = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role === 'ADMIN';
    } catch (e) {
        return false;
    }
};

const isAdmin = checkIsAdmin();



    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await api.get('/notes');
            setNotes(response.data);
        } catch (error) {
            if (error.response && (error.response.status === 403 || error.response.status === 401)) {
                handleLogout();
            }
        }
    };

    const handleSave = async () => {
        if (!title.trim() && !content.trim()) return; 
        
        try {
            if (editingNoteId) {
                // EDIT EXISTING NOTE (PUT)
                const response = await api.put(`/notes/${editingNoteId}`, { title, content });
                // Update the note in the sidebar array
                setNotes(notes.map(note => note.id === editingNoteId ? response.data : note));
            } else {
                // CREATE NEW NOTE (POST)
                const response = await api.post('/notes', { title, content });
                setNotes([...notes, response.data]);
            }
            
            // Clear the editor after saving
            resetEditor();
        } catch (error) {
            console.error("Failed to save note", error);
        }
    };

    // NEW FUNCTION: Populate the editor when a user clicks "Edit"
    const handleEditClick = (note) => {
        setTitle(note.title);
        setContent(note.content);
        setEditingNoteId(note.id);
    };

    // NEW FUNCTION: Delete a note
    const handleDelete = async (noteId) => {
        // Simple confirmation dialog
        if (!window.confirm("Are you sure you want to delete this note?")) return;

        try {
            await api.delete(`/notes/${noteId}`);
            // Remove the deleted note from the sidebar instantly
            setNotes(notes.filter(note => note.id !== noteId));
            
            // If they delete the note they are currently editing, clear the editor
            if (editingNoteId === noteId) {
                resetEditor();
            }
        } catch (error) {
            console.error("Failed to delete note", error);
        }
    };

    // Helper function to clear the text area
    const resetEditor = () => {
        setTitle('');
        setContent('');
        setEditingNoteId(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#fff' }}>
            
            {/* LEFT SIDEBAR */}
            <div style={{ width: '300px', borderRight: '1px solid #e0e0e0', padding: '20px', backgroundColor: '#f8f9fa', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>My CloudPad</h2>
                    <button onClick={handleLogout} style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.8rem' }}>
                        Logout
                    </button>
                </div>
                
                {isAdmin && (
                 <button onClick={() => navigate('/admin')} style={{ width: '100%', padding: '10px', marginBottom: '15px', backgroundColor: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                     🛡️ Open Admin Dashboard
                 </button>
             )}


                {/* "New Note" Button to clear the editor */}
                <button onClick={resetEditor} style={{ width: '100%', padding: '10px', marginBottom: '15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    + Create New Note
                </button>

                {notes.length === 0 ? <p style={{ color: '#888', fontSize: '0.9rem' }}>No notes yet.</p> : null}
                
                {notes.map(note => (
                    <div key={note.id} style={{ padding: '15px', backgroundColor: 'white', border: '1px solid #e0e0e0', marginBottom: '10px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <h4 style={{ margin: '0 0 5px 0', color: '#111' }}>{note.title || 'Untitled'}</h4>
                        <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {note.content}
                        </p>
                        
                        {/* NEW EDIT AND DELETE BUTTONS */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button onClick={() => handleEditClick(note)} style={{ padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ccc', borderRadius: '4px' }}>
                                Edit
                            </button>
                            <button onClick={() => handleDelete(note.id)} style={{ padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', borderRadius: '4px' }}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* RIGHT MAIN AREA */}
            <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column' }}>
                <input
                    type="text"
                    placeholder="Note Title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ fontSize: '28px', fontWeight: 'bold', padding: '10px 0', border: 'none', borderBottom: '2px solid #eee', marginBottom: '20px', outline: 'none', color: '#222' }}
                />
                <textarea
                    placeholder="Start writing your secure note here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{ flex: 1, padding: '10px 0', fontSize: '16px', lineHeight: '1.6', border: 'none', outline: 'none', resize: 'none', color: '#444' }}
                />
                
                {/* Dynamically change button text based on state */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                    {editingNoteId && (
                        <button onClick={resetEditor} style={{ padding: '12px 24px', backgroundColor: '#e0e0e0', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                            Cancel Edit
                        </button>
                    )}
                    <button onClick={handleSave} style={{ padding: '12px 24px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                        {editingNoteId ? 'Update Note' : 'Save to Database'}
                    </button>
                </div>
            </div>
            
        </div>
    );
}