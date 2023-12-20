type Exercise = {
  name: string;
  primaryTarget: string;
  secondaryTargets: string[];
  defaultSets: number;
  defaultReps: number;
};

type WorkoutPlan = {
  name: string;
  daysPerWeek: number;
  days: {
    name: string;
    bodyparts: string[] | Exercise[];
  }[];
};

export const templates: WorkoutPlan[] = [
  {
    name: "upperbody4daysPerWeek",
    daysPerWeek: 4,
    days: [
      {
        name: "chest&triceps",
        bodyparts: ["chest", "chest", "triceps", "triceps"]
      },
      {
        name: "legs&abs",
        bodyparts: ["quads", "hamstrings", "quads", "hamstrings", "calves", "glutes", "abs"]
      },
      {
        name: "back&biceps",
        bodyparts: ["back", "back", "back"]
      },
      {
        name: "arms&shoulders",
        bodyparts: ["shoulders", "shoulders", "triceps", "triceps", "triceps"]
      }
    ]
  },
  {
    name: "Fullbody2",
    daysPerWeek: 2,
    days: [
      {
        name: "Full-body A",
        bodyparts: ["back", "chest", "hamstrings", "glutes", "shoulders", "shoulders", "triceps"]
      },
      {
        name: "Full-body B",
        bodyparts: ["quads", "back", "hamstrings", "chest", "back", "shoulders", "chest"]
      },
    ]
  }
]