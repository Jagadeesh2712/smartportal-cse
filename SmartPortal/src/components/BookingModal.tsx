import React, { useState } from 'react';
import { X, Calendar, Clock, User, FileText, Monitor, AlertCircle } from 'lucide-react';
import { Lab, Equipment } from '../types';

interface BookingModalProps {
  lab: Lab | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (booking: {
    labId: string;
    date: string;
    startTime: string;
    endTime: string;
    purpose: string;
    equipmentIds: string[];
  }) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ lab, isOpen, onClose, onBook }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [purpose, setPurpose] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

  if (!isOpen || !lab) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot || !purpose) return;

    const [startTime, endTime] = selectedSlot.split(' - ');
    onBook({
      labId: lab.id,
      date: selectedDate,
      startTime,
      endTime,
      purpose,
      equipmentIds: selectedEquipment
    });
    
    // Reset form
    setSelectedDate('');
    setSelectedSlot('');
    setPurpose('');
    setSelectedEquipment([]);
    onClose();
  };

  const handleEquipmentToggle = (equipmentId: string) => {
    setSelectedEquipment(prev => 
      prev.includes(equipmentId) 
        ? prev.filter(id => id !== equipmentId)
        : [...prev, equipmentId]
    );
  };

  const availableSlots = lab.availableSlots.filter(slot => 
    slot.available && slot.date === selectedDate
  );

  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Book {lab.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Lab Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <img 
                src={lab.image} 
                alt={lab.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{lab.name}</h3>
                <p className="text-sm text-gray-600">{lab.location}</p>
                <p className="text-xs text-gray-500">Capacity: {lab.capacity}</p>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Select Date
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {getNextWeekDates().map((date) => {
                const dateObj = new Date(date);
                const isToday = date === new Date().toISOString().split('T')[0];
                
                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={`p-3 rounded-lg border text-sm transition-colors ${
                      selectedDate === date
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">
                      {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {dateObj.getDate()}/{dateObj.getMonth() + 1}
                    </div>
                    {isToday && (
                      <div className="text-xs text-blue-600 font-medium">Today</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slot Selection */}
          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Select Time Slot
              </label>
              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlot(`${slot.startTime} - ${slot.endTime}`)}
                      className={`p-3 rounded-lg border text-sm transition-colors ${
                        selectedSlot === `${slot.startTime} - ${slot.endTime}`
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {slot.startTime} - {slot.endTime}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>No available slots for this date</p>
                </div>
              )}
            </div>
          )}

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Purpose
            </label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Describe the purpose of your lab booking..."
              required
            />
          </div>

          {/* Equipment Selection */}
          {lab.equipment.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Monitor className="h-4 w-4 inline mr-1" />
                Select Equipment (Optional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {lab.equipment.map((equipment) => (
                  <label
                    key={equipment.id}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedEquipment.includes(equipment.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    } ${equipment.status !== 'available' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedEquipment.includes(equipment.id)}
                      onChange={() => handleEquipmentToggle(equipment.id)}
                      disabled={equipment.status !== 'available'}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{equipment.name}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          equipment.status === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : equipment.status === 'occupied'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {equipment.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{equipment.specifications}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedDate || !selectedSlot || !purpose}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Book Lab
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;