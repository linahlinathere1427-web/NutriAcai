import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Heart, ChefHat, ShoppingBag, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const features = [
  {
    icon: Heart,
    title: "Health Tracking",
    description: "Daily tasks, goals & AI-powered personalized plans",
  },
  {
    icon: ChefHat,
    title: "Healthy Recipes",
    description: "Quick, nutritious meals based on your ingredients",
  },
  {
    icon: ShoppingBag,
    title: "Smart Ordering",
    description: "Healthy food delivery from Dubai's best restaurants",
  },
];

const benefits = [
  "Earn points for completing health tasks",
  "Redeem rewards for discounts & free meals",
  "AI creates personalized wellness plans",
  "Only healthy food options available",
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-2">
              <div className="gradient-primary h-10 w-10 rounded-xl flex items-center justify-center">
                <span className="text-xl">🫐</span>
              </div>
              <span className="font-display text-xl font-bold">NutriAcai</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/faq">
                <Button variant="ghost" size="sm">
                  FAQ
                </Button>
              </Link>
              {user ? (
                <Link to="/dashboard">
                  <Button variant="hero" size="sm">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button variant="hero" size="sm">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 mb-6">
              <Star className="h-4 w-4 text-gold-reward fill-gold-reward" />
              <span className="text-sm font-medium">Your wellness journey starts here</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
              Your Health.{" "}
              <span className="text-gradient">Rewarded.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              Track your health, discover delicious recipes, and order healthy food — all while earning rewards for making better choices.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <Button variant="hero" size="xl">
                  Start Free Today
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/faq">
                <Button variant="outline" size="xl">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Everything you need to live healthier
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Three powerful tabs designed to transform your daily wellness routine
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="gradient-card rounded-2xl p-6 shadow-card hover:shadow-lg transition-shadow"
              >
                <div className="gradient-primary h-14 w-14 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl font-bold mb-6">
                Get rewarded for healthy choices
              </h2>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="gradient-primary rounded-3xl p-8 text-primary-foreground"
            >
              <div className="text-center">
                <Star className="h-16 w-16 mx-auto mb-4 fill-current" />
                <h3 className="font-display text-2xl font-bold mb-2">
                  Earn Points Daily
                </h3>
                <p className="opacity-90 mb-6">
                  Complete tasks, hit goals, and redeem for exclusive rewards
                </p>
                <div className="text-5xl font-display font-bold">2,450+</div>
                <p className="text-sm opacity-80 mt-1">average points earned weekly</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="container mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to transform your health?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of users in Dubai making healthier choices every day
          </p>
          <Link to="/auth">
            <Button variant="hero" size="xl">
              Get Started — It's Free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="gradient-primary h-8 w-8 rounded-lg flex items-center justify-center">
              <span className="text-sm">🫐</span>
            </div>
            <span className="font-display font-bold">NutriAcai</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/faq" className="hover:text-foreground">FAQ</Link>
            <Link to="/payment" className="hover:text-foreground">Payment</Link>
            <span>© 2024 NutriAcai</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
