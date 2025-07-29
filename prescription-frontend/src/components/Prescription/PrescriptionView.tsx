import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Prescription } from '../../services/types';
import ApiService from '../../services/api';
import { toast } from 'react-toastify';

const PrescriptionView: React.FC = () => {
  const { prescriptionId } = useParams<{ prescriptionId: string }>();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (prescriptionId) {
      fetchPrescription(prescriptionId);
    }
  }, [prescriptionId]);

  const fetchPrescription = async (id: string) => {
    try {
      setLoading(true);
      const data = await ApiService.getPrescription(id);
      setPrescription(data);
    } catch (error) {
      console.error('Error fetching prescription:', error);
      toast.error('Error loading prescription');
      navigate('/prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">Prescription not found</div>
        <button
          onClick={() => navigate('/prescriptions')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Prescriptions
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <button
          onClick={() => navigate('/prescriptions')}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Prescriptions
        </button>
        <div className="space-x-2">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Print Prescription
          </button>
        </div>
      </div>

      {/* Prescription Content */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg print:shadow-none print:border-0">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              🏥 Prescription
            </h1>
            <div className="text-sm text-gray-600">
              Prescription ID: {prescription.prescriptionId}
            </div>
            <div className="text-sm text-gray-600">
              Date: {prescription.createdAt && formatDate(prescription.createdAt)}
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-2">
                <span className="font-medium text-gray-700">Name:</span>
                <span className="ml-2 text-gray-900">{prescription.patientDetails.name}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-700">Age:</span>
                <span className="ml-2 text-gray-900">{prescription.patientDetails.age} years</span>
              </div>
              {prescription.patientDetails.bloodGroup && (
                <div className="mb-2">
                  <span className="font-medium text-gray-700">Blood Group:</span>
                  <span className="ml-2 text-gray-900">{prescription.patientDetails.bloodGroup}</span>
                </div>
              )}
            </div>
            <div>
              {prescription.patientDetails.weight && (
                <div className="mb-2">
                  <span className="font-medium text-gray-700">Weight:</span>
                  <span className="ml-2 text-gray-900">{prescription.patientDetails.weight} kg</span>
                </div>
              )}
              {prescription.patientDetails.phone && (
                <div className="mb-2">
                  <span className="font-medium text-gray-700">Phone:</span>
                  <span className="ml-2 text-gray-900">{prescription.patientDetails.phone}</span>
                </div>
              )}
              {prescription.patientDetails.address && (
                <div className="mb-2">
                  <span className="font-medium text-gray-700">Address:</span>
                  <span className="ml-2 text-gray-900">{prescription.patientDetails.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h2>
          <div className="space-y-4">
            <div>
              <span className="font-medium text-gray-700">Symptoms:</span>
              <p className="mt-1 text-gray-900">{prescription.symptoms}</p>
            </div>
            {prescription.diagnosis && (
              <div>
                <span className="font-medium text-gray-700">Diagnosis:</span>
                <p className="mt-1 text-gray-900">{prescription.diagnosis}</p>
              </div>
            )}
          </div>
        </div>

        {/* Medicines */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Prescribed Medicines</h2>
          <div className="space-y-4">
            {prescription.medicines.map((medicine, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {index + 1}. {medicine.medicineName}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Dosage:</span>
                    <span className="ml-2 text-gray-900">{medicine.dosage}</span>
                  </div>
                  {medicine.frequency && (
                    <div>
                      <span className="font-medium text-gray-700">Frequency:</span>
                      <span className="ml-2 text-gray-900">{medicine.frequency}</span>
                    </div>
                  )}
                  {medicine.duration && (
                    <div>
                      <span className="font-medium text-gray-700">Duration:</span>
                      <span className="ml-2 text-gray-900">{medicine.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="text-center text-sm text-gray-600">
            <p>This prescription is generated electronically and is valid without signature.</p>
            <p className="mt-1">For any queries, please contact the clinic.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionView;