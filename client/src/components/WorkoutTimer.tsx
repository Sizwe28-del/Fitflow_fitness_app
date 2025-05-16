import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PlayIcon, PauseIcon, RotateCcwIcon } from 'lucide-react';

interface WorkoutTimerProps {
  duration: number; // in seconds
  onComplete?: () => void;
  className?: string;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  duration,
  onComplete,
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = (timeLeft / duration) * 100;

  // Start, pause, resume or reset the timer
  const toggle = () => {
    setIsActive(!isActive);
    setIsPaused(false);
  };

  const pause = () => {
    setIsPaused(true);
    setIsActive(false);
  };

  const reset = () => {
    setTimeLeft(duration);
    setIsActive(false);
    setIsPaused(false);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            clearInterval(intervalRef.current!);
            setIsActive(false);
            if (onComplete) onComplete();
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    } else if (!isActive && !isPaused && timeLeft !== duration) {
      clearInterval(intervalRef.current!);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, isPaused, timeLeft, duration, onComplete]);

  // Update timeLeft if duration prop changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative w-40 h-40 mb-4">
        {/* Circular progress indicator */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="#e2e8f0" 
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="hsl(var(--primary))" 
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`} 
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`} 
          />
        </svg>
        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold">{formatTime(timeLeft)}</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        {!isActive && !isPaused ? (
          <Button variant="default" size="sm" onClick={toggle}>
            <PlayIcon className="mr-1 h-4 w-4" />
            Start
          </Button>
        ) : isActive ? (
          <Button variant="outline" size="sm" onClick={pause}>
            <PauseIcon className="mr-1 h-4 w-4" />
            Pause
          </Button>
        ) : (
          <Button variant="default" size="sm" onClick={toggle}>
            <PlayIcon className="mr-1 h-4 w-4" />
            Resume
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={reset}
          disabled={timeLeft === duration && !isActive}
        >
          <RotateCcwIcon className="mr-1 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default WorkoutTimer;
