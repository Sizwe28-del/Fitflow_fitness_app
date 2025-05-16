import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { HomeIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">404 - Page Not Found</h1>
          <p className="text-muted-foreground">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex justify-center items-center p-8">
          <div className="relative">
            <svg
              className="w-48 h-48 text-primary/20"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-primary/50">
              404
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            Let's get you back on track with your fitness journey.
          </p>
          <Link href="/">
            <Button>
              <HomeIcon className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
