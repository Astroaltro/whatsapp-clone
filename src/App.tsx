import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Camera, 
  Search, 
  MoreVertical, 
  MessageSquarePlus, 
  CircleDashed, 
  Users2, 
  Phone 
} from 'lucide-react';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTab, setCurrentTab] = useState('chats'); // 'chats' | 'updates' | 'communities' | 'calls'
  const [chats, setChats] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });

  // Handle New Chat Button Click
  const handleNewChat = () => {
    const contactName = prompt("Enter contact name to start a chat:");
    if (contactName) {
      const newChat = {
        id: Date.now(),
        name: contactName,
        message: "Tap to start conversation",
        date: "Just now"
      };
      setChats([newChat, ...chats]);
    }
  };

  // Auth logic remains same...
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/${isRegistering ? 'register' : 'login'}`, form);
      if (!isRegistering) {
        localStorage.setItem('token', res.data.token);
        setIsLoggedIn(true);
      } else {
        alert("Registered!");
        setIsRegistering(false);
      }
    } catch (err) { alert("Server error"); }
  };

  if (!isLoggedIn) {
    return (
      <div className="wa-wrapper">
        <div className="wa-container auth-page">
          <h1 className="wa-logo">WhatsApp</h1>
          <form onSubmit={handleAuth} className="auth-form">
            <input type="text" placeholder="Username" className="wa-search-input auth-input" onChange={e => setForm({...form, username: e.target.value})} />
            <input type="password" placeholder="Password" className="wa-search-input auth-input" onChange={e => setForm({...form, password: e.target.value})} />
            <button type="submit" className="wa-fab auth-submit">{isRegistering ? 'Register' : 'Login'}</button>
            <p onClick={() => setIsRegistering(!isRegistering)} className="auth-toggle-text">
              {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="wa-wrapper">
      <div className="wa-container">
        <header className="wa-header">
          <div className="wa-header-top">
            <h1 className="wa-logo">WhatsApp</h1>
            <div className="wa-header-icons">
              <Camera size={24} />
              <MoreVertical size={24} />
            </div>
          </div>
          <div className="wa-search-container">
            <Search className="wa-search-icon" size={20} />
            <input type="text" placeholder="Ask Meta AI or Search" className="wa-search-input" />
          </div>
        </header>

        <main className="wa-chat-list">
          {currentTab === 'chats' && (
            chats.length > 0 ? (
              chats.map((chat: any) => (
                <div key={chat.id} className="wa-chat-item">
                  <div className="wa-avatar"><Users2 size={26} /></div>
                  <div className="wa-chat-info">
                    <div className="wa-chat-row">
                      <span className="wa-chat-name">{chat.name}</span>
                      <span className="wa-chat-date">{chat.date}</span>
                    </div>
                    <div className="wa-chat-msg">{chat.message}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">No chats yet. Click the + button to start.</div>
            )
          )}
          {currentTab !== 'chats' && (
            <div className="empty-state">This is the {currentTab} screen.</div>
          )}
        </main>

        <button className="wa-fab" onClick={handleNewChat}>
          <MessageSquarePlus size={24} />
        </button>

        <nav className="wa-nav">
          <NavItem active={currentTab === 'chats'} icon={<MessageSquarePlus size={22} />} label="Chats" onClick={() => setCurrentTab('chats')} />
          <NavItem active={currentTab === 'updates'} icon={<CircleDashed size={22} />} label="Updates" onClick={() => setCurrentTab('updates')} />
          <NavItem active={currentTab === 'communities'} icon={<Users2 size={22} />} label="Communities" onClick={() => setCurrentTab('communities')} />
          <NavItem active={currentTab === 'calls'} icon={<Phone size={22} />} label="Calls" onClick={() => setCurrentTab('calls')} />
        </nav>
      </div>
    </div>
  );
}

function NavItem({ active, icon, label, onClick }: any) {
  return (
    <div className={`wa-nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      <div className="nav-icon-wrapper">{icon}</div>
      <span>{label}</span>
    </div>
  );
}