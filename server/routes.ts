import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Test endpoint - returns a test user for development
  app.get('/api/test-auth', (req, res) => {
    res.json({
      id: "42767112",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      profileImageUrl: "https://placehold.co/400x400/4f46e5/ffffff.png?text=TU",
      goal: "muscle_gain"
    });
  });

  // Exercise categories
  app.get('/api/exercise-categories', async (req, res) => {
    try {
      const categories = await storage.getExerciseCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching exercise categories:", error);
      res.status(500).json({ message: "Failed to fetch exercise categories" });
    }
  });

  // Equipment types
  app.get('/api/equipment-types', async (req, res) => {
    try {
      const equipmentTypes = await storage.getEquipmentTypes();
      res.json(equipmentTypes);
    } catch (error) {
      console.error("Error fetching equipment types:", error);
      res.status(500).json({ message: "Failed to fetch equipment types" });
    }
  });

  // Exercises
  app.get('/api/exercises', async (req, res) => {
    try {
      const exercises = await storage.getExercises();
      res.json(exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  app.get('/api/exercises/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid exercise ID" });
      }
      
      const exercise = await storage.getExerciseById(id);
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      
      res.json(exercise);
    } catch (error) {
      console.error("Error fetching exercise:", error);
      res.status(500).json({ message: "Failed to fetch exercise" });
    }
  });

  app.get('/api/exercises/category/:categoryId', async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const exercises = await storage.getExercisesByCategory(categoryId);
      res.json(exercises);
    } catch (error) {
      console.error("Error fetching exercises by category:", error);
      res.status(500).json({ message: "Failed to fetch exercises by category" });
    }
  });

  app.get('/api/exercises/equipment/:equipmentId', async (req, res) => {
    try {
      const equipmentId = parseInt(req.params.equipmentId);
      if (isNaN(equipmentId)) {
        return res.status(400).json({ message: "Invalid equipment ID" });
      }
      
      const exercises = await storage.getExercisesByEquipment(equipmentId);
      res.json(exercises);
    } catch (error) {
      console.error("Error fetching exercises by equipment:", error);
      res.status(500).json({ message: "Failed to fetch exercises by equipment" });
    }
  });

  // Workout plans
  app.get('/api/workout-plans', async (req, res) => {
    try {
      const workouts = await storage.getWorkoutPlans();
      res.json(workouts);
    } catch (error) {
      console.error("Error fetching workout plans:", error);
      res.status(500).json({ message: "Failed to fetch workout plans" });
    }
  });

  app.get('/api/workout-plans/specialized', async (req, res) => {
    try {
      const specializedWorkouts = await storage.getSpecializedWorkouts();
      res.json(specializedWorkouts);
    } catch (error) {
      console.error("Error fetching specialized workouts:", error);
      res.status(500).json({ message: "Failed to fetch specialized workouts" });
    }
  });

  app.get('/api/workout-plans/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid workout plan ID" });
      }
      
      const workout = await storage.getWorkoutPlanById(id);
      if (!workout) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      
      const exercises = await storage.getWorkoutExercises(id);
      
      res.json({
        ...workout,
        exercises
      });
    } catch (error) {
      console.error("Error fetching workout plan:", error);
      res.status(500).json({ message: "Failed to fetch workout plan" });
    }
  });

  app.get('/api/workout-plans/goal/:goal', async (req, res) => {
    try {
      const { goal } = req.params;
      const workouts = await storage.getWorkoutPlansByGoal(goal);
      res.json(workouts);
    } catch (error) {
      console.error("Error fetching workouts by goal:", error);
      res.status(500).json({ message: "Failed to fetch workouts by goal" });
    }
  });

  // User workouts
  app.get('/api/user/workouts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workouts = await storage.getUserWorkouts(userId);
      res.json(workouts);
    } catch (error) {
      console.error("Error fetching user workouts:", error);
      res.status(500).json({ message: "Failed to fetch user workouts" });
    }
  });

  app.post('/api/user/workouts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { date, duration, workoutId, caloriesBurned, completed, notes } = req.body;
      
      if (!date || !duration || !workoutId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const workout = await storage.addUserWorkout({
        duration,
        date,
        workoutId,
        userId,
        caloriesBurned: caloriesBurned || null,
        notes: notes || null,
        completed: completed || true
      });
      
      res.status(201).json(workout);
    } catch (error) {
      console.error("Error adding user workout:", error);
      res.status(500).json({ message: "Failed to add user workout" });
    }
  });

  // Nutrition logs
  app.get('/api/user/nutrition', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const logs = await storage.getUserNutritionLogs(userId);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching nutrition logs:", error);
      res.status(500).json({ message: "Failed to fetch nutrition logs" });
    }
  });

  app.post('/api/user/nutrition', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { date, calories, protein, carbs, fat, notes } = req.body;
      
      if (!date || calories === undefined || protein === undefined || carbs === undefined || fat === undefined) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const log = await storage.addNutritionLog({
        date,
        calories,
        protein,
        carbs,
        fat,
        userId,
        notes: notes || null
      });
      
      res.status(201).json(log);
    } catch (error) {
      console.error("Error adding nutrition log:", error);
      res.status(500).json({ message: "Failed to add nutrition log" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
