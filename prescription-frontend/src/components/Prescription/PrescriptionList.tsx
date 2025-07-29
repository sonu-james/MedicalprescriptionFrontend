import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Prescription } from '../../services/types';
import ApiService from '../../services/api';
import { toast } from 'react-toastify';

const PrescriptionList: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getDoctorPrescriptions();
      setPrescriptions(data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Error loading prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.symptoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (prescription.diagnosis && prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">All Prescriptions</h1>
        <Link
          to="/prescriptions/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          New Prescription
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by patient name, symptoms, or diagnosis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Prescriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrescriptions.map((prescription) => (
          <div
            key={prescription.prescriptionId}
            className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {prescription.patientDetails.name}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  prescription.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {prescription.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Age:</span> {prescription.patientDetails.age}
                </div>
                {prescription.patientDetails.bloodGroup && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Blood Group:</span> {prescription.patientDetails.bloodGroup}
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Symptoms:</span> 
                  <span className="ml-1">{prescription.symptoms.substring(0, 100)}...</span>
                </div>
                {prescription.diagnosis && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Diagnosis:</span> 
                    <span className="ml-1">{prescription.diagnosis.substring(0, 100)}</span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Medicines ({prescription.medicines.length}):
                </div>
                <div className="space-y-1">
                  {prescription.medicines.slice(0, 2).map((medicine, index) => (
                    <div key={index} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                      {medicine.medicineName} - {medicine.dosage}
                    </div>
                  ))}
                  {prescription.medicines.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{prescription.medicines.length - 2} more medicines
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  {prescription.createdAt && formatDate(prescription.createdAt)}
                </div>
                <Link
                  to={`/prescriptions/${prescription.prescriptionId}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPrescriptions.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            {searchTerm ? 'No prescriptions found matching your search.' : 'No prescriptions found.'}
          </div>
          <Link
            to="/prescriptions/new"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Create Your First Prescription
          </Link>
        </div>
      )}
    </div>
  );
};

export default PrescriptionList;