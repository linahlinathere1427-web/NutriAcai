import { useState } from "react";
import { motion } from "framer-motion";
import { Droplets, Footprints, Apple, Moon, Plus, Target } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PointsDisplay } from "@/components/health/PointsDisplay";
import { TaskCard } from "@/components/health/TaskCard";
import { GoalCard } from "@/components/health/GoalCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const dailyTasks = [
  { id: 1, title: "Drink 8 glasses of water", description: "Stay hydrated throughout the day", points: 50, icon: <Droplets className="h-6 w-6" /> },
  { id: 2, title: "Walk 10,000 steps", description: "Get moving and stay active", points: 100, icon: <Footprints className="h-6 w-6" /> },
  { id: 3, title: "Eat 5 servings of fruits/veggies", description: "Fuel your body with nutrients", points: 75, icon: <Apple className="h-6 w-6" /> },
  { id: 4, title: "Sleep 7-9 hours", description: "Rest well for recovery", points: 80, icon: <Moon className="h-6 w-6" /> },
];

const weeklyTasks = [
  { id: 5, title: "Complete 3 workout sessions", description: "Build strength and endurance", points: 200, icon: <Target className="h-6 w-6" /> },
  { id: 6, title: "Cook 5 healthy meals at home", description: "Take control of your nutrition", points: 150, icon: <Apple className="h-6 w-6" /> },
];

const goals = [
  { title: "Water Intake", target: 8, current: 5, unit: "glasses", period: "daily" as const },
  { title: "Steps", target: 10000, current: 7234, unit: "steps", period: "daily" as const },
  { title: "Workouts", target: 3, current: 2, unit: "sessions", period: "weekly" as const },
  { title: "Weight Goal", target: 5, current: 3.2, unit: "kg lost", period: "monthly" as const },
];

export default function Dashboard() {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [points, setPoints] = useState(1250);

  const toggleTask = (taskId: number, taskPoints: number) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter((id) => id !== taskId));
      setPoints(points - taskPoints);
    } else {
      setCompletedTasks([...completedTasks, taskId]);
      setPoints(points + taskPoints);
    }
  };

  return (
    <AppLayout>
      <div className="px-5 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <p className="text-muted-foreground mb-1">Good morning!</p>
          <h1 className="font-display text-2xl font-bold">Your Health Dashboard</h1>
        </motion.div>

        {/* Points Display */}
        <div className="mb-6">
          <PointsDisplay points={points} streak={7} />
        </div>

        {/* Goals Carousel */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold">Your Goals</h2>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Goal
            </Button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
            {goals.map((goal) => (
              <GoalCard key={goal.title} {...goal} />
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div>
          <h2 className="font-display text-lg font-bold mb-4">Health Tasks</h2>
          <Tabs defaultValue="daily">
            <TabsList className="mb-4">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="space-y-3">
              {dailyTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  title={task.title}
                  description={task.description}
                  points={task.points}
                  icon={task.icon}
                  completed={completedTasks.includes(task.id)}
                  onComplete={() => toggleTask(task.id, task.points)}
                />
              ))}
            </TabsContent>

            <TabsContent value="weekly" className="space-y-3">
              {weeklyTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  title={task.title}
                  description={task.description}
                  points={task.points}
                  icon={task.icon}
                  completed={completedTasks.includes(task.id)}
                  onComplete={() => toggleTask(task.id, task.points)}
                />
              ))}
            </TabsContent>

            <TabsContent value="monthly" className="space-y-3">
              <div className="text-center py-12 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Monthly challenges coming soon!</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
