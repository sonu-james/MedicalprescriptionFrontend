import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import type { Prescription, PrescribedMedicine, Medicine } from '../../services/types';
import MedicineSearch from '../Medicine/MedicineSearch';
import ApiService from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { BLOOD_GROUPS, MEDICINE_FREQUENCIES } from '../../utils/constants';

const PrescriptionForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState({
    medicineId: '',
    medicineName: '',
    dosage: '',
    frequency: '',
    duration: ''
  });

  const navigate = useNavigate();

  const { register, control, handleSubmit, formState: { errors } } = useForm<Prescription>({
    defaultValues: {
      patientDetails: {
        name: '',
        age: 0,
        bloodGroup: '',
        weight: 0,
        phone: '',
        address: ''
      },
      symptoms: '',
      diagnosis: '',
      medicines: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medicines'
  });

  const handleMedicineSelect = (medicine: Medicine) => {
    setCurrentMedicine(prev => ({
      ...prev,
      medicineId: medicine.medicineId,
      medicineName: medicine.medicineName
    }));
  };

  const addMedicine = () => {
    if (currentMedicine.medicineName && currentMedicine.dosage) {
      append(currentMedicine as PrescribedMedicine);
      setCurrentMedicine({
        medicineId: '',
        medicineName: '',
        dosage: '',
        frequency: '',
        duration: ''
      });
    } else {
      toast.error('Please select a medicine and enter dosage');
    }
  };

  const onSubmit = async (data: Prescription) => {
    if (data.medicines.length === 0) {
      toast.error('Please add at least one medicine');
      return;
    }

    setLoading(true);
    try {
      const result = await ApiService.createPrescription(data);
      toast.success('Prescription created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating prescription:', error);
      toast.error(error.response?.data?.error || 'Error creating prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Prescription</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient Details Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name *
              </label>
              <input
                {...register('patientDetails.name', { required: 'Patient name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.patientDetails?.name && (
                <p className="text-red-500 text-xs mt-1">{errors.patientDetails.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
              <input
                type="number"
                {...register('patientDetails.age', { 
                  required: 'Age is required',
                  min: { value: 0, message: 'Age must be positive' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.patientDetails?.age && (
                <p className="text-red-500 text-xs mt-1">{errors.patientDetails.age.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
              <select
                {...register('patientDetails.bloodGroup')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Blood Group</option>
                {BLOOD_GROUPS.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms *</label>
              <textarea
                rows={4}
                {...register('symptoms', { required: 'Symptoms are required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.symptoms && (
                <p className="text-red-500 text-xs mt-1">{errors.symptoms.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
              <textarea
                rows={4}
                {...register('diagnosis')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Medicine Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Medicines</h3>
          
          <div className="border border-gray-300 rounded-lg p-4 mb-4 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medicine *</label>
                <MedicineSearch
                  onMedicineSelect={handleMedicineSelect}
                  value={currentMedicine.medicineName}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dosage *</label>
                <input
                  type="text"
                  value={currentMedicine.dosage}
                  onChange={(e) => setCurrentMedicine(prev => ({ ...prev, dosage: e.target.value }))}
                  placeholder="e.g., 500mg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <select
                  value={currentMedicine.frequency}
                  onChange={(e) => setCurrentMedicine(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select</option>
                  {MEDICINE_FREQUENCIES.map(freq => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={currentMedicine.duration}
                  onChange={(e) => setCurrentMedicine(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 7 days"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addMedicine}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Medicine List */}
          <div className="space-y-2">
            {fields.map((medicine, index) => (
              <div key={medicine.id} className="flex items-center justify-between bg-white border rounded-lg p-3">
                <div>
                  <span className="font-medium">{medicine.medicineName}</span>
                  {medicine.dosage && <span> - {medicine.dosage}</span>}
                  {medicine.frequency && <span> - {medicine.frequency}</span>}
                  {medicine.duration && <span> for {medicine.duration}</span>}
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Prescription'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PrescriptionForm;