import React, { useState, useEffect } from 'react';
import {
  getMessagesByPatientId,
  sendMessage,
  updateUserProfile,
  uploadProfilePicture,
  getUserById,
  addLogEntry
} from '../utils/database';

const PatientDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    loadData();
    // Add login log entry
    addLogEntry('patient', user.name, 'Patient logged in', 'Accessed patient dashboard');
  }, [user.id, user.name]);

  const loadData = () => {
    setMessages(getMessagesByPatientId(user.id));
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
  };

  const handleLogout = () => {
    addLogEntry('patient', user.name, 'Patient logged out', 'Logged out from patient dashboard');
    onLogout();
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      showAlert('error', 'Please enter a message');
      return;
    }

    setLoading(true);
    try {
      sendMessage(user.id, user.name, 1, 'Dr. Sarah Johnson', 'patient', messageText);
      setMessageText('');
      showAlert('success', 'Message sent to doctor successfully!');
      loadData();
    } catch (error) {
      showAlert('error', 'Error sending message: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Profile management
  const openProfileModal = () => {
    setProfileData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      age: user.age || '',
      gender: user.gender || '',
      address: user.address || '',
      emergencyContact: user.emergencyContact || ''
    });
    setShowProfileModal(true);
  };

  const handleProfileUpdate = () => {
    setLoading(true);
    try {
      const updatedUser = updateUserProfile(user.id, 'patient', profileData);
      if (updatedUser) {
        // Update current user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        showAlert('success', 'Profile updated successfully!');
        setShowProfileModal(false);
        // Refresh the page to update user data
        window.location.reload();
      }
    } catch (error) {
      showAlert('error', 'Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        uploadProfilePicture(user.id, 'patient', imageData);
        showAlert('success', 'Profile picture updated successfully!');
        // Update current user in localStorage
        const updatedUser = getUserById(user.id, 'patient');
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        window.location.reload();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const renderDashboard = () => (
    <div className="content-section">
      <h2 className="section-title">🏠 Welcome, {user.name}!</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{messages.length}</div>
          <div className="stat-label">Messages</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{user.age}</div>
          <div className="stat-label">Age</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {/* Patient Info Card */}
        <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px', borderLeft: '4px solid #4CAF50' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ color: '#2c3e50', margin: 0 }}>👤 My Information</h3>
            <button 
              className="btn-secondary" 
              onClick={openProfileModal}
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              ✏️ Edit Profile
            </button>
          </div>
          <div style={{ lineHeight: '1.8' }}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>Address:</strong> {user.address || 'Not provided'}</p>
            <p><strong>Emergency Contact:</strong> {user.emergencyContact || 'Not provided'}</p>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px', borderLeft: '4px solid #007bff' }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>⚡ Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              className="btn-primary"
              onClick={() => setActiveTab('messages')}
              style={{ padding: '12px', fontSize: '14px' }}
            >
              💬 Send Message to Doctor
            </button>
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="communication-section">
        <h3 className="section-title">💬 Recent Messages</h3>
        <div className="message-thread">
          {messages.slice(0, 3).map(message => (
            <div key={message.id} className={`message-item ${message.sender}`}>
              <div className="message-header">
                <span className="message-sender">
                  {message.sender === 'admin' ? message.adminName : 'You'}
                </span>
                <span className="message-time">
                  {new Date(message.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="message-content">{message.message}</div>
            </div>
          ))}
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#6c757d', padding: '20px' }}>
              No messages yet. Send a message to your doctor!
            </div>
          )}
        </div>
      </div>
    </div>
  );







  const renderMessages = () => (
    <div className="content-section">
      <h2 className="section-title">💬 Messages with Doctor</h2>
      
      {/* Send Message Form */}
      <div className="message-form">
        <h4>📝 Send a message to your doctor</h4>
        <p style={{ color: '#6c757d', fontSize: '14px', marginBottom: '15px' }}>
          Describe your symptoms, ask questions, or share updates about your health.
        </p>
        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="message-input"
          placeholder="Type your message here... (e.g., 'I'm feeling sick with fever and headache')"
          rows="4"
        />
        <button
          className="btn-primary"
          onClick={handleSendMessage}
          disabled={loading}
          style={{ marginTop: '10px' }}
        >
          {loading ? 'Sending...' : '📤 Send Message'}
        </button>
      </div>

      {/* Message Thread */}
      <div className="message-thread">
        <h4 style={{ marginBottom: '15px' }}>💬 Conversation History</h4>
        {messages.length > 0 ? (
          messages.map(message => (
            <div key={message.id} className={`message-item ${message.sender}`}>
              <div className="message-header">
                <span className="message-sender">
                  {message.sender === 'admin' ? `👨‍⚕️ ${message.adminName}` : '👤 You'}
                </span>
                <span className="message-time">
                  {new Date(message.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="message-content">{message.message}</div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', color: '#6c757d', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>💬</div>
            <h3>No Messages Yet</h3>
            <p>Start a conversation with your doctor by sending a message above.</p>
          </div>
        )}
      </div>
    </div>
  );



  const renderProfileModal = () => {
    if (!showProfileModal) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Edit Profile</h3>
            <button className="btn-close" onClick={() => setShowProfileModal(false)}>×</button>
          </div>

          <div>
            <div className="form-group" style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div className="user-avatar" style={{ width: '80px', height: '80px', fontSize: '32px', margin: '0 auto' }}>
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  style={{ display: 'none' }}
                  id="profilePictureInput"
                />
                <label 
                  htmlFor="profilePictureInput" 
                  style={{ 
                    position: 'absolute', 
                    bottom: '0', 
                    right: '0', 
                    background: '#4CAF50', 
                    color: 'white', 
                    borderRadius: '50%', 
                    width: '24px', 
                    height: '24px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    cursor: 'pointer', 
                    fontSize: '12px' 
                  }}
                >
                  📷
                </label>
              </div>
              <p style={{ fontSize: '14px', color: '#6c757d', marginTop: '10px' }}>Click camera icon to change picture</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name || ''}
                  onChange={handleProfileInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email || ''}
                  onChange={handleProfileInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone || ''}
                  onChange={handleProfileInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  name="age"
                  value={profileData.age || ''}
                  onChange={handleProfileInputChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  name="gender"
                  value={profileData.gender || ''}
                  onChange={handleProfileInputChange}
                  className="form-input"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea
                name="address"
                value={profileData.address || ''}
                onChange={handleProfileInputChange}
                className="form-input"
                rows="2"
                placeholder="Enter your full address"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Emergency Contact</label>
              <input
                type="text"
                name="emergencyContact"
                value={profileData.emergencyContact || ''}
                onChange={handleProfileInputChange}
                className="form-input"
                placeholder="Name - Phone Number"
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-cancel" onClick={() => setShowProfileModal(false)}>
              Cancel
            </button>
            <button 
              className="btn-save" 
              onClick={handleProfileUpdate}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <div className="dashboard-logo">🏥</div>
          <div>
            <h1>Patient Portal</h1>
            <p style={{ color: '#6c757d', fontSize: '14px', margin: 0 }}>
              HealthCare Clinic Management System
            </p>
          </div>
        </div>
        <div className="user-info">
          <div className="user-avatar" onClick={openProfileModal}>
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div style={{ fontWeight: '600' }}>{user.name}</div>
            <div style={{ fontSize: '14px', color: '#6c757d' }}>Patient</div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {alert.show && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}

        <div className="dashboard-nav">
          <button
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            🏠 Dashboard
          </button>

          <button
            className={`nav-btn ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            💬 Messages
          </button>
        </div>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'messages' && renderMessages()}

        {renderProfileModal()}
      </div>
    </div>
  );
};

export default PatientDashboard;