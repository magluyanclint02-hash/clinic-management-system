import React, { useState, useEffect } from 'react';
import {
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  updateMedicineStock,
  getLowStockMedicines,
  getMedicinesByStockStatus,
  getLogbook,
  getMessages,
  sendMessage,
  markMessageAsRead,
  getPatients,
  deletePatient,
  updateUserProfile,
  uploadProfilePicture,
  getUserById,
  getStatistics,
  addLogEntry,
  getMedicineIssuances,
  issueMedicine,
  getSystemSettings,
  updateSystemSettings,
  registerUser
} from '../utils/database';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [medicines, setMedicines] = useState([]);
  const [logbook, setLogbook] = useState([]);
  const [messages, setMessages] = useState([]);
  const [patients, setPatients] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [issuances, setIssuances] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientSearch, setPatientSearch] = useState('');
  const [patientFormData, setPatientFormData] = useState({});
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [lowStockMedicines, setLowStockMedicines] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [systemSettings, setSystemSettings] = useState({});

  useEffect(() => {
    loadData();
    // Add login log entry
    addLogEntry('admin', user.name, 'Admin logged in', 'Accessed admin dashboard');
  }, [user.name]);

  const loadData = () => {
    setMedicines(getMedicines());
    setLogbook(getLogbook());
    setMessages(getMessages());
    setPatients(getPatients());
    setStatistics(getStatistics());
    setLowStockMedicines(getLowStockMedicines());
    setIssuances(getMedicineIssuances());
    setSystemSettings(getSystemSettings());
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
  };

  const handleLogout = () => {
    addLogEntry('admin', user.name, 'Admin logged out', 'Logged out from admin dashboard');
    onLogout();
  };

  // Medicine operations
  const openMedicineModal = (medicine = null) => {
    setModalType('medicine');
    setEditingItem(medicine);
    setFormData(medicine || {
      name: '',
      description: '',
      dosage: '',
      instructions: '',
      sideEffects: '',
      category: ''
    });
    setShowModal(true);
  };

  const saveMedicine = () => {
    setLoading(true);
    try {
      if (editingItem) {
        updateMedicine(editingItem.id, formData);
        showAlert('success', 'Medicine updated successfully!');
      } else {
        addMedicine(formData);
        showAlert('success', 'Medicine added successfully!');
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      showAlert('error', 'Error saving medicine: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedicine = (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      deleteMedicine(id);
      showAlert('success', 'Medicine deleted successfully!');
      loadData();
    }
  };

  // Medicine issuance operations
  const openIssueMedicineModal = (medicine) => {
    setModalType('issueMedicine');
    setEditingItem(medicine);
    setFormData({
      medicineId: medicine.id,
      medicineName: medicine.name,
      patientId: '',
      quantity: 1,
      notes: ''
    });
    setShowModal(true);
  };

  const handleIssueMedicine = () => {
    setLoading(true);
    try {
      if (!formData.patientId || !formData.quantity || formData.quantity <= 0) {
        showAlert('error', 'Please select a patient and enter a valid quantity');
        return;
      }

      issueMedicine(
        formData.medicineId,
        parseInt(formData.patientId),
        parseInt(formData.quantity),
        user.name,
        formData.notes
      );

      showAlert('success', `Successfully issued ${formData.quantity} units of ${formData.medicineName}!`);
      setShowModal(false);
      loadData();
    } catch (error) {
      showAlert('error', 'Error issuing medicine: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Quick restock functionality
  const openRestockModal = (medicine) => {
    setModalType('restock');
    setEditingItem(medicine);
    setFormData({
      medicineId: medicine.id,
      medicineName: medicine.name,
      currentStock: medicine.stock,
      minStock: medicine.minStock || medicine.threshold,
      restockQuantity: Math.max((medicine.minStock || medicine.threshold) * 2 - medicine.stock, 0),
      notes: ''
    });
    setShowModal(true);
  };

  const handleRestock = () => {
    setLoading(true);
    try {
      if (!formData.restockQuantity || formData.restockQuantity <= 0) {
        showAlert('error', 'Please enter a valid restock quantity');
        return;
      }

      const newStock = parseInt(formData.currentStock) + parseInt(formData.restockQuantity);
      updateMedicineStock(formData.medicineId, newStock);
      
      // Add log entry for restocking
      addLogEntry('admin', user.name, 'Medicine restocked', 
        `Restocked ${formData.restockQuantity} units of ${formData.medicineName}. New stock: ${newStock}`);

      showAlert('success', `Successfully restocked ${formData.restockQuantity} units of ${formData.medicineName}!`);
      setShowModal(false);
      loadData();
    } catch (error) {
      showAlert('error', 'Error restocking medicine: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Settings management
  const openSettingsModal = () => {
    setModalType('settings');
    setFormData({
      globalThreshold: systemSettings.lowStockThresholds?.global || 15,
      criticalThreshold: systemSettings.criticalStockThreshold || 5,
      categoryThresholds: systemSettings.lowStockThresholds?.category || {}
    });
    setShowModal(true);
  };

  const handleSaveSettings = () => {
    setLoading(true);
    try {
      const newSettings = {
        lowStockThresholds: {
          global: parseInt(formData.globalThreshold),
          category: formData.categoryThresholds
        },
        criticalStockThreshold: parseInt(formData.criticalThreshold)
      };
      
      updateSystemSettings(newSettings);
      showAlert('success', 'Settings updated successfully!');
      setShowModal(false);
      loadData();
    } catch (error) {
      showAlert('error', 'Error updating settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to medicine in medicines tab
  const goToMedicine = (medicineId) => {
    setActiveTab('medicines');
    // Scroll to medicine after a short delay to ensure tab is loaded
    setTimeout(() => {
      const medicineElement = document.querySelector(`[data-medicine-id="${medicineId}"]`);
      if (medicineElement) {
        medicineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight the medicine card briefly
        medicineElement.style.boxShadow = '0 0 20px rgba(255, 193, 7, 0.8)';
        setTimeout(() => {
          medicineElement.style.boxShadow = '';
        }, 2000);
      }
    }, 100);
  };

  // Message operations
  const handleSendMessage = (patientId, patientName) => {
    if (!messageText.trim()) return;
    
    sendMessage(patientId, patientName, user.id, user.name, 'admin', messageText);
    setMessageText('');
    showAlert('success', 'Message sent successfully!');
    loadData();
  };

  // Patient management
  const openAddPatientModal = () => {
    setModalType('addPatient');
    setPatientFormData({
      name: '',
      email: '',
      phone: '',
      age: '',
      gender: '',
      address: '',
      emergencyContact: ''
    });
    setShowModal(true);
  };

  const handleSavePatient = () => {
    setLoading(true);
    try {
      // Basic validation
      if (!patientFormData.name || !patientFormData.email) {
        showAlert('error', 'Name and Email are required');
        return;
      }

      const username = (patientFormData.email || patientFormData.name)
        .toLowerCase()
        .replace(/\s+/g, '');

      const newPatient = {
        name: patientFormData.name,
        email: patientFormData.email,
        phone: patientFormData.phone || '',
        age: patientFormData.age ? parseInt(patientFormData.age) : '',
        gender: patientFormData.gender || '',
        address: patientFormData.address || '',
        emergencyContact: patientFormData.emergencyContact || '',
        username,
        password: 'password123'
      };

      // Register in users.patients via database util
      const created = registerUser(newPatient, 'patient');

      addLogEntry('admin', user.name, 'Patient added', `Added patient ${created.name}`);
      showAlert('success', 'Patient added successfully!');
      setShowModal(false);
      // refresh datasets
      loadData();
    } catch (error) {
      showAlert('error', 'Error adding patient: ' + (error?.message || String(error)));
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = (patient) => {
    if (window.confirm(`Are you sure you want to delete patient ${patient.name}? This will also delete all their records and messages.`)) {
      deletePatient(patient.id);
      showAlert('success', 'Patient deleted successfully!');
      loadData();
    }
  };

  // Profile management
  const openProfileModal = () => {
    setProfileData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      specialization: user.specialization || ''
    });
    setShowProfileModal(true);
  };

  const handleProfileUpdate = () => {
    setLoading(true);
    try {
      const updatedUser = updateUserProfile(user.id, 'admin', profileData);
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
        uploadProfilePicture(user.id, 'admin', imageData);
        showAlert('success', 'Profile picture updated successfully!');
        // Update current user in localStorage
        const updatedUser = getUserById(user.id, 'admin');
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        window.location.reload();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const renderDashboard = () => (
    <div className="content-section">
      <h2 className="section-title">📊 Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{statistics.totalPatients}</div>
          <div className="stat-label">Total Patients</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{statistics.totalMedicines}</div>
          <div className="stat-label">Medicines</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{statistics.totalIssuances}</div>
          <div className="stat-label">Medicine Issuances</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{statistics.unreadMessages}</div>
          <div className="stat-label">Unread Messages</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{statistics.lowStockMedicines}</div>
          <div className="stat-label">Low Stock Medicines</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">₱{Number(statistics.totalMedicineValue ?? 0).toFixed(2)}</div>
          <div className="stat-label">Total Medicine Value</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginTop: '30px' }}>
        <div className="low-stock-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 className="section-title">⚠️ Low Stock Medicines</h3>
            <button 
              onClick={() => openSettingsModal()}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
              title="Configure Stock Thresholds"
            >
              ⚙️ Settings
            </button>
          </div>
          {lowStockMedicines.length > 0 ? (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {lowStockMedicines.map(medicine => {
                const getStatusColor = (status) => {
                  switch (status) {
                    case 'out-of-stock': return { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' };
                    case 'critical': return { bg: '#fff3cd', border: '#ffeaa7', text: '#856404' };
                    case 'low': return { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460' };
                    default: return { bg: '#fff3cd', border: '#ffeaa7', text: '#856404' };
                  }
                };
                
                const statusColors = getStatusColor(medicine.stockStatus);
                
                return (
                  <div key={medicine.id} style={{ 
                    background: statusColors.bg, 
                    border: `1px solid ${statusColors.border}`, 
                    borderRadius: '8px', 
                    padding: '12px', 
                    marginBottom: '10px',
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <div style={{ fontWeight: 'bold', color: statusColors.text }}>{medicine.name}</div>
                          <span style={{
                            backgroundColor: medicine.stockStatus === 'out-of-stock' ? '#dc3545' : 
                                           medicine.stockStatus === 'critical' ? '#fd7e14' : '#ffc107',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                          }}>
                            {medicine.stockStatus.replace('-', ' ')}
                          </span>
                          {medicine.priority > 150 && (
                            <span style={{
                              backgroundColor: '#dc3545',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: 'bold'
                            }}>
                              HIGH PRIORITY
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '14px', color: statusColors.text, marginBottom: '8px' }}>
                          Current: {medicine.stock} | Threshold: {medicine.threshold} | Needed: {Math.max(medicine.threshold - medicine.stock, 0)}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6c757d' }}>
                          Category: {medicine.category} | Price: ₱{Number(medicine.price ?? 0).toFixed(2)}
                          {medicine.daysUntilEmpty && (
                            <span style={{ marginLeft: '10px', fontWeight: 'bold', color: '#dc3545' }}>
                              ⏰ ~{medicine.daysUntilEmpty} days left
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: '10px' }}>
                        <button 
                          onClick={() => openRestockModal(medicine)}
                          style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                          title="Quick Restock"
                        >
                          🔄 Restock
                        </button>
                        <button 
                          onClick={() => goToMedicine(medicine.id)}
                          style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                          title="View Details"
                        >
                          👁️ View
                        </button>
                        <button 
                          onClick={() => openIssueMedicineModal(medicine)}
                          style={{
                            backgroundColor: medicine.stock === 0 ? '#6c757d' : '#17a2b8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            cursor: medicine.stock === 0 ? 'not-allowed' : 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                          title="Issue Medicine"
                          disabled={medicine.stock === 0}
                        >
                          💉 Issue
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#6c757d', padding: '20px' }}>
              All medicines are well stocked! ✅
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMedicines = () => (
    <div className="content-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 className="section-title">💊 Medicine Management</h2>
        <button className="btn-primary" onClick={() => openMedicineModal()}>
          Add New Medicine
        </button>
      </div>
      
      <div className="medicine-grid">
        {medicines.map(medicine => (
          <div key={medicine.id} className="medicine-card" data-medicine-id={medicine.id}>
            <div className="medicine-name">{medicine.name}</div>
            <div className="medicine-details">
              <p><strong>Category:</strong> {medicine.category}</p>
              <p><strong>Dosage:</strong> {medicine.dosage}</p>
              <p><strong>Price:</strong> ₱{Number(medicine.price ?? 0).toFixed(2)}</p>
              <p><strong>Stock:</strong> 
                <span style={{ color: medicine.stock <= medicine.minStock ? '#dc3545' : '#28a745' }}>
                  {medicine.stock} units
                </span>
                {medicine.stock <= medicine.minStock && <span style={{ color: '#dc3545' }}> ⚠️ Low Stock</span>}
              </p>
              <p><strong>Manufacturer:</strong> {medicine.manufacturer}</p>
              <p><strong>Expiry:</strong> {medicine.expiryDate}</p>
              <p><strong>Description:</strong> {medicine.description}</p>
              <p><strong>Instructions:</strong> {medicine.instructions}</p>
              <p><strong>Side Effects:</strong> {medicine.sideEffects}</p>
            </div>
            <div className="action-buttons" style={{ marginTop: '15px' }}>
              <button className="btn-edit" onClick={() => openMedicineModal(medicine)}>
                Edit
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => openIssueMedicineModal(medicine)}
                style={{ backgroundColor: '#28a745', color: 'white' }}
              >
                Issue Medicine
              </button>
              <button className="btn-delete" onClick={() => handleDeleteMedicine(medicine.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderIssuances = () => (
    <div className="content-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="section-title">💉 Medicine Issuances</h2>
        <button
          className="btn-secondary"
          onClick={() => {
            const printContent = document.getElementById('issuances-print-area').innerHTML;
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.write('<html><head><title>Issuances</title>');
            printWindow.document.write('<style>table{width:100%;border-collapse:collapse} th,td{border:1px solid #ddd;padding:8px;text-align:left} h2{font-family:sans-serif}</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write('<h2>Medicine Issuances</h2>');
            printWindow.document.write(printContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
          }}
        >
          🖨️ Print
        </button>
      </div>
      
      <div style={{ overflowX: 'auto' }} id="issuances-print-area">
        <table className="records-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Medicine</th>
              <th>Patient</th>
              <th>Quantity</th>
              <th>Issued By</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {issuances.map(issuance => (
              <tr key={issuance.id}>
                <td>{issuance.issuedDate}</td>
                <td>{issuance.medicineName}</td>
                <td>{issuance.patientName}</td>
                <td>{issuance.quantity} units</td>
                <td>{issuance.issuedBy}</td>
                <td>{issuance.notes || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderLogbook = () => (
    <div className="content-section">
      <h2 className="section-title">📖 Activity Logbook</h2>
      
      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {logbook.map(entry => (
          <div key={entry.id} className="logbook-entry">
            <div className="logbook-header">
              <span className="logbook-user">
                {entry.user} ({entry.userType})
              </span>
              <span className="logbook-time">
                {new Date(entry.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="logbook-message">
              <strong>{entry.action}</strong> - {entry.details}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Removed admin messages UI as requested
  const renderMessages = () => null;

  /* Messages UI removed as requested. Old JSX omitted to avoid parser issues. */

  const renderPatients = () => (
    <div className="content-section">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2 className="section-title">👥 Patient Management</h2>
        <button className="btn-primary" onClick={openAddPatientModal}>Add Patient</button>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table className="records-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Address</th>
              <th>Emergency Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {patient.profilePicture ? (
                      <img 
                        src={patient.profilePicture} 
                        alt="Profile" 
                        style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div style={{ 
                        width: '30px', 
                        height: '30px', 
                        borderRadius: '50%', 
                        backgroundColor: '#4CAF50', 
                        color: 'white', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '14px', 
                        fontWeight: 'bold' 
                      }}>
                        {patient.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {patient.name}
                  </div>
                </td>
                <td>{patient.email}</td>
                <td>{patient.phone}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>{patient.address || 'N/A'}</td>
                <td>{patient.emergencyContact || 'N/A'}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-secondary" 
                      disabled
                      style={{ backgroundColor: '#6c757d', color: 'white' }}
                    >
                      Message (disabled)
                    </button>
                    <button className="btn-delete" onClick={() => handleDeletePatient(patient)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                <label className="form-label">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={profileData.specialization || ''}
                  onChange={handleProfileInputChange}
                  className="form-input"
                />
              </div>
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

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">
              {modalType === 'medicine' 
                ? (editingItem ? 'Edit Medicine' : 'Add New Medicine')
                : modalType === 'issueMedicine'
                ? `Issue Medicine: ${formData.medicineName}`
                : modalType === 'restock'
                ? `Restock Medicine: ${formData.medicineName}`
                : modalType === 'settings'
                ? 'Stock Threshold Settings'
                : ''
              }
            </h3>
            <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
          </div>

          {modalType === 'settings' ? (
            <div>
              <div className="form-group">
                <label className="form-label">Global Low Stock Threshold</label>
                <input
                  type="number"
                  name="globalThreshold"
                  value={formData.globalThreshold || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  min="1"
                  required
                />
                <small style={{ color: '#6c757d', fontSize: '12px' }}>
                  Default threshold for medicines without category-specific settings
                </small>
              </div>
              <div className="form-group">
                <label className="form-label">Critical Stock Threshold</label>
                <input
                  type="number"
                  name="criticalThreshold"
                  value={formData.criticalThreshold || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  min="1"
                  required
                />
                <small style={{ color: '#6c757d', fontSize: '12px' }}>
                  Stock level considered critical (urgent restock needed)
                </small>
              </div>
              <div className="form-group">
                <label className="form-label">Category-Specific Thresholds</label>
                <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '10px' }}>
                  {['Analgesic', 'Antibiotic', 'NSAID', 'Antihistamine', 'PPI'].map(category => (
                    <div key={category} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ minWidth: '120px', fontSize: '14px' }}>{category}:</label>
                      <input
                        type="number"
                        value={formData.categoryThresholds?.[category] || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          categoryThresholds: {
                            ...formData.categoryThresholds,
                            [category]: e.target.value
                          }
                        })}
                        style={{ flex: 1, padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        min="1"
                        placeholder={`Default: ${formData.globalThreshold || 15}`}
                      />
                    </div>
                  ))}
                </div>
                <small style={{ color: '#6c757d', fontSize: '12px' }}>
                  Leave empty to use global threshold
                </small>
              </div>
            </div>
          ) : modalType === 'medicine' ? (
            <div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Medicine Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Price (₱)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Minimum Stock</label>
                <input
                  type="number"
                  name="minStock"
                  value={formData.minStock || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Manufacturer</label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Dosage</label>
                  <input
                    type="text"
                    name="dosage"
                    value={formData.dosage || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  rows="3"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Instructions</label>
                <textarea
                  name="instructions"
                  value={formData.instructions || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  rows="3"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Side Effects</label>
                <textarea
                  name="sideEffects"
                  value={formData.sideEffects || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  rows="2"
                />
              </div>
            </div>
          ) : modalType === 'issueMedicine' ? (
            <div>
              <div className="form-group">
                <label className="form-label">Medicine</label>
                <input
                  type="text"
                  value={formData.medicineName}
                  className="form-input"
                  disabled
                />
              </div>
              <div className="form-group">
                <label className="form-label">Available Stock</label>
                <input
                  type="text"
                  value={`${editingItem?.stock || 0} units`}
                  className="form-input"
                  disabled
                />
              </div>
              <div className="form-row">
                <div className="form-group" style={{ position: 'relative' }}>
                  <label className="form-label">Patient</label>
                  <input
                    type="text"
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    className="form-input"
                    placeholder="Search patient by name..."
                  />
                  {patientSearch && (
                    <div style={{ position: 'absolute', zIndex: 10, background: '#fff', border: '1px solid #ddd', width: '100%', maxHeight: '150px', overflowY: 'auto' }}>
                      {patients
                        .filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase()))
                        .map(p => (
                          <div
                            key={p.id}
                            onClick={() => { setFormData({ ...formData, patientId: p.id }); setPatientSearch(p.name); }}
                            style={{ padding: '6px 8px', cursor: 'pointer' }}
                          >
                            {p.name}
                          </div>
                        ))}
                      {patients.filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase())).length === 0 && (
                        <div style={{ padding: '6px 8px', color: '#6c757d' }}>No results</div>
                      )}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    min="1"
                    max={editingItem?.stock || 0}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  rows="3"
                  placeholder="Enter any notes about this medicine issuance..."
                />
              </div>
            </div>
          ) : modalType === 'restock' ? (
            <div>
              <div className="form-group">
                <label className="form-label">Medicine</label>
                <input
                  type="text"
                  value={formData.medicineName}
                  className="form-input"
                  disabled
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Current Stock</label>
                  <input
                    type="text"
                    value={`${formData.currentStock} units`}
                    className="form-input"
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Minimum Stock</label>
                  <input
                    type="text"
                    value={`${formData.minStock} units`}
                    className="form-input"
                    disabled
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Restock Quantity</label>
                <input
                  type="number"
                  name="restockQuantity"
                  value={formData.restockQuantity || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  min="1"
                  required
                />
                <small style={{ color: '#6c757d', fontSize: '12px' }}>
                  Suggested: {Math.max(formData.minStock * 2 - formData.currentStock, 0)} units
                </small>
              </div>
              <div className="form-group">
                <label className="form-label">New Total Stock</label>
                <input
                  type="text"
                  value={`${parseInt(formData.currentStock || 0) + parseInt(formData.restockQuantity || 0)} units`}
                  className="form-input"
                  disabled
                />
              </div>
              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  rows="3"
                  placeholder="Enter any notes about this restock..."
                />
              </div>
            </div>
          ) : modalType === 'addPatient' ? (
            <div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={patientFormData.name || ''}
                    onChange={(e)=>setPatientFormData({...patientFormData, name:e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={patientFormData.email || ''}
                    onChange={(e)=>setPatientFormData({...patientFormData, email:e.target.value})}
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
                    value={patientFormData.phone || ''}
                    onChange={(e)=>setPatientFormData({...patientFormData, phone:e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={patientFormData.age || ''}
                    onChange={(e)=>setPatientFormData({...patientFormData, age:e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    name="gender"
                    value={patientFormData.gender || ''}
                    onChange={(e)=>setPatientFormData({...patientFormData, gender:e.target.value})}
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
                  value={patientFormData.address || ''}
                  onChange={(e)=>setPatientFormData({...patientFormData, address:e.target.value})}
                  className="form-input"
                  rows="2"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Emergency Contact</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={patientFormData.emergencyContact || ''}
                  onChange={(e)=>setPatientFormData({...patientFormData, emergencyContact:e.target.value})}
                  className="form-input"
                />
              </div>
            </div>
          ) : null}

          <div className="form-actions">
            <button className="btn-cancel" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button 
              className="btn-save" 
              onClick={modalType === 'medicine' ? saveMedicine : 
                       modalType === 'issueMedicine' ? handleIssueMedicine : 
                       modalType === 'restock' ? handleRestock :
                       modalType === 'settings' ? handleSaveSettings :
                       modalType === 'addPatient' ? handleSavePatient : null}
              disabled={loading}
            >
              {loading ? 'Processing...' : 
               modalType === 'issueMedicine' ? 'Issue Medicine' : 
               modalType === 'restock' ? 'Restock Medicine' :
               modalType === 'settings' ? 'Save Settings' :
               modalType === 'addPatient' ? 'Add Patient' : 'Save'}
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
            <h1>Admin Dashboard</h1>
            <p style={{ color: '#6c757d', fontSize: '14px', margin: 0 }}>
              HealthCare Clinic Management System
            </p>
          </div>
        </div>
        <div className="user-info">
          <div className="user-avatar" onClick={() => openProfileModal()}>
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div style={{ fontWeight: '600' }}>{user.name}</div>
            <div style={{ fontSize: '14px', color: '#6c757d' }}>Administrator</div>
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
            📊 Dashboard
          </button>
          <button
            className={`nav-btn ${activeTab === 'medicines' ? 'active' : ''}`}
            onClick={() => setActiveTab('medicines')}
          >
            💊 Medicines
          </button>
          <button
            className={`nav-btn ${activeTab === 'issuances' ? 'active' : ''}`}
            onClick={() => setActiveTab('issuances')}
          >
            💉 Issuances
          </button>
          <button
            className={`nav-btn ${activeTab === 'logbook' ? 'active' : ''}`}
            onClick={() => setActiveTab('logbook')}
          >
            📖 Logbook
          </button>
          {/* Messages tab removed as requested */}
          <button
            className={`nav-btn ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            👥 Patients
          </button>
        </div>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'medicines' && renderMedicines()}
        {activeTab === 'issuances' && renderIssuances()}
        {activeTab === 'logbook' && renderLogbook()}
        {/* Messages view removed */}
        {activeTab === 'patients' && renderPatients()}

        {renderModal()}
        {renderProfileModal()}
      </div>
    </div>
  );
};

export default AdminDashboard;