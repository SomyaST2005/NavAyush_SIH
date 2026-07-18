import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({ defaultValues: { role: 'patient', agreeToTerms: false } });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const password = watch('password');

  const checkPasswordStrength = (pwd) => {
    let s = 0;
    if (pwd?.length >= 8) s++;
    if (/[A-Z]/.test(pwd || '')) s++;
    if (/[a-z]/.test(pwd || '')) s++;
    if (/[0-9]/.test(pwd || '')) s++;
    if (/[^A-Za-z0-9]/.test(pwd || '')) s++;
    return s;
  };

  const strength = checkPasswordStrength(password);
  const strengthLabel = strength <= 1 ? 'Weak' : strength <= 2 ? 'Fair' : strength <= 3 ? 'Medium' : 'Strong';
  const strengthColor = strength <= 1 ? 'bg-red-500' : strength <= 2 ? 'bg-orange-500' : strength <= 3 ? 'bg-yellow-500' : 'bg-green-500';

  const onSubmit = async (data) => {
    setError('');
    const result = await registerUser(data);
    if (result.success) {
      toast.success('Account created! Welcome to AyurSutra.');
      navigate(result.user?.role === 'practitioner' ? '/practitioner/dashboard' : '/patient/dashboard');
    } else {
      setError(result.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Join AyurSutra</h1>
          <p className="text-gray-600 mt-2">Create your account to begin your wellness journey</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="h-4 w-4" /><span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input {...register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'Min 2 characters' } })} placeholder="Full Name" className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.fullName ? 'border-red-300' : 'border-gray-300'}`} />
              </div>
              {errors.fullName && <p className="text-red-600 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Valid email required' } })} type="email" autoComplete="email" placeholder="Email" className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.email ? 'border-red-300' : 'border-gray-300'}`} />
              </div>
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input {...register('phone', { required: 'Phone is required' })} type="tel" placeholder="Phone Number" className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.phone ? 'border-red-300' : 'border-gray-300'}`} />
              </div>
              {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input {...register('dateOfBirth')} type="date" className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'}`} />
              </div>
            </div>

            <div>
              <select {...register('role')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="patient">Patient</option>
                <option value="practitioner">Practitioner</option>
              </select>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })} type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Password" className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.password ? 'border-red-300' : 'border-gray-300'}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all ${strengthColor}`} style={{ width: `${(strength / 5) * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium">{strengthLabel}</span>
                </div>
              )}
              {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input {...register('confirmPassword', { required: 'Confirm your password', validate: v => v === password || 'Passwords do not match' })} type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Confirm Password" className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {watch('confirmPassword') === password && password && (
                <div className="mt-2 flex items-center space-x-1 text-green-600"><CheckCircle className="h-4 w-4" /><span className="text-xs">Passwords match</span></div>
              )}
              {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start">
              <input {...register('agreeToTerms', { required: 'You must agree to the terms' })} type="checkbox" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1" />
              <label className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <button type="button" onClick={() => alert('Terms of Service coming soon')} className="text-green-600 hover:text-green-700 font-medium">Terms of Service</button>
                {' '}and{' '}
                <button type="button" onClick={() => alert('Privacy Policy coming soon')} className="text-green-600 hover:text-green-700 font-medium">Privacy Policy</button>
              </label>
            </div>
            {errors.agreeToTerms && <p className="text-red-600 text-xs">{errors.agreeToTerms.message}</p>}

            <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-4 rounded-lg font-medium transition-colors">
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Already have an account? <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">Sign in here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
