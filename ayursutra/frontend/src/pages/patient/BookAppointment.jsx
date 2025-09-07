import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppointments } from '../../hooks/useAppointments';
import { practitionerAPI, treatmentAPI } from '../../services/api';

const BookAppointment = () => {
  const navigate = useNavigate();
  const { bookAppointment, loading } = useAppointments();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    treatmentType: '',
    practitionerId: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    notes: '',
    isUrgent: false
  });
  
  const [practitioners, setPractitioners] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedPractitioner, setSelectedPractitioner] = useState(null);

  // Mock data for development
  const mockTreatments = [
    { id: 'abhyanga', name: 'Abhyanga', duration: 60, description: 'Full body oil massage therapy' },
    { id: 'shirodhara', name: 'Shirodhara', duration: 90, description: 'Continuous oil pouring on forehead' },
    { id: 'swedana', name: 'Swedana', duration: 45, description: 'Herbal steam therapy' },
    { id: 'panchakarma', name: 'Panchakarma Consultation', duration: 30, description: 'Treatment planning session' },
    { id: 'nasya', name: 'Nasya', duration: 30, description: 'Nasal administration of medicines' },
    { id: 'basti', name: 'Basti', duration: 75, description: 'Medicated enema therapy' }
  ];

  const mockPractitioners = [
    {
      id: 1,
      fullName: 'Dr. Priya Sharma',
      specialization: 'Panchakarma Specialist',
      experience: '15 years',
      rating: 4.9,
      image: '/api/placeholder/64/64',
      availability: ['abhyanga', 'shirodhara', 'swedana']
    },
    {
      id: 2,
      fullName: 'Dr. Rajesh Kumar',
      specialization: 'Ayurvedic Physician',
      experience: '12 years',
      rating: 4.8,
      image: '/api/placeholder/64/64',
      availability: ['panchakarma', 'nasya', 'basti']
    },
    {
      id: 3,
      fullName: 'Dr. Meera Patel',
      specialization: 'Women\'s Health Specialist',
      experience: '10 years',
      rating: 4.9,
      image: '/api/placeholder/64/64',
      availability: ['abhyanga', 'shirodhara', 'panchakarma']
    }
  ];

  const mockTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  useEffect(() => {
    setTreatments(mockTreatments);
    setPractitioners(mockPractitioners);
  }, []);

  useEffect(() => {
    if (formData.treatmentType && formData.scheduledDate) {
      // Filter practitioners based on treatment type
      const availablePractitioners = mockPractitioners.filter(p => 
        p.availability.includes(formData.treatmentType)
      );
      setPractitioners(availablePractitioners);
      
      // Generate available time slots
      setAvailableSlots(mockTimeSlots);
    }
  }, [formData.treatmentType, formData.scheduledDate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'treatmentType') {
      const treatment = treatments.find(t => t.id === value);
      if (treatment) {
        setFormData(prev => ({ ...prev, duration: treatment.duration }));
      }
    }
    
    if (field === 'practitionerId') {
      const practitioner = practitioners.find(p => p.id === parseInt(value));
      setSelectedPractitioner(practitioner);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      await bookAppointment(formData);
      setStep(5); // Success step
    } catch (error) {
      console.error('Failed to book appointment:', error);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.treatmentType;
      case 2:
        return formData.practitionerId;
      case 3:
        return formData.scheduledDate && formData.scheduledTime;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (step === 5) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Booked Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your appointment has been scheduled and you will receive a confirmation shortly.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Appointment Details:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Treatment:</strong> {treatments.find(t => t.id === formData.treatmentType)?.name}</p>
                <p><strong>Practitioner:</strong> {selectedPractitioner?.fullName}</p>
                <p><strong>Date:</strong> {new Date(formData.scheduledDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {formData.scheduledTime}</p>
                <p><strong>Duration:</strong> {formData.duration} minutes</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/patient/dashboard')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setFormData({
                    treatmentType: '',
                    practitionerId: '',
                    scheduledDate: '',
                    scheduledTime: '',
                    duration: 60,
                    notes: '',
                    isUrgent: false
                  });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Book Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="mr-4 p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Book Appointment</h1>
            <p className="text-gray-600 mt-1">Schedule your next Panchakarma session</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  stepNum <= step 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-24 h-1 mx-2 ${
                    stepNum < step ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Treatment</span>
            <span>Practitioner</span>
            <span>Date & Time</span>
            <span>Confirm</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* Step 1: Select Treatment */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Select Treatment Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {treatments.map((treatment) => (
                  <div
                    key={treatment.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.treatmentType === treatment.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleInputChange('treatmentType', treatment.id)}
                  >
                    <h3 className="font-semibold text-gray-800">{treatment.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{treatment.description}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{treatment.duration} minutes</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Practitioner */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Choose Your Practitioner</h2>
              <div className="space-y-4">
                {practitioners.map((practitioner) => (
                  <div
                    key={practitioner.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.practitionerId === practitioner.id.toString()
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleInputChange('practitionerId', practitioner.id.toString())}
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={practitioner.image}
                        alt={practitioner.fullName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{practitioner.fullName}</h3>
                        <p className="text-sm text-gray-600">{practitioner.specialization}</p>
                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                          <span>{practitioner.experience} experience</span>
                          <span>⭐ {practitioner.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Select Date and Time */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Select Date & Time</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    min={getMinDate()}
                    value={formData.scheduledDate}
                    onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                {formData.scheduledDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Time Slots
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          className={`p-2 text-sm rounded-lg border transition-colors ${
                            formData.scheduledTime === slot
                              ? 'bg-green-600 text-white border-green-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                          }`}
                          onClick={() => handleInputChange('scheduledTime', slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Confirm Your Appointment</h2>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">Treatment Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Treatment:</span>
                        <span className="font-medium">{treatments.find(t => t.id === formData.treatmentType)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{formData.duration} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{new Date(formData.scheduledDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{formData.scheduledTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">Practitioner</h3>
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedPractitioner?.image}
                        alt={selectedPractitioner?.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{selectedPractitioner?.fullName}</p>
                        <p className="text-sm text-gray-600">{selectedPractitioner?.specialization}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Any specific concerns or requests..."
                />
              </div>

              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="urgent"
                  checked={formData.isUrgent}
                  onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="urgent" className="ml-2 text-sm text-gray-700">
                  This is an urgent appointment
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={step === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                step === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Previous
            </button>
            
            <button
              onClick={step === 4 ? handleSubmit : handleNext}
              disabled={!isStepValid() || loading}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                !isStepValid() || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? 'Booking...' : step === 4 ? 'Confirm Booking' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
