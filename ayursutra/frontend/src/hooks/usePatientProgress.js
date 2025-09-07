import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export const usePatientProgress = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Mock progress data for development
  const mockProgressData = {
    overall: {
      currentProgress: 65,
      totalSessions: 21,
      completedSessions: 14,
      currentPhase: 'pradhankarma',
      startDate: '2025-01-01',
      estimatedEndDate: '2025-01-28'
    },
    metrics: {
      energy: { current: 9, previous: 6, trend: 'up' },
      sleep: { current: 9, previous: 7, trend: 'up' },
      digestion: { current: 9, previous: 5, trend: 'up' },
      stress: { current: 3, previous: 8, trend: 'down' },
      pain: { current: 2, previous: 7, trend: 'down' }
    },
    timeline: [
      { date: '2025-01-01', progress: 10, energy: 6, sleep: 7, digestion: 5, stress: 8, pain: 7 },
      { date: '2025-01-03', progress: 18, energy: 7, sleep: 7, digestion: 6, stress: 7, pain: 6 },
      { date: '2025-01-05', progress: 25, energy: 7, sleep: 8, digestion: 7, stress: 6, pain: 5 },
      { date: '2025-01-07', progress: 35, energy: 8, sleep: 8, digestion: 7, stress: 5, pain: 4 },
      { date: '2025-01-09', progress: 42, energy: 8, sleep: 9, digestion: 8, stress: 4, pain: 3 },
      { date: '2025-01-11', progress: 50, energy: 9, sleep: 9, digestion: 8, stress: 4, pain: 3 },
      { date: '2025-01-13', progress: 58, energy: 9, sleep: 8, digestion: 9, stress: 3, pain: 2 },
      { date: '2025-01-15', progress: 65, energy: 9, sleep: 9, digestion: 9, stress: 3, pain: 2 }
    ],
    symptoms: [
      { name: 'Chronic Fatigue', before: 9, current: 2, improvement: 78 },
      { name: 'Digestive Issues', before: 7, current: 2, improvement: 71 },
      { name: 'Sleep Problems', before: 6, current: 1, improvement: 83 },
      { name: 'Joint Pain', before: 5, current: 1, improvement: 80 },
      { name: 'Stress & Anxiety', before: 8, current: 3, improvement: 62 }
    ],
    constitution: {
      vata: { balance: 75, trend: 'stable' },
      pitta: { balance: 85, trend: 'improving' },
      kapha: { balance: 70, trend: 'improving' }
    },
    milestones: [
      { id: 1, name: 'Treatment Started', date: '2025-01-01', completed: true },
      { id: 2, name: 'Purvakarma Completed', date: '2025-01-07', completed: true },
      { id: 3, name: 'Energy Improvement', date: '2025-01-08', completed: true },
      { id: 4, name: 'Midpoint Reached', date: '2025-01-12', completed: true },
      { id: 5, name: 'Symptom Relief', date: '2025-01-15', completed: false },
      { id: 6, name: 'Pradhankarma Complete', date: '2025-01-20', completed: false },
      { id: 7, name: 'Treatment Complete', date: '2025-01-28', completed: false }
    ]
  };

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In production, this would be actual API calls
      // const response = await api.get('/patient/progress');
      // setProgressData(response.data);
      
      // For now, use mock data
      setTimeout(() => {
        setProgressData(mockProgressData);
        setLoading(false);
      }, 800);
      
    } catch (err) {
      setError(err.message || 'Failed to fetch progress data');
      setLoading(false);
    }
  };

  const updateProgressEntry = async (date, metrics) => {
    try {
      setLoading(true);
      
      // In production:
      // const response = await api.post('/patient/progress', { date, ...metrics });
      
      // Mock implementation
      setProgressData(prev => ({
        ...prev,
        timeline: [...prev.timeline, { date, ...metrics }].sort((a, b) => new Date(a.date) - new Date(b.date))
      }));
      
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to update progress');
      setLoading(false);
      throw err;
    }
  };

  const getProgressTrend = (metric, days = 7) => {
    if (!progressData?.timeline) return null;
    
    const recentData = progressData.timeline.slice(-days);
    if (recentData.length < 2) return null;
    
    const firstValue = recentData[0][metric];
    const lastValue = recentData[recentData.length - 1][metric];
    
    const change = lastValue - firstValue;
    const percentChange = (change / firstValue) * 100;
    
    return {
      change,
      percentChange,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  };

  const getSymptomImprovement = (symptomName) => {
    if (!progressData?.symptoms) return null;
    
    const symptom = progressData.symptoms.find(s => s.name === symptomName);
    return symptom ? symptom.improvement : null;
  };

  const getCurrentPhaseProgress = () => {
    if (!progressData?.overall) return null;
    
    const { currentPhase, currentProgress } = progressData.overall;
    
    // Calculate phase-specific progress
    const phaseRanges = {
      purvakarma: { start: 0, end: 25 },
      pradhankarma: { start: 25, end: 80 },
      paschatkarma: { start: 80, end: 100 }
    };
    
    const range = phaseRanges[currentPhase];
    if (!range) return null;
    
    const phaseProgress = ((currentProgress - range.start) / (range.end - range.start)) * 100;
    
    return {
      phase: currentPhase,
      progress: Math.max(0, Math.min(100, phaseProgress)),
      isComplete: currentProgress >= range.end
    };
  };

  const getWeeklyReport = () => {
    if (!progressData?.timeline) return null;
    
    const lastWeek = progressData.timeline.slice(-7);
    if (lastWeek.length === 0) return null;
    
    const metrics = ['energy', 'sleep', 'digestion', 'stress', 'pain'];
    const averages = {};
    
    metrics.forEach(metric => {
      const values = lastWeek.map(day => day[metric]).filter(val => val !== undefined);
      averages[metric] = values.length > 0 
        ? values.reduce((sum, val) => sum + val, 0) / values.length 
        : 0;
    });
    
    return {
      period: `${lastWeek[0]?.date} - ${lastWeek[lastWeek.length - 1]?.date}`,
      averages,
      totalSessions: lastWeek.length,
      progressGain: lastWeek[lastWeek.length - 1]?.progress - lastWeek[0]?.progress
    };
  };

  const getConstitutionBalance = () => {
    return progressData?.constitution || null;
  };

  const getMilestones = () => {
    return progressData?.milestones || [];
  };

  const getNextMilestone = () => {
    if (!progressData?.milestones) return null;
    return progressData.milestones.find(m => !m.completed);
  };

  useEffect(() => {
    if (user) {
      fetchProgressData();
    }
  }, [user]);

  return {
    progressData,
    loading,
    error,
    updateProgressEntry,
    getProgressTrend,
    getSymptomImprovement,
    getCurrentPhaseProgress,
    getWeeklyReport,
    getConstitutionBalance,
    getMilestones,
    getNextMilestone,
    refetch: fetchProgressData
  };
};
