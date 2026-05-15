import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { messageAPI, employeeAPI } from '../api';
import { MessageSquare, Send, X, User, ShieldCheck, Briefcase } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ChatDrawer() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      fetchContacts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedUser) {
      fetchConversation(selectedUser._id);
      const interval = setInterval(() => fetchConversation(selectedUser._id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  useEffect(scrollToBottom, [messages]);

  const fetchContacts = async () => {
    try {
      const { data } = await employeeAPI.getAll();
      // Hierarchical Filter: 
      // Employees can only see Admins/Managers. 
      // Admins/Managers can see everyone.
      const filtered = user.role === 'employee' 
        ? data.filter(u => u.role !== 'employee')
        : data;
      setContacts(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchConversation = async (userId) => {
    try {
      const { data } = await messageAPI.getConversation(userId);
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim() || !selectedUser) return;

    try {
      const { data } = await messageAPI.send({ recipientId: selectedUser._id, content });
      setMessages([...messages, data]);
      setContent('');
      toast.success('Message sent!', { id: 'chat-send', duration: 1000 });
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  return (
    <>
      {/* Floating Chat Toggle */}
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'var(--primary)', color: 'white', border: 'none',
          boxShadow: '0 8px 32px var(--primary-glow)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}
      >
        <MessageSquare size={28} />
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: 0, right: 0, background: 'var(--red)', width: '20px', height: '20px', borderRadius: '50%', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat Drawer Sidebar */}
      <div style={{
        position: 'fixed', top: 0, right: isOpen ? 0 : '-400px',
        width: '380px', height: '100vh', background: 'var(--bg2)',
        borderLeft: '1px solid var(--border)', zIndex: 1000,
        transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 50px rgba(0,0,0,0.5)'
      }}>
        {/* Header */}
        <div className="flex-between" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div className="flex-gap">
            <MessageSquare size={20} className="text-primary-light" />
            <span className="font-bold">Corporate Connect</span>
          </div>
          <button onClick={() => { setIsOpen(false); setSelectedUser(null); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        {!selectedUser ? (
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            <p className="text-muted text-sm mb-1" style={{ padding: '0 0.5rem 1rem' }}>
              {user.role === 'employee' ? 'Connect with Leadership & Managers' : 'Employee & Management Communications'}
            </p>
            {contacts.map(contact => (
              <div 
                key={contact._id} 
                className="leaderboard-item" 
                style={{ cursor: 'pointer', background: 'var(--card)', marginBottom: '0.5rem' }}
                onClick={() => setSelectedUser(contact)}
              >
                <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '0.8rem' }}>
                  {contact.role === 'admin' ? <ShieldCheck size={16} /> : contact.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="font-bold text-sm">{contact.name}</div>
                  <div className="text-muted text-xs">{contact.role} • {contact.department}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Back to list */}
            <div className="flex-gap" style={{ padding: '1rem', background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
              <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} style={{ transform: 'rotate(90deg)' }} />
              </button>
              <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.7rem' }}>{selectedUser.name.charAt(0)}</div>
              <div>
                <div className="font-bold text-sm">{selectedUser.name}</div>
                <div className="text-muted text-xs">{selectedUser.role}</div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map(msg => (
                <div 
                  key={msg._id} 
                  style={{ 
                    alignSelf: msg.sender === user._id ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    background: msg.sender === user._id ? 'var(--primary)' : 'var(--card)',
                    fontSize: '0.85rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  {msg.content}
                  <div style={{ fontSize: '0.6rem', marginTop: '0.25rem', opacity: 0.6, textAlign: 'right' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer Form */}
            <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
              <div className="form-group" style={{ marginBottom: 0, flexDirection: 'row', gap: '0.5rem' }}>
                <input 
                  placeholder="Type a message..." 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ borderRadius: '24px' }}
                />
                <button type="submit" className="btn btn-primary" style={{ borderRadius: '50%', width: '42px', height: '42px', padding: 0, justifyContent: 'center' }}>
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
