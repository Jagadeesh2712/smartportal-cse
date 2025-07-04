import React from 'react';
import { MapPin, Users, Clock, Calendar, Wifi, Monitor, Wrench } from 'lucide-react';
import { Lab } from '../types';

interface LabListProps {
  labs: Lab[];
  onBookLab: (labId: string) => void;
}

const LabList: React.FC<LabListProps> = ({ labs, onBookLab }) => {
  const getLabTypeIcon = (type: string) => {
    switch (type) {
      case 'programming':
        return Monitor;
      case 'networking':
        return Wifi;
      case 'hardware':
        return Wrench;
      default:
        return Monitor;
    }
  };

  const getLabTypeColor = (type: string) => {
    switch (type) {
      case 'programming':
        return 'bg-blue-100 text-blue-800';
      case 'networking':
        return 'bg-green-100 text-green-800';
      case 'hardware':
        return 'bg-purple-100 text-purple-800';
      case 'project':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Available Labs</h1>
        <div className="mt-4 sm:mt-0 flex space-x-4">
          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option>All Labs</option>
            <option>Programming</option>
            <option>Networking</option>
            <option>Hardware</option>
            <option>Project</option>
          </select>
          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option>All Locations</option>
            <option>Block A</option>
            <option>Block B</option>
            <option>Block C</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map((lab) => {
          const availableSlots = lab.availableSlots.filter(slot => slot.available).length;
          const totalSlots = lab.availableSlots.length;
          const utilization = ((totalSlots - availableSlots) / totalSlots) * 100;
          const IconComponent = getLabTypeIcon(lab.type);

          return (
            <div key={lab.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="relative">
                <img 
                  src={lab.image} 
                  alt={lab.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLabTypeColor(lab.type)}`}>
                    <IconComponent className="h-3 w-3 mr-1" />
                    {lab.type.charAt(0).toUpperCase() + lab.type.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{lab.name}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    availableSlots > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {availableSlots > 0 ? 'Available' : 'Full'}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  {lab.location}
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{lab.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-500" />
                      <span>Capacity: {lab.capacity}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{availableSlots} slots available</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Current Utilization</span>
                      <span>{Math.round(utilization)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          utilization < 50 ? 'bg-green-500' : 
                          utilization < 80 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${utilization}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-gray-500">
                      {lab.equipment.length} equipment items
                    </div>
                    <button
                      onClick={() => onBookLab(lab.id)}
                      disabled={availableSlots === 0}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        availableSlots > 0
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Calendar className="h-4 w-4 mr-1 inline" />
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LabList;