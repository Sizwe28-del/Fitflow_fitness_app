import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
  pgEnum,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  goal: varchar("goal").default("general_fitness"),
  heightCm: integer("height_cm"),
  weightKg: integer("weight_kg"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Exercise categories
export const exerciseCategories = pgTable("exercise_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  slug: varchar("slug").unique().notNull(),
  description: text("description"),
  imageUrl: varchar("image_url"),
});

// Equipment types
export const equipmentTypes = pgTable("equipment_types", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  slug: varchar("slug").unique().notNull(),
  description: text("description"),
  imageUrl: varchar("image_url"),
});

// Exercises
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  instructions: text("instructions").notNull(),
  videoUrl: varchar("video_url"),
  imageUrl: varchar("image_url"),
  modelUrl: varchar("model_url"),
  categoryId: integer("category_id").references(() => exerciseCategories.id),
  equipmentId: integer("equipment_id").references(() => equipmentTypes.id),
  targetMuscles: varchar("target_muscles").notNull(),
  difficultyLevel: varchar("difficulty_level").notNull(),
});

// Workout plans
export const workoutPlans = pgTable("workout_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(), // in minutes
  frequency: integer("frequency").notNull(), // times per week
  goal: varchar("goal").notNull(),
  difficultyLevel: varchar("difficulty_level").notNull(),
  imageUrl: varchar("image_url"),
  isSpecialized: boolean("is_specialized").default(false),
});

// Workout exercises
export const workoutExercises = pgTable("workout_exercises", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id").references(() => workoutPlans.id).notNull(),
  exerciseId: integer("exercise_id").references(() => exercises.id).notNull(),
  sets: integer("sets"),
  reps: varchar("reps"),
  duration: integer("duration"), // in seconds, for timed exercises
  restBetween: integer("rest_between"), // in seconds
  order: integer("order").notNull(),
  notes: text("notes"),
});

// User workouts
export const userWorkouts = pgTable("user_workouts", {
  id: serial("id").primaryKey(),
  date: varchar("date").notNull(),
  duration: integer("duration").notNull(), // in minutes
  workoutId: integer("workout_id").references(() => workoutPlans.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  caloriesBurned: integer("calories_burned"),
  completed: boolean("completed"),
  notes: text("notes"),
});

// Nutrition logs
export const nutritionLogs = pgTable("nutrition_logs", {
  id: serial("id").primaryKey(),
  date: varchar("date").notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  notes: text("notes"),
  calories: integer("calories").notNull(),
  protein: integer("protein").notNull(), // in grams
  carbs: integer("carbs").notNull(), // in grams
  fat: integer("fat").notNull(), // in grams
});

// Relations
export const exercisesRelations = relations(exercises, ({ one }) => ({
  category: one(exerciseCategories, {
    fields: [exercises.categoryId],
    references: [exerciseCategories.id],
  }),
  equipment: one(equipmentTypes, {
    fields: [exercises.equipmentId],
    references: [equipmentTypes.id],
  }),
}));

export const workoutExercisesRelations = relations(workoutExercises, ({ one }) => ({
  workout: one(workoutPlans, {
    fields: [workoutExercises.workoutId],
    references: [workoutPlans.id],
  }),
  exercise: one(exercises, {
    fields: [workoutExercises.exerciseId],
    references: [exercises.id],
  }),
}));

export const userWorkoutsRelations = relations(userWorkouts, ({ one }) => ({
  user: one(users, {
    fields: [userWorkouts.userId],
    references: [users.id],
  }),
  workout: one(workoutPlans, {
    fields: [userWorkouts.workoutId],
    references: [workoutPlans.id],
  }),
}));

export const nutritionLogsRelations = relations(nutritionLogs, ({ one }) => ({
  user: one(users, {
    fields: [nutritionLogs.userId],
    references: [users.id],
  }),
}));

// Zod schemas
export const insertExerciseCategorySchema = createInsertSchema(exerciseCategories);
export const insertEquipmentTypeSchema = createInsertSchema(equipmentTypes);
export const insertExerciseSchema = createInsertSchema(exercises);
export const insertWorkoutPlanSchema = createInsertSchema(workoutPlans);
export const insertWorkoutExerciseSchema = createInsertSchema(workoutExercises);
export const insertUserWorkoutSchema = createInsertSchema(userWorkouts);
export const insertNutritionLogSchema = createInsertSchema(nutritionLogs);
export const upsertUserSchema = createInsertSchema(users);

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type ExerciseCategory = typeof exerciseCategories.$inferSelect;
export type EquipmentType = typeof equipmentTypes.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
export type WorkoutPlan = typeof workoutPlans.$inferSelect;
export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type UserWorkout = typeof userWorkouts.$inferSelect;
export type NutritionLog = typeof nutritionLogs.$inferSelect;
