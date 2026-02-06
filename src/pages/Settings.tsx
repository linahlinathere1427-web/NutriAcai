import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Bell, Moon, Sun, Shield, MapPin, Globe, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { NutriCard } from "@/components/ui/card-nutriacai";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface SettingsState {
  notifications: {
    push: boolean;
    email: boolean;
    orderUpdates: boolean;
    promotions: boolean;
  };
  privacy: {
    locationAccess: boolean;
    dataSharing: boolean;
    analytics: boolean;
  };
  display: {
    darkMode: boolean;
    language: string;
    soundEffects: boolean;
  };
}

const defaultSettings: SettingsState = {
  notifications: {
    push: true,
    email: true,
    orderUpdates: true,
    promotions: false,
  },
  privacy: {
    locationAccess: true,
    dataSharing: false,
    analytics: true,
  },
  display: {
    darkMode: false,
    language: "en",
    soundEffects: true,
  },
};

export default function Settings() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const { currency, setCurrency } = useCart();

  useEffect(() => {
    const saved = localStorage.getItem("nutriacai_settings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse settings:", e);
      }
    }
  }, []);

  const updateSetting = <K extends keyof SettingsState>(
    category: K,
    key: keyof SettingsState[K],
    value: boolean | string
  ) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value,
      },
    };
    setSettings(newSettings);
    localStorage.setItem("nutriacai_settings", JSON.stringify(newSettings));
    toast.success("Settings updated");
  };

  const toggleDarkMode = (enabled: boolean) => {
    updateSetting("display", "darkMode", enabled);
    if (enabled) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <AppLayout showNav={false}>
      <div className="px-5 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <Link to="/profile">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="font-display text-2xl font-bold">Settings</h1>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="font-display font-semibold mb-3 flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </h2>
          <NutriCard variant="elevated" className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="push" className="cursor-pointer">Push Notifications</Label>
              <Switch
                id="push"
                checked={settings.notifications.push}
                onCheckedChange={(v) => updateSetting("notifications", "push", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notif" className="cursor-pointer">Email Notifications</Label>
              <Switch
                id="email-notif"
                checked={settings.notifications.email}
                onCheckedChange={(v) => updateSetting("notifications", "email", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="order-updates" className="cursor-pointer">Order Updates</Label>
              <Switch
                id="order-updates"
                checked={settings.notifications.orderUpdates}
                onCheckedChange={(v) => updateSetting("notifications", "orderUpdates", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="promotions" className="cursor-pointer">Promotional Offers</Label>
              <Switch
                id="promotions"
                checked={settings.notifications.promotions}
                onCheckedChange={(v) => updateSetting("notifications", "promotions", v)}
              />
            </div>
          </NutriCard>
        </motion.div>

        {/* Display */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="font-display font-semibold mb-3 flex items-center gap-2">
            {settings.display.darkMode ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
            Display
          </h2>
          <NutriCard variant="elevated" className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="cursor-pointer">Dark Mode</Label>
              <Switch
                id="dark-mode"
                checked={settings.display.darkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sounds" className="cursor-pointer flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Sound Effects
              </Label>
              <Switch
                id="sounds"
                checked={settings.display.soundEffects}
                onCheckedChange={(v) => updateSetting("display", "soundEffects", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Currency
              </Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AED">AED</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="SAR">SAR</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </NutriCard>
        </motion.div>

        {/* Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="font-display font-semibold mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Privacy
          </h2>
          <NutriCard variant="elevated" className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="location" className="cursor-pointer flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location Access
              </Label>
              <Switch
                id="location"
                checked={settings.privacy.locationAccess}
                onCheckedChange={(v) => updateSetting("privacy", "locationAccess", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="data-sharing" className="cursor-pointer">Data Sharing</Label>
              <Switch
                id="data-sharing"
                checked={settings.privacy.dataSharing}
                onCheckedChange={(v) => updateSetting("privacy", "dataSharing", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics" className="cursor-pointer">Usage Analytics</Label>
              <Switch
                id="analytics"
                checked={settings.privacy.analytics}
                onCheckedChange={(v) => updateSetting("privacy", "analytics", v)}
              />
            </div>
          </NutriCard>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <NutriCard className="p-4 text-center">
            <p className="font-semibold">NutriAcai</p>
            <p className="text-sm text-muted-foreground">Version 1.0.0</p>
          </NutriCard>
        </motion.div>
      </div>
    </AppLayout>
  );
}
