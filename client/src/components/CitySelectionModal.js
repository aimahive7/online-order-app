import React, { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';

const cities = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
  'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
  'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte',
  'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Washington'
];

const CitySelectionModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    const city = localStorage.getItem('selectedCity');
    if (!city) {
      setIsOpen(true);
    } else {
      setSelectedCity(city);
    }
  }, []);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    localStorage.setItem('selectedCity', city);
    setIsOpen(false);
    window.location.reload();
  };

  const handleClose = () => {
    if (selectedCity) {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin className="text-primary" size={24} />
            <h2 className="text-2xl font-bold text-chocolate">Select Your City</h2>
          </div>
          {selectedCity && (
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Choose your city to see local bakeries and products available in your area.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => handleCitySelect(city)}
                className="p-3 text-left border rounded-lg hover:bg-primary hover:text-white transition-colors duration-200"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitySelectionModal;