import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Edit3, Save, X, Camera, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
    constitution: '',
    allergies: '',
    currentMedications: '',
    preferences: {
      language: 'english',
      notifications: {
        email: true,
        sms: true,
        push: true
      },
      privacy: {
        shareProgress: false,
        allowMarketing: false
      }
    }
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        address: user.address || '',
        emergencyContact: user.emergencyContact || '',
        medicalHistory: user.medicalHistory || '',
        constitution: user.constitution || 'Vata-Pitta',
        allergies: user.allergies || '',
        currentMedications: user.currentMedications || '',
        preferences: {
          language: user.preferences?.language || 'english',
          notifications: {
            email: user.preferences?.notifications?.email ?? true,
            sms: user.preferences?.notifications?.sms ?? true,
            push: user.preferences?.notifications?.push ?? true
          },
          privacy: {
            shareProgress: user.preferences?.privacy?.shareProgress ?? false,
            allowMarketing: user.preferences?.privacy?.allowMarketing ?? false
          }
        }
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child, grandchild] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: grandchild ? {
            ...prev[parent][child],
            [grandchild]: value
          } : value
        }
      }));
    } else {
      setProfileData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateProfile(profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        address: user.address || '',
        emergencyContact: user.emergencyContact || '',
        medicalHistory: user.medicalHistory || '',
        constitution: user.constitution || 'Vata-Pitta',
        allergies: user.allergies || '',
        currentMedications: user.currentMedications || '',
        preferences: {
          language: user.preferences?.language || 'english',
          notifications: {
            email: user.preferences?.notifications?.email ?? true,
            sms: user.preferences?.notifications?.sms ?? true,
            push: user.preferences?.notifications?.push ?? true
          },
          privacy: {
            shareProgress: user.preferences?.privacy?.shareProgress ?? false,
            allowMarketing: user.preferences?.privacy?.allowMarketing ?? false
          }
        }
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
          </div>
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Saving...' : 'Save'}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture & Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {profileData.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50">
                      <Camera className="h-4 w-4 text-gray-600" />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mt-4">{profileData.fullName}</h2>
                <p className="text-gray-600">{user?.role === 'patient' ? 'Patient' : 'User'}</p>
                {profileData.dateOfBirth && (
                  <p className="text-sm text-gray-500 mt-2">
                    Age: {calculateAge(profileData.dateOfBirth)} years
                  </p>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-800 mb-3">Constitution</h3>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 border border-purple-100">
                  <p className="font-medium text-purple-700">{profileData.constitution}</p>
                  <p className="text-xs text-purple-600 mt-1">Ayurvedic Body Type</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">{profileData.fullName || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      {profileData.email || 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      {profileData.phone || 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {profileData.dateOfBirth ? formatDate(profileData.dateOfBirth) : 'Not provided'}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  {isEditing ? (
                    <textarea
                      value={profileData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={2}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                      {profileData.address || 'Not provided'}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      placeholder="Name and phone number"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">{profileData.emergencyContact || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-red-600" />
                Medical Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
                  {isEditing ? (
                    <textarea
                      value={profileData.medicalHistory}
                      onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                      rows={3}
                      placeholder="Previous conditions, surgeries, etc."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">{profileData.medicalHistory || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                  {isEditing ? (
                    <textarea
                      value={profileData.allergies}
                      onChange={(e) => handleInputChange('allergies', e.target.value)}
                      rows={2}
                      placeholder="Food, drug, or environmental allergies"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">{profileData.allergies || 'None reported'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                  {isEditing ? (
                    <textarea
                      value={profileData.currentMedications}
                      onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                      rows={2}
                      placeholder="List current medications and dosages"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">{profileData.currentMedications || 'None reported'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Preferences & Settings</h3>
              
              <div className="space-y-6">
                {/* Notification Preferences */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Notification Preferences</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileData.preferences.notifications.email}
                        onChange={(e) => handleInputChange('preferences.notifications.email', e.target.checked)}
                        disabled={!isEditing}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileData.preferences.notifications.sms}
                        onChange={(e) => handleInputChange('preferences.notifications.sms', e.target.checked)}
                        disabled={!isEditing}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">SMS notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileData.preferences.notifications.push}
                        onChange={(e) => handleInputChange('preferences.notifications.push', e.target.checked)}
                        disabled={!isEditing}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Push notifications</span>
                    </label>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Privacy Settings</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileData.preferences.privacy.shareProgress}
                        onChange={(e) => handleInputChange('preferences.privacy.shareProgress', e.target.checked)}
                        disabled={!isEditing}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Share progress with family members</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileData.preferences.privacy.allowMarketing}
                        onChange={(e) => handleInputChange('preferences.privacy.allowMarketing', e.target.checked)}
                        disabled={!isEditing}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Receive marketing communications</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
