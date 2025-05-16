import React, { useEffect } from 'react';
import { Route, Router, Switch } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Exercises from '@/pages/Exercises';
import ExerciseDetail from '@/pages/ExerciseDetail';
import Workouts from '@/pages/Workouts';
import WorkoutDetail from '@/pages/WorkoutDetail';
import Nutrition from '@/pages/Nutrition';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/not-found';
import { useAuth } from '@/hooks/useAuth';

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Skip login requirement during development/testing
      // toast({
      //   title: "Authentication required",
      //   description: "Please log in to access this page",
      //   variant: "destructive",
      // });
      // window.location.href = "/api/login";
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <AuthWrapper>
          <Dashboard />
        </AuthWrapper>
      </Route>
      <Route path="/exercises">
        <AuthWrapper>
          <Exercises />
        </AuthWrapper>
      </Route>
      <Route path="/exercises/:id">
        {(params) => (
          <AuthWrapper>
            <ExerciseDetail id={params.id} />
          </AuthWrapper>
        )}
      </Route>
      <Route path="/workouts">
        <AuthWrapper>
          <Workouts />
        </AuthWrapper>
      </Route>
      <Route path="/workouts/:id">
        {(params) => (
          <AuthWrapper>
            <WorkoutDetail id={params.id} />
          </AuthWrapper>
        )}
      </Route>
      <Route path="/nutrition">
        <AuthWrapper>
          <Nutrition />
        </AuthWrapper>
      </Route>
      <Route path="/profile">
        <AuthWrapper>
          <Profile />
        </AuthWrapper>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <Layout>
      <Router />
    </Layout>
  );
}

export default App;
