import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

const faqCategories = [
  {
    title: "Getting Started",
    questions: [
      {
        q: "How do I create an account?",
        a: "Simply tap 'Get Started' on the home page and enter your email address. You'll receive a confirmation email to verify your account.",
      },
      {
        q: "Is NutriAcai free to use?",
        a: "Yes! NutriAcai is completely free to download and use. You can earn points by completing health tasks and redeem them for discounts on food orders.",
      },
      {
        q: "What health tasks are available?",
        a: "We offer daily, weekly, and monthly health tasks including water intake tracking, step goals, sleep tracking, and more. Each completed task earns you reward points.",
      },
    ],
  },
  {
    title: "Points & Rewards",
    questions: [
      {
        q: "How do I earn points?",
        a: "You earn points by completing health tasks, maintaining streaks, achieving goals, and making healthy food orders. Points vary based on task difficulty.",
      },
      {
        q: "How can I redeem my points?",
        a: "Points can be redeemed for discounts on food orders from our partner restaurants. Go to the Order tab and apply your points at checkout.",
      },
      {
        q: "Do points expire?",
        a: "Points are valid for 12 months from the date earned. We'll notify you before any points are about to expire.",
      },
    ],
  },
  {
    title: "Food Ordering",
    questions: [
      {
        q: "Which restaurants are available?",
        a: "We partner with healthy restaurants across Dubai including The Green Kitchen, Acai Nation, Mediterranean Bites, and more. All menus are curated for health-conscious choices.",
      },
      {
        q: "How long does delivery take?",
        a: "Delivery times vary by restaurant and your location, typically ranging from 15-40 minutes. You can see estimated delivery times for each restaurant.",
      },
      {
        q: "Can I order unhealthy food?",
        a: "No, NutriAcai exclusively features healthy food options. This is by design to help you maintain your wellness goals while enjoying delicious meals.",
      },
    ],
  },
  {
    title: "Payment & Security",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. All transactions are encrypted and secure.",
      },
      {
        q: "Is my payment information secure?",
        a: "Absolutely. We use industry-standard encryption and never store your full card details. All payments are processed through secure, PCI-compliant systems.",
      },
      {
        q: "Can I save multiple payment methods?",
        a: "Yes, you can save multiple cards and PayPal accounts. Set a default method for faster checkout.",
      },
    ],
  },
  {
    title: "AI Health Plans",
    questions: [
      {
        q: "How does the AI create my health plan?",
        a: "Our AI analyzes your goals, current habits, and preferences to create personalized daily, weekly, and monthly plans tailored to your lifestyle.",
      },
      {
        q: "Can I modify my AI-generated plan?",
        a: "Yes! Your plan is fully customizable. You can adjust tasks, set new goals, and the AI will adapt to your changes.",
      },
      {
        q: "How accurate is the AI?",
        a: "Our AI is trained on nutrition and fitness best practices. However, always consult healthcare professionals for specific medical advice.",
      },
    ],
  },
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = faqCategories.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  return (
    <AppLayout showNav={false}>
      <div className="px-5 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold">FAQ</h1>
            <p className="text-sm text-muted-foreground">Find answers to common questions</p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {filteredCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <h2 className="font-display font-bold text-lg mb-3 text-primary">
                {category.title}
              </h2>
              <Accordion type="single" collapsible className="space-y-2">
                {category.questions.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`${category.title}-${index}`}
                    className="border rounded-xl px-4 bg-card"
                  >
                    <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center p-6 rounded-2xl bg-muted"
        >
          <h3 className="font-display font-bold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">
            Our support team is here to help you
          </p>
          <Button variant="hero">
            Contact Support
          </Button>
        </motion.div>
      </div>
    </AppLayout>
  );
}
