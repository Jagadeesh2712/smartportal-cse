import React from 'react';
import { Calendar, Clock, MapPin, FileText, Monitor, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Booking, Lab } from '../types';

interface MyBookingsProps {
  bookings: Booking[];
  labs: Lab[];
  onCancelBooking: (bookingId: string) => void;
}

const MyBookings: React.FC<MyBookingsProps> = ({ bookings, labs, onCancelBooking }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return CheckCircle;
      case 'pending':
        return AlertCircle;
      case 'cancelled':
        return X;
      default:
        return AlertCircle;
    }
  };

  const sortedBookings = [...bookings].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.startTime}`);
    const dateB = new Date(`${b.date} ${b.startTime}`);
    return dateB.getTime() - dateA.getTime();
  });

  const upcomingBookings = sortedBookings.filter(booking => {
    const bookingDate = new Date(`${booking.date} ${booking.startTime}`);
    return bookingDate > new Date() && booking.status !== 'cancelled';
  });

  const pastBookings = sortedBookings.filter(booking => {
    const bookingDate = new Date(`${booking.date} ${booking.startTime}`);
    return bookingDate <= new Date() || booking.status === 'cancelled';
  });

  const BookingCard: React.FC<{ booking: Booking; isPast?: boolean }> = ({ booking, isPast = false }) => {
    const lab = labs.find(l => l.id === booking.labId);
    const StatusIcon = getStatusIcon(booking.status);

    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${isPast ? 'opacity-75' : ''}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <img 
              src={lab?.image} 
              alt={lab?.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{lab?.name}</h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {lab?.location}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            {!isPast && booking.status !== 'cancelled' && (
              <button
                onClick={() => onCancelBooking(booking.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm text-gray-700">
              {new Date(booking.date).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm text-gray-700">
              {booking.startTime} - {booking.endTime}
            </span>
          </div>
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm text-gray-700">
              {booking.purpose}
            </span>
          </div>
        </div>

        {booking.equipmentIds.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center mb-2">
              <Monitor className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Reserved Equipment:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {booking.equipmentIds.map(equipmentId => {
                const equipment = lab?.equipment.find(e => e.id === equipmentId);
                return (
                  <span key={equipmentId} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {equipment?.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500">
          Booked on {new Date(booking.createdAt).toLocaleDateString()}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>

      {/* Upcoming Bookings */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bookings</h2>
        {upcomingBookings.length > 0 ? (
          <div className="space-y-4">
            {upcomingBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No upcoming bookings</p>
            <p className="text-sm text-gray-400">Book a lab to see your reservations here</p>
          </div>
        )}
      </div>

      {/* Past Bookings */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Bookings</h2>
        {pastBookings.length > 0 ? (
          <div className="space-y-4">
            {pastBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} isPast />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No past bookings</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;