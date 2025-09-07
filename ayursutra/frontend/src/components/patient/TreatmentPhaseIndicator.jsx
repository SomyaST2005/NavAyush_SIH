import React from 'react';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

const TreatmentPhaseIndicator = ({ currentPhase = 'purvakarma' }) => {
  const phases = [
    {
      id: 'purvakarma',
      name: 'Purvakarma',
      description: 'Preparation Phase',
      details: 'Body preparation through oil treatments and steam therapy',
      duration: '3-7 days',
      icon: '🌱'
    },
    {
      id: 'pradhankarma',
      name: 'Pradhankarma',
      description: 'Main Treatment Phase',
      details: 'Core Panchakarma procedures for deep detoxification',
      duration: '7-21 days',
      icon: '🌿'
    },
    {
      id: 'paschatkarma',
      name: 'Paschatkarma',
      description: 'Post-Treatment Phase',
      details: 'Recovery and rejuvenation with dietary guidelines',
      duration: '7-14 days',
      icon: '🌸'
    }
  ];

  const getCurrentPhaseIndex = () => {
    return phases.findIndex(phase => phase.id === currentPhase);
  };

  const isPhaseCompleted = (phaseIndex) => {
    return phaseIndex < getCurrentPhaseIndex();
  };

  const isCurrentPhase = (phaseIndex) => {
    return phaseIndex === getCurrentPhaseIndex();
  };

  const getPhaseStatus = (phaseIndex) => {
    if (isPhaseCompleted(phaseIndex)) return 'completed';
    if (isCurrentPhase(phaseIndex)) return 'current';
    return 'upcoming';
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'completed':
        return {
          container: 'bg-green-50 border-green-200',
          icon: 'text-green-600',
          title: 'text-green-800',
          description: 'text-green-600',
          details: 'text-green-700'
        };
      case 'current':
        return {
          container: 'bg-blue-50 border-blue-200 ring-2 ring-blue-300',
          icon: 'text-blue-600',
          title: 'text-blue-800',
          description: 'text-blue-600',
          details: 'text-blue-700'
        };
      case 'upcoming':
        return {
          container: 'bg-gray-50 border-gray-200',
          icon: 'text-gray-400',
          title: 'text-gray-600',
          description: 'text-gray-500',
          details: 'text-gray-600'
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200',
          icon: 'text-gray-400',
          title: 'text-gray-600',
          description: 'text-gray-500',
          details: 'text-gray-600'
        };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Treatment Phases</h2>
        <p className="text-gray-600">Track your progress through the three phases of Panchakarma</p>
      </div>

      <div className="space-y-4">
        {phases.map((phase, index) => {
          const status = getPhaseStatus(index);
          const styles = getStatusStyles(status);
          
          return (
            <div key={phase.id} className="relative">
              <div className={`rounded-lg border p-4 transition-all duration-200 ${styles.container}`}>
                <div className="flex items-start space-x-4">
                  {/* Phase Icon */}
                  <div className="flex-shrink-0">
                    <div className="text-2xl">{phase.icon}</div>
                  </div>

                  {/* Phase Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`font-semibold ${styles.title}`}>
                        {phase.name}
                      </h3>
                      <span className={`text-sm font-medium ${styles.description}`}>
                        {phase.description}
                      </span>
                      {status === 'completed' && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {status === 'current' && (
                        <div className="h-3 w-3 bg-blue-600 rounded-full animate-pulse"></div>
                      )}
                      {status === 'upcoming' && (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </div>

                    <p className={`text-sm mb-2 ${styles.details}`}>
                      {phase.details}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        status === 'completed' ? 'bg-green-100 text-green-700' :
                        status === 'current' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        Duration: {phase.duration}
                      </span>

                      {status === 'current' && (
                        <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          In Progress
                        </span>
                      )}
                      {status === 'completed' && (
                        <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          Completed
                        </span>
                      )}
                      {status === 'upcoming' && (
                        <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          Upcoming
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar for Current Phase */}
                {status === 'current' && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-blue-600 mb-1">
                      <span>Phase Progress</span>
                      <span>65%</span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: '65%' }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Arrow connector */}
              {index < phases.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowRight className={`h-5 w-5 ${
                    index < getCurrentPhaseIndex() ? 'text-green-600' : 'text-gray-400'
                  }`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Phase Benefits */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
        <h4 className="font-medium text-gray-800 mb-2">Current Phase Benefits</h4>
        <div className="text-sm text-gray-700">
          {currentPhase === 'purvakarma' && (
            <ul className="space-y-1">
              <li>• Prepares body for deep detoxification</li>
              <li>• Softens and mobilizes toxins</li>
              <li>• Enhances digestive fire (Agni)</li>
            </ul>
          )}
          {currentPhase === 'pradhankarma' && (
            <ul className="space-y-1">
              <li>• Deep cellular detoxification</li>
              <li>• Elimination of accumulated toxins</li>
              <li>• Restoration of natural balance</li>
            </ul>
          )}
          {currentPhase === 'paschatkarma' && (
            <ul className="space-y-1">
              <li>• Gradual return to normal diet</li>
              <li>• Strengthening of digestive system</li>
              <li>• Long-term health maintenance</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreatmentPhaseIndicator;
