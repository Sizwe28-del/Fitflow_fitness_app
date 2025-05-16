import React, { useMemo } from 'react';
import AnimatedWorkoutIcon from './AnimatedWorkoutIcon';

interface ExerciseStep {
  name: string;
  duration: number; // in seconds
  type: 'cardio' | 'strength' | 'flexibility' | 'rest';
  completed: boolean;
}

interface WorkoutProgressTrackerProps {
  currentExerciseIndex: number;
  exercises: ExerciseStep[];
  totalDuration: number; // in seconds
  elapsedTime: number; // in seconds
  className?: string;
}

const WorkoutProgressTracker: React.FC<WorkoutProgressTrackerProps> = ({
  currentExerciseIndex,
  exercises,
  totalDuration,
  elapsedTime,
  className = '',
}) => {
  // Calculate overall progress percentage
  const progressPercentage = useMemo(() => {
    return Math.min(100, Math.max(0, (elapsedTime / totalDuration) * 100));
  }, [elapsedTime, totalDuration]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Overall progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <div 
          className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden workout-progress-tracker"
          style={{ "--progress": `${progressPercentage}%` } as React.CSSProperties}
        >
          <div 
            className="h-full bg-primary rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatTime(elapsedTime)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Exercise steps */}
      <div className="space-y-2">
        <h3 className="font-medium text-gray-900">Workout Plan</h3>
        <div className="space-y-2">
          {exercises.map((exercise, index) => (
            <div 
              key={index}
              className={`
                flex items-center p-2 rounded-lg exercise-step
                ${index === currentExerciseIndex ? 'active' : ''}
                ${exercise.completed ? 'completed' : ''}
                ${index === currentExerciseIndex ? 'border-l-4 border-primary' : ''}
              `}
            >
              <div className="flex-shrink-0 mr-3">
                <AnimatedWorkoutIcon 
                  type={exercise.type} 
                  size="sm"
                />
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {exercise.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatTime(exercise.duration)}
                </p>
              </div>
              {exercise.completed && (
                <div className="flex-shrink-0 ml-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutProgressTracker;
