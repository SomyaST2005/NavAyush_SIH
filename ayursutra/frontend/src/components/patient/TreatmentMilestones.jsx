import React, { useState } from 'react';
import { CheckCircle, Circle, Clock, Trophy, Star, Target, Calendar } from 'lucide-react';

const TreatmentMilestones = () => {
  const [expandedMilestone, setExpandedMilestone] = useState(null);

  const milestones = [
    {
      id: 1,
      title: 'Treatment Initiation',
      description: 'Successfully started Panchakarma treatment',
      date: '2024-01-01',
      status: 'completed',
      category: 'start',
      points: 100,
      achievements: [
        'Initial consultation completed',
        'Constitution assessment done',
        'Treatment plan established'
      ]
    },
    {
      id: 2,
      title: 'Purvakarma Completion',
      description: 'Completed preparation phase successfully',
      date: '2024-01-07',
      status: 'completed',
      category: 'phase',
      points: 200,
      achievements: [
        'Body preparation completed',
        'Digestive fire enhanced',
        'Toxin mobilization achieved'
      ]
    },
    {
      id: 3,
      title: 'First Week Progress',
      description: 'Significant improvement in energy levels',
      date: '2024-01-08',
      status: 'completed',
      category: 'progress',
      points: 150,
      achievements: [
        'Energy levels improved by 40%',
        'Sleep quality enhanced',
        'Stress levels reduced'
      ]
    },
    {
      id: 4,
      title: 'Midpoint Achievement',
      description: 'Reached 50% treatment completion',
      date: '2024-01-12',
      status: 'completed',
      category: 'milestone',
      points: 300,
      achievements: [
        'Half treatment completed',
        'Significant symptom relief',
        'Improved overall well-being'
      ]
    },
    {
      id: 5,
      title: 'Symptom Relief',
      description: 'Major reduction in primary symptoms',
      date: '2024-01-15',
      status: 'current',
      category: 'health',
      points: 250,
      achievements: [
        'Digestive issues resolved',
        'Joint pain reduced by 80%',
        'Mental clarity improved'
      ]
    },
    {
      id: 6,
      title: 'Pradhankarma Completion',
      description: 'Complete main treatment phase',
      date: '2024-01-20',
      status: 'upcoming',
      category: 'phase',
      points: 400,
      achievements: [
        'Deep detoxification completed',
        'Constitutional balance restored',
        'Optimal health achieved'
      ]
    },
    {
      id: 7,
      title: 'Full Recovery',
      description: 'Complete treatment journey successfully',
      date: '2024-01-28',
      status: 'upcoming',
      category: 'completion',
      points: 500,
      achievements: [
        'Full treatment completed',
        'Health goals achieved',
        'Lifestyle guidelines established'
      ]
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'current':
        return <Clock className="h-6 w-6 text-blue-600 animate-pulse" />;
      case 'upcoming':
        return <Circle className="h-6 w-6 text-gray-400" />;
      default:
        return <Circle className="h-6 w-6 text-gray-400" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'start':
        return <Star className="h-5 w-5" />;
      case 'phase':
        return <Target className="h-5 w-5" />;
      case 'progress':
        return <Trophy className="h-5 w-5" />;
      case 'milestone':
        return <Trophy className="h-5 w-5" />;
      case 'health':
        return <Target className="h-5 w-5" />;
      case 'completion':
        return <Trophy className="h-5 w-5" />;
      default:
        return <Circle className="h-5 w-5" />;
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'completed':
        return {
          container: 'bg-green-50 border-green-200',
          text: 'text-green-800',
          badge: 'bg-green-100 text-green-700'
        };
      case 'current':
        return {
          container: 'bg-blue-50 border-blue-200 ring-2 ring-blue-300',
          text: 'text-blue-800',
          badge: 'bg-blue-100 text-blue-700'
        };
      case 'upcoming':
        return {
          container: 'bg-gray-50 border-gray-200',
          text: 'text-gray-600',
          badge: 'bg-gray-100 text-gray-600'
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200',
          text: 'text-gray-600',
          badge: 'bg-gray-100 text-gray-600'
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const completedMilestones = milestones.filter(m => m.status === 'completed');
  const totalPoints = completedMilestones.reduce((sum, m) => sum + m.points, 0);

  return (
    <div className="p-6">
      {/* Header Stats */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">Achievement Points</h3>
            <p className="text-2xl font-bold text-purple-600">{totalPoints}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Milestones Completed</p>
            <p className="text-xl font-bold text-blue-600">
              {completedMilestones.length}/{milestones.length}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedMilestones.length / milestones.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {milestones.map((milestone, index) => {
          const styles = getStatusStyles(milestone.status);
          const isExpanded = expandedMilestone === milestone.id;
          
          return (
            <div key={milestone.id} className="relative">
              <div className={`rounded-lg border p-4 transition-all duration-200 cursor-pointer ${styles.container}`}
                   onClick={() => setExpandedMilestone(isExpanded ? null : milestone.id)}>
                <div className="flex items-start space-x-4">
                  {/* Status Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(milestone.status)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-semibold ${styles.text}`}>
                          {milestone.title}
                        </h3>
                        <div className={`p-1 rounded ${styles.badge}`}>
                          {getCategoryIcon(milestone.category)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${styles.badge}`}>
                          +{milestone.points} pts
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(milestone.date)}
                        </span>
                      </div>
                    </div>

                    <p className={`text-sm ${styles.text} opacity-80`}>
                      {milestone.description}
                    </p>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className={`font-medium ${styles.text} mb-2`}>Achievements:</h4>
                        <ul className="space-y-1">
                          {milestone.achievements.map((achievement, idx) => (
                            <li key={idx} className={`text-sm ${styles.text} flex items-start space-x-2`}>
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Connection Line */}
              {index < milestones.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className={`w-0.5 h-6 ${
                    milestone.status === 'completed' ? 'bg-green-300' : 'bg-gray-300'
                  }`}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Next Milestone Preview */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100">
        <h4 className="font-medium text-gray-800 mb-2">Next Milestone</h4>
        {(() => {
          const nextMilestone = milestones.find(m => m.status === 'upcoming');
          if (nextMilestone) {
            return (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-700">{nextMilestone.title}</p>
                  <p className="text-sm text-blue-600">{nextMilestone.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Reward</p>
                  <p className="font-bold text-green-600">+{nextMilestone.points} points</p>
                </div>
              </div>
            );
          }
          return (
            <p className="text-green-700 font-medium">🎉 All milestones completed! Congratulations!</p>
          );
        })()}
      </div>

      {/* Achievement Badges */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-800 mb-3">Achievement Badges</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-2xl mb-1">🌟</div>
            <p className="text-xs font-medium text-yellow-700">Early Starter</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl mb-1">💪</div>
            <p className="text-xs font-medium text-green-700">Consistent</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl mb-1">🎯</div>
            <p className="text-xs font-medium text-blue-700">Goal Achiever</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200 opacity-50">
            <div className="text-2xl mb-1">👑</div>
            <p className="text-xs font-medium text-purple-700">Master</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentMilestones;
