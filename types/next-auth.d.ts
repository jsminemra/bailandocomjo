import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      subscriptionStatus?: string;
      trialEndDate?: Date;
      experienceLevel?: string | null;
      weeklyFrequency?: number | null;
      workoutLocation?: string | null;
      hasCompletedQuiz?: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    subscriptionStatus?: string;
    trialEndDate?: Date;
    experienceLevel?: string | null;
    weeklyFrequency?: number | null;
    workoutLocation?: string | null;
    hasCompletedQuiz?: boolean;
  }
}