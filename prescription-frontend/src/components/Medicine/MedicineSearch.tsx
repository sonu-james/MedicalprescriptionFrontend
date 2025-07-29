// src/components/Medicine/MedicineSearch.tsx - Fixed version
import React, { useState, useEffect, useRef } from 'react';
import type { Medicine } from '../../services/types';
import ApiService from '../../services/api';
import { toast } from 'react-toastify';

interface MedicineSearchProps {
  onMedicineSelect: (medicine: Medicine) => void;
  placeholder?: string;
  value?: string;
}

const MedicineSearch: React.FC<MedicineSearchProps> = ({
  onMedicineSelect,
  placeholder = "Type medicine name...",
  value = ""
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Fix: Use number for browser environment
  const debounceRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const searchMedicines = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const medicines = await ApiService.searchMedicines(searchQuery);
      setSuggestions(medicines);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error searching medicines:', error);
      toast.error('Error searching medicines');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Clear previous timeout
    if (debounceRef.current !== undefined) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout
    debounceRef.current = window.setTimeout(() => {
      searchMedicines(newQuery);
    }, 300);
  };

  const handleMedicineSelect = (medicine: Medicine) => {
    setQuery(medicine.medicineName);
    setSuggestions([]);
    setShowSuggestions(false);
    onMedicineSelect(medicine);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current !== undefined) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      
      {loading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((medicine) => (
            <div
              key={medicine.medicineId}
              onClick={() => handleMedicineSelect(medicine)}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">
                {medicine.medicineName}
              </div>
              <div className="text-sm text-gray-600">
                {medicine.composition}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {medicine.whenToUse}
              </div>
              {medicine.category && (
                <div className="text-xs text-blue-600 mt-1">
                  Category: {medicine.category}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && query.length >= 2 && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="px-4 py-3 text-gray-500 text-sm">
            No medicines found for "{query}"
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineSearch;
