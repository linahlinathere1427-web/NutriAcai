import { useState } from "react";
import { motion } from "framer-motion";
import { Droplets, Footprints, Apple, Moon, Plus, Target, Bot } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PointsDisplay } from "@/components/health/PointsDisplay";
import { TaskCard } from "@/components/health/TaskCard";
import { GoalCard } from "@/components/health/GoalCard";
import { HealthAgentChat } from "@/components/health/HealthAgentChat";
import { AddGoalDialog } from "@/components/health/AddGoalDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/useProfile";
import { useGoals } from "@/hooks/useGoals";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const dailyTasks = [
  { id: 1, title: "Drink 8 glasses of water", description: "Stay hydrated throughout the day", points: 5, icon: <Droplets className="h-6 w-6" />, type: "daily" as const },
  { id: 2, title: "Walk 10,000 steps", description: "Get moving and stay active", points: 5, icon: <Footprints className="h-6 w-6" />, type: "daily" as const },
  { id: 3, title: "Eat 5 servings of fruits/veggies", description: "Fuel your body with nutrients", points: 5, icon: <Apple className="h-6 w-6" />, type: "daily" as const },
  { id: 4, title: "Sleep 7-9 hours", description: "Rest well for recovery", points: 5, icon: <Moon className="h-6 w-6" />, type: "daily" as const },
];

const weeklyTasks = [
  { id: 5, title: "Complete 3 workout sessions", description: "Build strength and endurance", points: 10, icon: <Target className="h-6 w-6" />, type: "weekly" as const },
  { id: 6, title: "Cook 5 healthy meals at home", description: "Take control of your nutrition", points: 10, icon: <Apple className="h-6 w-6" />, type: "weekly" as const },
];

const monthlyTasks = [
  { id: 7, title: "Lose 2kg body weight", description: "Reach your weight goal", points: 15, icon: <Target className="h-6 w-6" />, type: "monthly" as const },
  { id: 8, title: "Complete 90-day streak", description: "Stay consistent for 3 months", points: 100, icon: <Moon className="h-6 w-6" />, type: "monthly" as const },
];

const defaultGoals = [
  { title: "Water Intake", target: 8, current: 5, unit: "glasses", period: "daily" as const },
  { title: "Steps", target: 10000, current: 7234, unit: "steps", period: "daily" as const },
  { title: "Workouts", target: 3, current: 2, unit: "sessions", period: "weekly" as const },
  { title: "Weight Goal", target: 5, current: 3.2, unit: "kg lost", period: "monthly" as const },
];

export default function Dashboard() {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const { user } = useAuth();
  const { points, streak, addTaskPoints, refetchProfile } = useProfile();
  const { goals, fetchGoals, updateGoalProgress, deleteGoal } = useGoals();

  const toggleTask = async (taskId: number, taskType: "daily" | "weekly" | "monthly") => {
    if (!user) {
      toast.error("Please sign in to track your progress");
      return;
    }

    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter((id) => id !== taskId));
      toast.info("Task unchecked");
    } else {
      setCompletedTasks([...completedTasks, taskId]);
      
      // Add points via backend
      const newPoints = await addTaskPoints(taskType);
      if (newPoints !== undefined) {
        const pointsEarned = taskType === "daily" ? 5 : taskType === "weekly" ? 10 : 15;
        toast.success(`+${pointsEarned} points earned! Total: ${newPoints}`);
        fetchProfile();
      }
    }
  };

  const handleGoalIncrement = async (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      await updateGoalProgress(goalId, (goal.current_value || 0) + 1);
      toast.success(`Progress updated for ${goal.title}`);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    await deleteGoal(goalId);
    toast.success("Goal deleted");
  };

  // Combine user goals with default goals if user has no goals
  const displayGoals = user && goals.length > 0
    ? goals.map((g) => ({
        id: g.id,
        title: g.title,
        target: g.target_value || 0,
        current: g.current_value || 0,
        unit: g.unit || "",
        period: g.period,
      }))
    : defaultGoals;

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
          <PointsDisplay points={points} streak={streak} />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            💰 1000 pts = $1 discount on orders
          </p>
        </div>

        {/* Health Agent Chat Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            onClick={() => setShowChat(!showChat)}
            variant={showChat ? "default" : "outline"}
            className="w-full h-14"
          >
            <Bot className="h-5 w-5 mr-2" />
            {showChat ? "Hide Health Agent" : "Chat with My Health Agent"}
          </Button>
        </motion.div>

        {/* Health Agent Chat */}
        {showChat && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <HealthAgentChat />
          </motion.div>
        )}

        {/* Goals Carousel */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold">Your Goals</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowAddGoal(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Goal
            </Button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
            {displayGoals.map((goal, index) => (
              <GoalCard 
                key={goal.id || `default-${index}`}
                id={goal.id}
                title={goal.title}
                target={goal.target}
                current={goal.current}
                unit={goal.unit}
                period={goal.period}
                onDelete={goal.id ? handleDeleteGoal : undefined}
                onIncrement={goal.id ? handleGoalIncrement : undefined}
              />
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div>
          <h2 className="font-display text-lg font-bold mb-4">Health Tasks</h2>
          <Tabs defaultValue="daily">
            <TabsList className="mb-4">
              <TabsTrigger value="daily">Daily (+5)</TabsTrigger>
              <TabsTrigger value="weekly">Weekly (+10)</TabsTrigger>
              <TabsTrigger value="monthly">Monthly (+15)</TabsTrigger>
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
                  onComplete={() => toggleTask(task.id, task.type)}
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
                  onComplete={() => toggleTask(task.id, task.type)}
                />
              ))}
            </TabsContent>

            <TabsContent value="monthly" className="space-y-3">
              {monthlyTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  title={task.title}
                  description={task.description}
                  points={task.points}
                  icon={task.icon}
                  completed={completedTasks.includes(task.id)}
                  onComplete={() => toggleTask(task.id, task.type)}
                />
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Add Goal Dialog */}
        <AddGoalDialog
          open={showAddGoal}
          onOpenChange={setShowAddGoal}
          onGoalAdded={fetchGoals}
        />
      </div>
    </AppLayout>
  );
}
