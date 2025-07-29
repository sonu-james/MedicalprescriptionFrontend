// components/Layout/Dashboard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiService } from '../../services/api';

interface Medicine {
  medicineId: string;
  medicineName: string;
  composition: string;
  whenToUse: string;
  sideEffects?: string;
  category?: string;
  manufacturer?: string;
}

interface PrescriptionMedicine {
  medicineId: string;
  medicineName: string;
  composition: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

interface PatientDetails {
  patientId?: string;
  name: string;
  age: number;
  bloodGroup: string;
  weight: number;
  phone?: string;
  address?: string;
}

interface Prescription {
  prescriptionId: string;
  doctorId: string;
  patientDetails: PatientDetails;
  symptoms: string;
  diagnosis?: string;
  medicines: PrescriptionMedicine[];
  createdAt: string;
  status: string;
}

type ActiveSection = 'overview' | 'createPrescription' | 'patientManagement' | 'prescriptionLookup';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  
  // Prescription Creation States
  const [patientDetails, setPatientDetails] = useState<PatientDetails>({
    name: '',
    age: 0,
    bloodGroup: '',
    weight: 0,
    phone: '',
    address: ''
  });
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescriptionMedicines, setPrescriptionMedicines] = useState<PrescriptionMedicine[]>([]);
  
  // Medicine Search States
  const [currentMedicineIndex, setCurrentMedicineIndex] = useState<number | null>(null);
  const [medicineSearchTerm, setMedicineSearchTerm] = useState('');
  const [medicineOptions, setMedicineOptions] = useState<Medicine[]>([]);
  const [showMedicineOptions, setShowMedicineOptions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Patient Management States
  const [newPatient, setNewPatient] = useState<PatientDetails>({
    name: '',
    age: 0,
    bloodGroup: '',
    weight: 0,
    phone: '',
    address: ''
  });
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [patients, setPatients] = useState<PatientDetails[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientDetails | null>(null);
  
  // Prescription Lookup States
  const [prescriptionId, setPrescriptionId] = useState('');
  const [foundPrescription, setFoundPrescription] = useState<Prescription | null>(null);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  
  // Loading States
  const [patientLoading, setPatientLoading] = useState(false);
  const [patientsLoading, setPatientsLoading] = useState(false);
  
  const medicineInputRef = useRef<HTMLInputElement>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Search medicines when typing
  useEffect(() => {
    const searchMedicines = async () => {
      if (medicineSearchTerm.length < 2) {
        setMedicineOptions([]);
        setShowMedicineOptions(false);
        return;
      }

      setSearchLoading(true);
      try {
        const result = await apiService.searchMedicines(medicineSearchTerm);
        setMedicineOptions(result.medicines || []);
        setShowMedicineOptions(true);
      } catch (error: any) {
        console.error('Medicine search error:', error);
        setMedicineOptions([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const timeoutId = setTimeout(searchMedicines, 300);
    return () => clearTimeout(timeoutId);
  }, [medicineSearchTerm]);

  // Search patients when typing
  useEffect(() => {
    const searchPatients = async () => {
      if (patientSearchTerm.length < 1) {
        return;
      }

      setPatientsLoading(true);
      try {
        const result = await apiService.searchPatients(patientSearchTerm);
        setPatients(result.patients || []);
      } catch (error: any) {
        console.error('Patient search error:', error);
        setPatients([]);
      } finally {
        setPatientsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchPatients, 300);
    return () => clearTimeout(timeoutId);
  }, [patientSearchTerm]);

  // Load all patients on component mount
  useEffect(() => {
    loadAllPatients();
  }, []);

  const loadAllPatients = async () => {
    try {
      const result = await apiService.searchPatients();
      setPatients(result.patients || []);
    } catch (error: any) {
      console.error('Load patients error:', error);
    }
  };

  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPatientDetails(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'weight' ? Number(value) : value
    }));
  };

  const handleNewPatientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'weight' ? Number(value) : value
    }));
  };

  const createPatient = async () => {
    if (!newPatient.name || !newPatient.age || !newPatient.bloodGroup || !newPatient.weight) {
      toast.error('Please fill in all required patient fields');
      return;
    }

    setPatientLoading(true);
    try {
      const result = await apiService.createPatient({
        name: newPatient.name,
        age: newPatient.age,
        bloodGroup: newPatient.bloodGroup,
        weight: newPatient.weight,
        phone: newPatient.phone,
        address: newPatient.address
      });

      toast.success(`✅ Patient created successfully! ID: ${result.patientId}`);
      
      // Reset form and reload patients
      setNewPatient({ name: '', age: 0, bloodGroup: '', weight: 0, phone: '', address: '' });
      loadAllPatients();
      
    } catch (error: any) {
      console.error('Create patient error:', error);
      toast.error(`Failed to create patient: ${error.message}`);
    } finally {
      setPatientLoading(false);
    }
  };

  const selectPatientForPrescription = (patient: PatientDetails) => {
    setPatientDetails(patient);
    setSelectedPatient(patient);
    setActiveSection('createPrescription');
    toast.success(`Selected patient: ${patient.name}`);
  };

  const searchPrescriptionById = async () => {
    if (!prescriptionId.trim()) {
      toast.error('Please enter a prescription ID');
      return;
    }

    setPrescriptionLoading(true);
    try {
      const result = await apiService.getPrescription(prescriptionId);
      setFoundPrescription(result.prescription);
      toast.success('Prescription found!');
    } catch (error: any) {
      console.error('Search prescription error:', error);
      toast.error(`Prescription not found: ${error.message}`);
      setFoundPrescription(null);
    } finally {
      setPrescriptionLoading(false);
    }
  };

  const printPrescription = async (id: string) => {
    try {
      const htmlContent = await apiService.printPrescription(id);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
      }
    } catch (error: any) {
      toast.error(`Failed to generate prescription: ${error.message}`);
    }
  };

  // Medicine Functions (same as before)
  const addNewMedicine = () => {
    const newMedicine: PrescriptionMedicine = {
      medicineId: '',
      medicineName: '',
      composition: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    };
    setPrescriptionMedicines(prev => [...prev, newMedicine]);
    setCurrentMedicineIndex(prescriptionMedicines.length);
  };

  const removeMedicine = (index: number) => {
    setPrescriptionMedicines(prev => prev.filter((_, i) => i !== index));
    if (currentMedicineIndex === index) {
      setCurrentMedicineIndex(null);
      setMedicineSearchTerm('');
      setShowMedicineOptions(false);
    }
  };

  const selectMedicine = (medicine: Medicine, index: number) => {
    setPrescriptionMedicines(prev => 
      prev.map((med, i) => 
        i === index 
          ? {
              ...med,
              medicineId: medicine.medicineId,
              medicineName: medicine.medicineName,
              composition: medicine.composition
            }
          : med
      )
    );
    setMedicineSearchTerm('');
    setShowMedicineOptions(false);
    setCurrentMedicineIndex(null);
    toast.success(`Added ${medicine.medicineName}`);
  };

  const updateMedicine = (index: number, field: keyof PrescriptionMedicine, value: string) => {
    setPrescriptionMedicines(prev =>
      prev.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      )
    );
  };

  const handleMedicineNameChange = (value: string, index: number) => {
    setMedicineSearchTerm(value);
    setCurrentMedicineIndex(index);
    updateMedicine(index, 'medicineName', value);
  };

  const createPrescription = async () => {
    if (!patientDetails.name || !patientDetails.age || !symptoms.trim() || prescriptionMedicines.length === 0) {
      toast.error('Please fill in all required fields and add at least one medicine');
      return;
    }

    try {
      const prescriptionData = {
        patientDetails: patientDetails,
        symptoms: symptoms,
        diagnosis: diagnosis,
        medicines: prescriptionMedicines.map(med => ({
          medicineId: med.medicineId || `manual-${Date.now()}`,
          medicineName: med.medicineName,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration
        }))
      };

      const result = await apiService.createPrescription(prescriptionData);
      toast.success(`🎉 Prescription created successfully! ID: ${result.prescriptionId}`);
      
      // Reset form
      setPatientDetails({ name: '', age: 0, bloodGroup: '', weight: 0, phone: '', address: '' });
      setSymptoms('');
      setDiagnosis('');
      setPrescriptionMedicines([]);
      setSelectedPatient(null);
      
    } catch (error: any) {
      console.error('Create prescription error:', error);
      toast.error(`Failed to create prescription: ${error.message}`);
    }
  };

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  const testConnection = async () => {
    try {
      const result = await apiService.searchMedicines('test');
      toast.success(`✅ API working! Found ${result.count} medicines`);
    } catch (error: any) {
      toast.error(`❌ API test failed: ${error.message}`);
    }
  };

  const renderNavigation = () => (
    <div style={{
      display: 'flex',
      gap: '10px',
      marginBottom: '30px',
      flexWrap: 'wrap'
    }}>
      {[
        { id: 'overview', label: '🏠 Overview', icon: '🏠' },
        { id: 'createPrescription', label: '📝 Create Prescription', icon: '📝' },
        { id: 'patientManagement', label: '👥 Patient Management', icon: '👥' },
        { id: 'prescriptionLookup', label: '🔍 Prescription Lookup', icon: '🔍' }
      ].map(section => (
        <button
          key={section.id}
          onClick={() => setActiveSection(section.id as ActiveSection)}
          style={{
            padding: '12px 20px',
            border: 'none',
            borderRadius: '8px',
            background: activeSection === section.id ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : '#f8f9fa',
            color: activeSection === section.id ? 'white' : '#666',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '14px'
          }}
          onMouseEnter={(e) => {
            if (activeSection !== section.id) {
              e.currentTarget.style.background = '#e9ecef';
            }
          }}
          onMouseLeave={(e) => {
            if (activeSection !== section.id) {
              e.currentTarget.style.background = '#f8f9fa';
            }
          }}
        >
          {section.label}
        </button>
      ))}
    </div>
  );

  const renderOverview = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '30px', borderRadius: '16px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>📝</div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>Create Prescription</h3>
        <p style={{ margin: '0 0 20px 0', opacity: 0.9 }}>Write new prescriptions with medicine search</p>
        <button 
          onClick={() => setActiveSection('createPrescription')}
          style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
        >
          Start Writing
        </button>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '30px', borderRadius: '16px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>👥</div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>Patient Management</h3>
        <p style={{ margin: '0 0 20px 0', opacity: 0.9 }}>Add new patients and manage records</p>
        <button 
          onClick={() => setActiveSection('patientManagement')}
          style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
        >
          Manage Patients
        </button>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', padding: '30px', borderRadius: '16px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔍</div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>Find Prescription</h3>
        <p style={{ margin: '0 0 20px 0', opacity: 0.9 }}>Look up prescriptions by ID</p>
        <button 
          onClick={() => setActiveSection('prescriptionLookup')}
          style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
        >
          Search Now
        </button>
      </div>
    </div>
  );

  const renderPatientManagement = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
      {/* Add New Patient */}
      <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '20px', borderBottom: '2px solid #27ae60', paddingBottom: '8px' }}>
          ➕ Add New Patient
        </h3>
        
        <div style={{ display: 'grid', gap: '15px' }}>
          <input
            type="text"
            name="name"
            placeholder="Patient Name *"
            value={newPatient.name}
            onChange={handleNewPatientChange}
            style={{ padding: '12px', border: '2px solid #bdc3c7', borderRadius: '6px', fontSize: '14px' }}
            required
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <input
              type="number"
              name="age"
              placeholder="Age *"
              value={newPatient.age || ''}
              onChange={handleNewPatientChange}
              style={{ padding: '12px', border: '2px solid #bdc3c7', borderRadius: '6px', fontSize: '14px' }}
              required
            />
            <input
              type="number"
              name="weight"
              placeholder="Weight (kg) *"
              value={newPatient.weight || ''}
              onChange={handleNewPatientChange}
              style={{ padding: '12px', border: '2px solid #bdc3c7', borderRadius: '6px', fontSize: '14px' }}
              required
            />
          </div>
          <select
            name="bloodGroup"
            value={newPatient.bloodGroup}
            onChange={handleNewPatientChange}
            style={{ padding: '12px', border: '2px solid #bdc3c7', borderRadius: '6px', fontSize: '14px' }}
            required
          >
            <option value="">Select Blood Group *</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={newPatient.phone}
            onChange={handleNewPatientChange}
            style={{ padding: '12px', border: '2px solid #bdc3c7', borderRadius: '6px', fontSize: '14px' }}
          />
          <textarea
            name="address"
            placeholder="Address"
            value={newPatient.address}
            onChange={handleNewPatientChange}
            style={{ padding: '12px', border: '2px solid #bdc3c7', borderRadius: '6px', fontSize: '14px', minHeight: '60px', resize: 'vertical' }}
          />
        </div>

        <button 
          onClick={createPatient}
          disabled={patientLoading}
          style={{ 
            width: '100%', 
            padding: '15px', 
            backgroundColor: patientLoading ? '#bdc3c7' : '#27ae60', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: patientLoading ? 'not-allowed' : 'pointer', 
            fontSize: '16px', 
            fontWeight: 'bold',
            marginTop: '20px'
          }}
        >
          {patientLoading ? '⏳ Creating Patient...' : '✅ Create Patient'}
        </button>
      </div>

      {/* Search Existing Patients */}
      <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '20px', borderBottom: '2px solid #3498db', paddingBottom: '8px' }}>
          👥 Existing Patients
        </h3>

        <input
          type="text"
          placeholder="Search patients by name..."
          value={patientSearchTerm}
          onChange={(e) => setPatientSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px', border: '2px solid #bdc3c7', borderRadius: '6px', fontSize: '14px', marginBottom: '20px', boxSizing: 'border-box' }}
        />

        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {patientsLoading && (
            <div style={{ textAlign: 'center', color: '#3498db', padding: '20px' }}>
              🔍 Searching patients...
            </div>
          )}

          {patients.length === 0 && !patientsLoading && (
            <div style={{ textAlign: 'center', color: '#95a5a6', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>👥</div>
              <p>No patients found</p>
              <p style={{ fontSize: '14px' }}>Create your first patient using the form on the left</p>
            </div>
          )}

          {patients.map((patient) => (
            <div key={patient.patientId} style={{ border: '1px solid #ecf0f1', borderRadius: '8px', padding: '15px', marginBottom: '10px', backgroundColor: '#f8f9fa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: '#2c3e50', margin: '0 0 8px 0' }}>{patient.name}</h4>
                  <p style={{ margin: '2px 0', fontSize: '14px', color: '#555' }}>
                    <strong>Age:</strong> {patient.age} | <strong>Blood:</strong> {patient.bloodGroup} | <strong>Weight:</strong> {patient.weight}kg
                  </p>
                  {patient.phone && (
                    <p style={{ margin: '2px 0', fontSize: '14px', color: '#555' }}>
                      <strong>Phone:</strong> {patient.phone}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => selectPatientForPrescription(patient)}
                  style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                >
                  📝 Create Prescription
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrescriptionLookup = () => (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '25px', textAlign: 'center', borderBottom: '2px solid #e74c3c', paddingBottom: '12px' }}>
          🔍 Find Prescription by ID
        </h3>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          <input
            type="text"
            placeholder="Enter Prescription ID (e.g., abc123-def456-ghi789)"
            value={prescriptionId}
            onChange={(e) => setPrescriptionId(e.target.value)}
            style={{ flex: 1, padding: '15px', border: '2px solid #bdc3c7', borderRadius: '8px', fontSize: '16px' }}
          />
          <button 
            onClick={searchPrescriptionById}
            disabled={prescriptionLoading}
            style={{ 
              padding: '15px 30px', 
              backgroundColor: prescriptionLoading ? '#bdc3c7' : '#e74c3c', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: prescriptionLoading ? 'not-allowed' : 'pointer', 
              fontSize: '16px', 
              fontWeight: 'bold'
            }}
          >
            {prescriptionLoading ? '🔍' : '🔍 Search'}
          </button>
        </div>

        {foundPrescription && (
          <div style={{ border: '2px solid #27ae60', borderRadius: '12px', padding: '25px', backgroundColor: '#f8fff8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h4 style={{ color: '#27ae60', margin: 0 }}>✅ Prescription Found</h4>
              <button 
                onClick={() => printPrescription(foundPrescription.prescriptionId)}
                style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
              >
                🖨️ Print
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <h5 style={{ color: '#2c3e50', marginBottom: '10px' }}>👤 Patient Information</h5>
                <p><strong>Name:</strong> {foundPrescription.patientDetails.name}</p>
                <p><strong>Age:</strong> {foundPrescription.patientDetails.age} years</p>
                <p><strong>Blood Group:</strong> {foundPrescription.patientDetails.bloodGroup}</p>
                <p><strong>Weight:</strong> {foundPrescription.patientDetails.weight} kg</p>
              </div>
              <div>
                <h5 style={{ color: '#2c3e50', marginBottom: '10px' }}>📋 Prescription Details</h5>
                <p><strong>ID:</strong> {foundPrescription.prescriptionId}</p>
                <p><strong>Doctor:</strong> {foundPrescription.doctorId}</p>
                <p><strong>Date:</strong> {new Date(foundPrescription.createdAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {foundPrescription.status}</p>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ color: '#2c3e50', marginBottom: '10px' }}>🩺 Medical Information</h5>
              <p><strong>Symptoms:</strong> {foundPrescription.symptoms}</p>
              {foundPrescription.diagnosis && (
                <p><strong>Diagnosis:</strong> {foundPrescription.diagnosis}</p>
              )}
            </div>

            <div>
              <h5 style={{ color: '#2c3e50', marginBottom: '15px' }}>💊 Prescribed Medicines</h5>
              {foundPrescription.medicines.map((medicine, index) => (
                <div key={index} style={{ background: 'white', border: '1px solid #e1e5e9', borderRadius: '8px', padding: '15px', marginBottom: '10px' }}>
                  <h6 style={{ color: '#2c3e50', margin: '0 0 8px 0' }}>{index + 1}. {medicine.medicineName}</h6>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', fontSize: '14px' }}>
                    <span><strong>Dosage:</strong> {medicine.dosage}</span>
                    <span><strong>Frequency:</strong> {medicine.frequency}</span>
                    <span><strong>Duration:</strong> {medicine.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCreatePrescription = () => (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        
        {selectedPatient && (
          <div style={{ background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 100%)', padding: '15px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #27ae60' }}>
            <h4 style={{ color: '#27ae60', margin: '0 0 8px 0' }}>✅ Selected Patient: {selectedPatient.name}</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>Age: {selectedPatient.age} | Blood: {selectedPatient.bloodGroup} | Weight: {selectedPatient.weight}kg</p>
          </div>
        )}

        {/* Patient Details Section */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '20px', borderBottom: '2px solid #3498db', paddingBottom: '8px' }}>
            👤 Patient Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <input
              type="text"
              name="name"
              placeholder="Patient Name *"
              value={patientDetails.name}
              onChange={handlePatientChange}
              style={{ padding: '12px', border: '2px solid #bdc3c7', borderRadius: '6px', fontSize: '14px' }}
              required
            />
            <input
              type="number"
              name="age"
              placeholder="Age *"
              value={patientDetails.age || ''}
              onChange={handlePatientChange}
              style={{ padding: '12px', border: '2px solid #bdc3c7', borderRadius: '6px', fontSize: '14px' }}
              required
            />
            <select
              name="bloodGroup"
              value={patientDetails.bloodGroup}
              onChange={handlePatientChange}
              style={{ padding: '12px', border: '2px solid #bdc3c7', borderRadius: '6px', fontSize: '14px' }}
              required
            >
              <option value="">Select Blood Group *</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            <input
              type="number"
              name="weight"
              placeholder="Weight (kg) *"
              value={patientDetails.weight || ''}
              onChange={handlePatientChange}
              style={{ padding: '12px', border: '2px solid #bdc3c7', borderRadius: '6px', fontSize: '14px' }}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={patientDetails.phone}
              onChange={handlePatientChange}
              style={{ padding: '12px', border: '2px solid #bdc3c7', borderRadius: '6px', fontSize: '14px' }}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={patientDetails.address}
              onChange={handlePatientChange}
              style={{ padding: '12px', border: '2px solid #bdc3c7', borderRadius: '6px', fontSize: '14px' }}
            />
          </div>
        </div>

        {/* Medical Details Section */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '20px', borderBottom: '2px solid #e74c3c', paddingBottom: '8px' }}>
            🩺 Medical Information
          </h3>
          <textarea
            placeholder="Symptoms *"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '2px solid #bdc3c7', borderRadius: '6px', fontSize: '14px', minHeight: '80px', marginBottom: '15px', boxSizing: 'border-box' }}
            required
          />
          <textarea
            placeholder="Diagnosis (optional)"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '2px solid #bdc3c7', borderRadius: '6px', fontSize: '14px', minHeight: '60px', boxSizing: 'border-box' }}
          />
        </div>

        {/* Medicines Section */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#2c3e50', margin: 0, borderBottom: '2px solid #27ae60', paddingBottom: '8px' }}>
              💊 Prescribed Medicines ({prescriptionMedicines.length})
            </h3>
            <button 
              onClick={addNewMedicine}
              style={{ padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ➕ Add Medicine
            </button>
          </div>

          {prescriptionMedicines.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#95a5a6', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '2px dashed #bdc3c7' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>💊</div>
              <p style={{ fontSize: '16px', marginBottom: '10px' }}>No medicines added yet</p>
              <p style={{ fontSize: '14px' }}>Click "Add Medicine" to start prescribing</p>
            </div>
          ) : (
            <div>
              {prescriptionMedicines.map((medicine, index) => (
                <div key={index} style={{ border: '2px solid #3498db', borderRadius: '8px', padding: '20px', marginBottom: '20px', backgroundColor: '#f8f9fa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h4 style={{ color: '#2c3e50', margin: 0 }}>Medicine {index + 1}</h4>
                    <button 
                      onClick={() => removeMedicine(index)}
                      style={{ padding: '5px 10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      ❌ Remove
                    </button>
                  </div>
                  
                  {/* Medicine Name with Autocomplete */}
                  <div style={{ position: 'relative', marginBottom: '15px' }}>
                    <input
                      ref={currentMedicineIndex === index ? medicineInputRef : null}
                      type="text"
                      placeholder="Start typing medicine name..."
                      value={medicine.medicineName}
                      onChange={(e) => handleMedicineNameChange(e.target.value, index)}
                      onFocus={() => setCurrentMedicineIndex(index)}
                      style={{ width: '100%', padding: '12px', border: '2px solid #3498db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                    
                    {/* Medicine Options Dropdown */}
                    {showMedicineOptions && currentMedicineIndex === index && medicineOptions.length > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '2px solid #3498db',
                        borderTop: 'none',
                        borderRadius: '0 0 6px 6px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        zIndex: 1000,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}>
                        {searchLoading ? (
                          <div style={{ padding: '15px', textAlign: 'center', color: '#3498db' }}>
                            🔍 Searching...
                          </div>
                        ) : (
                          medicineOptions.map((option) => (
                            <div
                              key={option.medicineId}
                              onClick={() => selectMedicine(option, index)}
                              style={{
                                padding: '12px',
                                borderBottom: '1px solid #ecf0f1',
                                cursor: 'pointer',
                                backgroundColor: 'white'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f2f6'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                            >
                              <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>{option.medicineName}</div>
                              <div style={{ fontSize: '12px', color: '#7f8c8d' }}>{option.composition}</div>
                              <div style={{ fontSize: '11px', color: '#95a5a6' }}>{option.whenToUse}</div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {medicine.composition && (
                    <div style={{ padding: '8px', backgroundColor: '#e8f5e8', borderRadius: '4px', marginBottom: '15px', fontSize: '14px', color: '#27ae60' }}>
                      <strong>Composition:</strong> {medicine.composition}
                    </div>
                  )}
                  
                  {/* Medicine Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                    <input
                      type="text"
                      placeholder="Dosage (e.g., 500mg)"
                      value={medicine.dosage}
                      onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                      style={{ padding: '10px', border: '1px solid #bdc3c7', borderRadius: '4px', fontSize: '14px' }}
                    />
                    <input
                      type="text"
                      placeholder="Frequency (e.g., Twice daily)"
                      value={medicine.frequency}
                      onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                      style={{ padding: '10px', border: '1px solid #bdc3c7', borderRadius: '4px', fontSize: '14px' }}
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g., 7 days)"
                      value={medicine.duration}
                      onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                      style={{ padding: '10px', border: '1px solid #bdc3c7', borderRadius: '4px', fontSize: '14px' }}
                    />
                  </div>
                  
                  <textarea
                    placeholder="Special instructions (optional)"
                    value={medicine.instructions}
                    onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #bdc3c7', borderRadius: '4px', fontSize: '14px', minHeight: '50px', marginTop: '15px', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Prescription Button */}
        <button 
          onClick={createPrescription}
          style={{ 
            width: '100%', 
            padding: '18px', 
            backgroundColor: '#27ae60', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            fontSize: '18px', 
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          🎉 Create Prescription
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #e0e0e0'
      }}>
        <div>
          <h1 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>🏥 MediScript Pro</h1>
          <p style={{ color: '#7f8c8d', margin: 0 }}>Welcome back, Dr. {user?.name || user?.username}</p>
        </div>
        <div>
          <button onClick={testConnection} style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
            Test API
          </button>
          <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      {renderNavigation()}

      {/* Content Sections */}
      {activeSection === 'overview' && renderOverview()}
      {activeSection === 'createPrescription' && renderCreatePrescription()}
      {activeSection === 'patientManagement' && renderPatientManagement()}
      {activeSection === 'prescriptionLookup' && renderPrescriptionLookup()}
    </div>
  );
};

export default Dashboard;