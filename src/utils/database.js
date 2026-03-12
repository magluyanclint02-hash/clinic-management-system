// Enhanced Database utility functions using localStorage

// Initialize database with sample data
export const initializeDatabase = () => {
  // Initialize users if not exists
  if (!localStorage.getItem('users')) {
    const users = {
      admins: [
        {
          id: 1,
          username: 'admin',
          password: 'admin123',
          name: 'Dr. epoy sesoy',
          email: 'admin@clinic.com',
          role: 'admin',
          phone: '+1-555-0123',
          specialization: 'General Medicine',
          profilePicture: null
        }
      ],
      patients: [
        {
          id: 1,
          username: 'patient1',
          password: 'patient123',
          name: 'John Smith',
          email: 'john@email.com',
          phone: '123-456-7890',
          age: 35,
          gender: 'Male',
          role: 'patient',
          address: '123 Main St, City, State 12345',
          emergencyContact: 'Jane Smith - 123-456-7891',
          profilePicture: null
        },
        {
          id: 2,
          username: 'patient2',
          password: 'patient123',
          name: 'Emily Davis',
          email: 'emily@email.com',
          phone: '098-765-4321',
          age: 28,
          gender: 'Female',
          role: 'patient',
          address: '456 Oak Ave, City, State 67890',
          emergencyContact: 'Mike Davis - 098-765-4322',
          profilePicture: null
        }
      ]
    };
    localStorage.setItem('users', JSON.stringify(users));
  }

  // Initialize medicines if not exists
  if (!localStorage.getItem('medicines')) {
    const medicines = [
      {
        id: 1,
        name: 'Paracetamol',
        description: 'Pain reliever and fever reducer',
        dosage: '500mg',
        instructions: 'Take 1-2 tablets every 4-6 hours as needed',
        sideEffects: 'Rare: skin rash, liver damage with overdose',
        category: 'Analgesic',
        stock: 8, // Low stock for testing
        minStock: 20,
        price: 5.99,
        manufacturer: 'PharmaCorp',
        expiryDate: '2025-12-31'
      },
      {
        id: 2,
        name: 'Amoxicillin',
        description: 'Antibiotic for bacterial infections',
        dosage: '250mg',
        instructions: 'Take 1 capsule 3 times daily for 7-10 days',
        sideEffects: 'Nausea, diarrhea, allergic reactions',
        category: 'Antibiotic',
        stock: 12, // Low stock for testing
        minStock: 15,
        price: 12.50,
        manufacturer: 'MediLab',
        expiryDate: '2025-08-15'
      },
      {
        id: 3,
        name: 'Ibuprofen',
        description: 'Anti-inflammatory pain reliever',
        dosage: '200mg',
        instructions: 'Take 1-2 tablets every 6-8 hours with food',
        sideEffects: 'Stomach upset, dizziness, headache',
        category: 'NSAID',
        stock: 200,
        minStock: 25,
        price: 8.75,
        manufacturer: 'HealthPlus',
        expiryDate: '2025-10-20'
      },
      {
        id: 4,
        name: 'Cetirizine',
        description: 'Antihistamine for allergies',
        dosage: '10mg',
        instructions: 'Take 1 tablet once daily',
        sideEffects: 'Drowsiness, dry mouth, fatigue',
        category: 'Antihistamine',
        stock: 3, // Critical stock for testing
        minStock: 10,
        price: 6.25,
        manufacturer: 'AllerCare',
        expiryDate: '2025-06-30'
      },
      {
        id: 5,
        name: 'Omeprazole',
        description: 'Proton pump inhibitor for acid reflux',
        dosage: '20mg',
        instructions: 'Take 1 capsule daily before breakfast',
        sideEffects: 'Headache, nausea, stomach pain',
        category: 'PPI',
        stock: 0, // Out of stock for testing
        minStock: 12,
        price: 15.30,
        manufacturer: 'GastroMed',
        expiryDate: '2025-09-15'
      }
    ];
    localStorage.setItem('medicines', JSON.stringify(medicines));
  }

  // Initialize patient records if not exists
  if (!localStorage.getItem('patientRecords')) {
    const records = [
      {
        id: 1,
        patientId: 1,
        patientName: 'John Smith',
        date: '2024-01-15',
        diagnosis: 'Common Cold',
        symptoms: 'Runny nose, cough, mild fever',
        treatment: 'Rest, fluids, Paracetamol as needed',
        prescribedMedicine: 'Paracetamol 500mg',
        notes: 'Patient advised to return if symptoms worsen',
        doctorName: 'Dr. Sarah Johnson'
      },
      {
        id: 2,
        patientId: 1,
        patientName: 'John Smith',
        date: '2024-01-20',
        diagnosis: 'Follow-up Visit',
        symptoms: 'Feeling much better, no fever',
        treatment: 'Continue rest, medication completed',
        prescribedMedicine: 'None',
        notes: 'Patient recovered well, no further treatment needed',
        doctorName: 'Dr. Sarah Johnson'
      },
      {
        id: 3,
        patientId: 2,
        patientName: 'Emily Davis',
        date: '2024-01-10',
        diagnosis: 'Allergic Rhinitis',
        symptoms: 'Sneezing, watery eyes, nasal congestion',
        treatment: 'Antihistamine therapy',
        prescribedMedicine: 'Cetirizine 10mg',
        notes: 'Avoid known allergens, follow up in 2 weeks',
        doctorName: 'Dr. Sarah Johnson'
      },
      {
        id: 4,
        patientId: 2,
        patientName: 'Emily Davis',
        date: '2024-01-25',
        diagnosis: 'Allergic Rhinitis Follow-up',
        symptoms: 'Symptoms improved significantly',
        treatment: 'Continue antihistamine as needed',
        prescribedMedicine: 'Cetirizine 10mg (as needed)',
        notes: 'Patient responding well to treatment',
        doctorName: 'Dr. Sarah Johnson'
      }
    ];
    localStorage.setItem('patientRecords', JSON.stringify(records));
  }

  // Initialize logbook if not exists
  if (!localStorage.getItem('logbook')) {
    const logbook = [
      {
        id: 1,
        timestamp: new Date('2024-01-15T10:30:00').toISOString(),
        user: 'Dr. Sarah Johnson',
        userType: 'admin',
        action: 'Patient consultation completed',
        details: 'Treated John Smith for common cold symptoms'
      },
      {
        id: 2,
        timestamp: new Date('2024-01-15T09:15:00').toISOString(),
        user: 'Emily Davis',
        userType: 'patient',
        action: 'Appointment scheduled',
        details: 'Follow-up appointment for allergic rhinitis'
      }
    ];
    localStorage.setItem('logbook', JSON.stringify(logbook));
  }

  // Initialize messages if not exists
  if (!localStorage.getItem('messages')) {
    const messages = [
      {
        id: 1,
        patientId: 1,
        patientName: 'John Smith',
        adminId: 1,
        adminName: 'Dr. Sarah Johnson',
        timestamp: new Date('2024-01-15T14:30:00').toISOString(),
        sender: 'patient',
        message: 'Hello Doctor, I\'m feeling much better after taking the prescribed medication. Thank you!',
        read: true
      },
      {
        id: 2,
        patientId: 1,
        patientName: 'John Smith',
        adminId: 1,
        adminName: 'Dr. Sarah Johnson',
        timestamp: new Date('2024-01-15T15:00:00').toISOString(),
        sender: 'admin',
        message: 'That\'s great to hear! Continue taking the medication as prescribed and get plenty of rest. Contact me if you have any concerns.',
        read: true
      }
    ];
    localStorage.setItem('messages', JSON.stringify(messages));
  }

  // Initialize medicine issuances if not exists
  if (!localStorage.getItem('medicineIssuances')) {
    const issuances = [
      {
        id: 1,
        medicineId: 1,
        medicineName: 'Paracetamol',
        patientId: 1,
        patientName: 'John Smith',
        quantity: 10,
        issuedBy: 'Dr. Sarah Johnson',
        issuedDate: '2024-01-15',
        timestamp: new Date('2024-01-15T10:30:00').toISOString(),
        notes: 'For fever and pain relief'
      },
      {
        id: 2,
        medicineId: 4,
        medicineName: 'Cetirizine',
        patientId: 2,
        patientName: 'Emily Davis',
        quantity: 7,
        issuedBy: 'Dr. Sarah Johnson',
        issuedDate: '2024-01-10',
        timestamp: new Date('2024-01-10T14:15:00').toISOString(),
        notes: 'For allergic rhinitis treatment'
      }
    ];
    localStorage.setItem('medicineIssuances', JSON.stringify(issuances));
  }

  // Initialize system settings if not exists
  if (!localStorage.getItem('systemSettings')) {
    const settings = {
      lowStockThresholds: {
        global: 15, // Global default threshold
        category: {
          'Analgesic': 20,
          'Antibiotic': 25,
          'NSAID': 15,
          'Antihistamine': 10,
          'PPI': 12
        }
      },
      criticalStockThreshold: 5, // Critical stock level
      autoReorderEnabled: false,
      autoReorderQuantity: 50
    };
    localStorage.setItem('systemSettings', JSON.stringify(settings));
  }
};

// System settings operations
export const getSystemSettings = () => {
  return JSON.parse(localStorage.getItem('systemSettings') || '{}');
};

export const updateSystemSettings = (newSettings) => {
  const currentSettings = getSystemSettings();
  const updatedSettings = { ...currentSettings, ...newSettings };
  localStorage.setItem('systemSettings', JSON.stringify(updatedSettings));
  return updatedSettings;
};

// User authentication
export const authenticateUser = (username, password, userType) => {
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  const userList = userType === 'admin' ? users.admins : users.patients;
  
  if (!userList) return null;
  
  const user = userList.find(u => u.username === username && u.password === password);
  return user || null;
};

// Register new user
export const registerUser = (userData, userType) => {
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  
  if (!users.admins) users.admins = [];
  if (!users.patients) users.patients = [];
  
  const userList = userType === 'admin' ? users.admins : users.patients;
  
  // Check if username already exists
  const existingUser = userList.find(u => u.username === userData.username);
  if (existingUser) {
    throw new Error('Username already exists');
  }
  
  // Generate new ID
  const newId = userList.length > 0 ? Math.max(...userList.map(u => u.id)) + 1 : 1;
  
  const newUser = {
    ...userData,
    id: newId,
    role: userType
  };
  
  userList.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  return newUser;
};

// Medicine operations
export const getMedicines = () => {
  return JSON.parse(localStorage.getItem('medicines') || '[]');
};

export const addMedicine = (medicine) => {
  const medicines = getMedicines();
  const newId = medicines.length > 0 ? Math.max(...medicines.map(m => m.id)) + 1 : 1;
  const newMedicine = { 
    ...medicine, 
    id: newId,
    stock: medicine.stock || 0,
    minStock: medicine.minStock || 10,
    price: medicine.price || 0,
    manufacturer: medicine.manufacturer || '',
    expiryDate: medicine.expiryDate || ''
  };
  medicines.push(newMedicine);
  localStorage.setItem('medicines', JSON.stringify(medicines));
  return newMedicine;
};

export const updateMedicine = (id, updatedMedicine) => {
  const medicines = getMedicines();
  const index = medicines.findIndex(m => m.id === id);
  if (index !== -1) {
    medicines[index] = { ...medicines[index], ...updatedMedicine };
    localStorage.setItem('medicines', JSON.stringify(medicines));
    return medicines[index];
  }
  return null;
};

export const deleteMedicine = (id) => {
  const medicines = getMedicines();
  const filteredMedicines = medicines.filter(m => m.id !== id);
  localStorage.setItem('medicines', JSON.stringify(filteredMedicines));
  return true;
};

// Medicine stock operations
export const updateMedicineStock = (id, newStock, restockBy = 'Admin', notes = '') => {
  const medicines = getMedicines();
  const index = medicines.findIndex(m => m.id === id);
  if (index !== -1) {
    const oldStock = medicines[index].stock;
    const delta = newStock - oldStock;
    medicines[index].stock = newStock;
    localStorage.setItem('medicines', JSON.stringify(medicines));
    addLogEntry('admin', restockBy, 'Medicine stock updated', `Updated stock for ${medicines[index].name} from ${oldStock} to ${newStock}`);

    // If stock increased, record a restock entry in issuances
    if (delta > 0) {
      const issuances = getMedicineIssuances();
      const newId = issuances.length > 0 ? Math.max(...issuances.map(i => i.id)) + 1 : 1;
      const restockRecord = {
        id: newId,
        medicineId: medicines[index].id,
        medicineName: medicines[index].name,
        patientId: null,
        patientName: 'Inventory',
        quantity: delta,
        issuedBy: restockBy,
        issuedDate: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        notes: notes || 'Restock',
        type: 'restock'
      };
      issuances.push(restockRecord);
      localStorage.setItem('medicineIssuances', JSON.stringify(issuances));
      addLogEntry('admin', restockBy, 'Medicine restocked (recorded)', `Added ${delta} units to ${medicines[index].name}`);
    }

    return medicines[index];
  }
  return null;
};

// Enhanced low stock detection with dynamic thresholds
export const getLowStockMedicines = (customThreshold = null) => {
  const medicines = getMedicines();
  const settings = getSystemSettings();
  
  return medicines.filter(medicine => {
    // Use custom threshold if provided, otherwise use category-specific or global threshold
    let threshold;
    if (customThreshold !== null) {
      threshold = customThreshold;
    } else if (medicine.minStock) {
      // Use medicine's own minStock if set
      threshold = medicine.minStock;
    } else {
      // Use category-specific threshold or global default
      threshold = settings.lowStockThresholds?.category?.[medicine.category] || 
                 settings.lowStockThresholds?.global || 15;
    }
    
    return medicine.stock <= threshold;
  }).map(medicine => {
    // Add additional metadata for better categorization
    const settings = getSystemSettings();
    const threshold = medicine.minStock || 
                     settings.lowStockThresholds?.category?.[medicine.category] || 
                     settings.lowStockThresholds?.global || 15;
    
    return {
      ...medicine,
      stockStatus: medicine.stock === 0 ? 'out-of-stock' : 
                  medicine.stock <= (settings.criticalStockThreshold || 5) ? 'critical' : 'low',
      threshold: threshold,
      daysUntilEmpty: estimateDaysUntilEmpty(medicine.id),
      priority: calculateStockPriority(medicine, threshold)
    };
  }).sort((a, b) => b.priority - a.priority); // Sort by priority (highest first)
};

// Get medicines by stock status
export const getMedicinesByStockStatus = (status = 'all') => {
  const medicines = getMedicines();
  const settings = getSystemSettings();
  
  if (status === 'all') return medicines;
  
  return medicines.filter(medicine => {
    const threshold = medicine.minStock || 
                     settings.lowStockThresholds?.category?.[medicine.category] || 
                     settings.lowStockThresholds?.global || 15;
    
    switch (status) {
      case 'out-of-stock':
        return medicine.stock === 0;
      case 'critical':
        return medicine.stock > 0 && medicine.stock <= (settings.criticalStockThreshold || 5);
      case 'low':
        return medicine.stock > (settings.criticalStockThreshold || 5) && medicine.stock <= threshold;
      case 'normal':
        return medicine.stock > threshold;
      default:
        return true;
    }
  });
};

// Calculate stock priority for sorting
const calculateStockPriority = (medicine, threshold) => {
  const settings = getSystemSettings();
  let priority = 0;
  
  // Base priority on how far below threshold
  const stockRatio = medicine.stock / threshold;
  priority += (1 - stockRatio) * 100;
  
  // Higher priority for out of stock
  if (medicine.stock === 0) priority += 200;
  
  // Higher priority for critical medicines (antibiotics, etc.)
  const criticalCategories = ['Antibiotic', 'Emergency', 'Life-saving'];
  if (criticalCategories.includes(medicine.category)) priority += 50;
  
  // Consider usage frequency (estimated from issuances)
  const usageFrequency = getUsageFrequency(medicine.id);
  priority += usageFrequency * 10;
  
  return Math.round(priority);
};

// Estimate days until medicine runs out based on usage patterns
const estimateDaysUntilEmpty = (medicineId) => {
  const issuances = getMedicineIssuances();
  const medicineIssuances = issuances.filter(i => i.medicineId === medicineId);
  
  if (medicineIssuances.length === 0) return null;
  
  // Calculate average daily usage over last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentIssuances = medicineIssuances.filter(i => 
    new Date(i.timestamp) >= thirtyDaysAgo
  );
  
  if (recentIssuances.length === 0) return null;
  
  const totalUsed = recentIssuances.reduce((sum, i) => sum + i.quantity, 0);
  const avgDailyUsage = totalUsed / 30;
  
  const medicine = getMedicines().find(m => m.id === medicineId);
  if (!medicine || avgDailyUsage === 0) return null;
  
  return Math.round(medicine.stock / avgDailyUsage);
};

// Get usage frequency for a medicine
const getUsageFrequency = (medicineId) => {
  const issuances = getMedicineIssuances();
  const medicineIssuances = issuances.filter(i => i.medicineId === medicineId);
  
  // Return frequency based on issuances in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentIssuances = medicineIssuances.filter(i => 
    new Date(i.timestamp) >= thirtyDaysAgo
  );
  
  return recentIssuances.length;
};

// Medicine issuance operations
export const getMedicineIssuances = () => {
  return JSON.parse(localStorage.getItem('medicineIssuances') || '[]').sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const getMedicineIssuancesByPatient = (patientId) => {
  const issuances = getMedicineIssuances();
  return issuances.filter(i => i.patientId === patientId);
};

export const getMedicineIssuancesByMedicine = (medicineId) => {
  const issuances = getMedicineIssuances();
  return issuances.filter(i => i.medicineId === medicineId);
};

export const issueMedicine = (medicineId, patientId, quantity, issuedBy, notes = '') => {
  // Validate inputs
  if (!medicineId || !patientId || !quantity || quantity <= 0) {
    throw new Error('Invalid input parameters');
  }

  // Get medicine and patient details
  const medicines = getMedicines();
  const medicine = medicines.find(m => m.id === medicineId);
  if (!medicine) {
    throw new Error('Medicine not found');
  }

  const patients = getPatients();
  const patient = patients.find(p => p.id === patientId);
  if (!patient) {
    throw new Error('Patient not found');
  }

  // Check if sufficient stock is available
  if (medicine.stock < quantity) {
    throw new Error(`Insufficient stock. Available: ${medicine.stock}, Requested: ${quantity}`);
  }

  // Create issuance record
  const issuances = getMedicineIssuances();
  const newId = issuances.length > 0 ? Math.max(...issuances.map(i => i.id)) + 1 : 1;
  const newIssuance = {
    id: newId,
    medicineId,
    medicineName: medicine.name,
    patientId,
    patientName: patient.name,
    quantity,
    issuedBy,
    issuedDate: new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString(),
    notes
  };

  // Update medicine stock
  const updatedStock = medicine.stock - quantity;
  updateMedicine(medicineId, { stock: updatedStock });

  // Save issuance record
  issuances.push(newIssuance);
  localStorage.setItem('medicineIssuances', JSON.stringify(issuances));

  // Add to logbook
  addLogEntry('admin', issuedBy, 'Medicine issued', `Issued ${quantity} units of ${medicine.name} to ${patient.name}`);

  return newIssuance;
};

// Patient records operations
export const getPatientRecords = () => {
  return JSON.parse(localStorage.getItem('patientRecords') || '[]');
};

export const getPatientRecordsByPatientId = (patientId) => {
  const records = getPatientRecords();
  return records.filter(r => r.patientId === patientId);
};

export const addPatientRecord = (record) => {
  const records = getPatientRecords();
  const newId = records.length > 0 ? Math.max(...records.map(r => r.id)) + 1 : 1;
  const newRecord = { 
    ...record, 
    id: newId,
    date: new Date().toISOString().split('T')[0]
  };
  records.push(newRecord);
  localStorage.setItem('patientRecords', JSON.stringify(records));
  
  // Add to logbook
  addLogEntry('admin', record.doctorName || 'Doctor', 'Patient record added', `New record for ${record.patientName}`);
  
  return newRecord;
};

export const updatePatientRecord = (id, updatedRecord) => {
  const records = getPatientRecords();
  const index = records.findIndex(r => r.id === id);
  if (index !== -1) {
    records[index] = { ...records[index], ...updatedRecord };
    localStorage.setItem('patientRecords', JSON.stringify(records));
    
    // Add to logbook
    addLogEntry('admin', updatedRecord.doctorName || 'Doctor', 'Patient record updated', `Updated record for ${updatedRecord.patientName}`);
    
    return records[index];
  }
  return null;
};

export const deletePatientRecord = (id) => {
  const records = getPatientRecords();
  const record = records.find(r => r.id === id);
  const filteredRecords = records.filter(r => r.id !== id);
  localStorage.setItem('patientRecords', JSON.stringify(filteredRecords));
  
  // Add to logbook
  if (record) {
    addLogEntry('admin', 'Doctor', 'Patient record deleted', `Deleted record for ${record.patientName}`);
  }
  
  return true;
};

// Logbook operations
export const getLogbook = () => {
  return JSON.parse(localStorage.getItem('logbook') || '[]').sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const addLogEntry = (userType, userName, action, details) => {
  const logbook = JSON.parse(localStorage.getItem('logbook') || '[]');
  const newId = logbook.length > 0 ? Math.max(...logbook.map(l => l.id)) + 1 : 1;
  const newEntry = {
    id: newId,
    timestamp: new Date().toISOString(),
    user: userName,
    userType,
    action,
    details
  };
  logbook.push(newEntry);
  localStorage.setItem('logbook', JSON.stringify(logbook));
  return newEntry;
};

// Message operations
export const getMessages = () => {
  return JSON.parse(localStorage.getItem('messages') || '[]').sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const getMessagesByPatientId = (patientId) => {
  const messages = getMessages();
  return messages.filter(m => m.patientId === patientId);
};

export const sendMessage = (patientId, patientName, adminId, adminName, sender, message) => {
  const messages = getMessages();
  const newId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;
  const newMessage = {
    id: newId,
    patientId,
    patientName,
    adminId,
    adminName,
    timestamp: new Date().toISOString(),
    sender,
    message,
    read: false
  };
  messages.push(newMessage);
  localStorage.setItem('messages', JSON.stringify(messages));
  
  // Add to logbook
  const action = sender === 'patient' ? 'Patient sent message' : 'Admin replied to patient';
  const details = sender === 'patient' ? `${patientName} sent a message` : `Replied to ${patientName}`;
  addLogEntry(sender, sender === 'patient' ? patientName : adminName, action, details);
  
  return newMessage;
};

export const markMessageAsRead = (messageId) => {
  const messages = getMessages();
  const index = messages.findIndex(m => m.id === messageId);
  if (index !== -1) {
    messages[index].read = true;
    localStorage.setItem('messages', JSON.stringify(messages));
  }
};

// Get all patients
export const getPatients = () => {
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  return users.patients || [];
};

// Patient management operations
export const deletePatient = (patientId) => {
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (!users.patients) return false;
  
  const patient = users.patients.find(p => p.id === patientId);
  if (!patient) return false;
  
  users.patients = users.patients.filter(p => p.id !== patientId);
  localStorage.setItem('users', JSON.stringify(users));
  
  const records = getPatientRecords();
  const filteredRecords = records.filter(r => r.patientId !== patientId);
  localStorage.setItem('patientRecords', JSON.stringify(filteredRecords));
  
  const messages = getMessages();
  const filteredMessages = messages.filter(m => m.patientId !== patientId);
  localStorage.setItem('messages', JSON.stringify(filteredMessages));
  
  addLogEntry('admin', 'Admin', 'Patient deleted', `Deleted patient: ${patient.name}`);
  return true;
};

// Profile management operations
export const updateUserProfile = (userId, userType, updatedData) => {
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  const userList = userType === 'admin' ? users.admins : users.patients;
  
  if (!userList) return null;
  
  const index = userList.findIndex(u => u.id === userId);
  if (index !== -1) {
    userList[index] = { ...userList[index], ...updatedData };
    localStorage.setItem('users', JSON.stringify(users));
    addLogEntry(userType, userList[index].name, 'Profile updated', 'Updated profile information');
    return userList[index];
  }
  return null;
};

export const uploadProfilePicture = (userId, userType, imageData) => {
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  const userList = userType === 'admin' ? users.admins : users.patients;
  
  if (!userList) return null;
  
  const index = userList.findIndex(u => u.id === userId);
  if (index !== -1) {
    userList[index].profilePicture = imageData;
    localStorage.setItem('users', JSON.stringify(users));
    addLogEntry(userType, userList[index].name, 'Profile picture updated', 'Uploaded new profile picture');
    return userList[index];
  }
  return null;
};

export const getUserById = (userId, userType) => {
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  const userList = userType === 'admin' ? users.admins : users.patients;
  if (!userList) return null;
  return userList.find(u => u.id === userId) || null;
};

// Statistics
export const getStatistics = () => {
  const records = getPatientRecords();
  const patients = getPatients();
  const medicines = getMedicines();
  const messages = getMessages();
  const issuances = getMedicineIssuances();
  const lowStockMedicines = getLowStockMedicines();
  
  return {
    totalPatients: patients.length,
    totalRecords: records.length,
    totalMedicines: medicines.length,
    totalIssuances: issuances.length,
    unreadMessages: messages.filter(m => !m.read && m.sender === 'patient').length,
    lowStockMedicines: lowStockMedicines.length,
    totalMedicineValue: medicines.reduce((total, med) => total + (med.stock * med.price), 0)
  };
};