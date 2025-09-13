"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TreatmentManager from "@/components/treaments/TreatmentManager";
import { Cloud, AlertTriangle, Activity } from "lucide-react";
import { User } from "@/lib/types";
import { Language } from "@/lib/i18n";

interface DashboardProps {
  user: User;
  onLogout: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Dashboard({ user, onLogout, language, onLanguageChange }: DashboardProps) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Farm Dashboard</h1>
        <button
          onClick={onLogout}
          className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <p className="text-muted-foreground">
        Welcome back, <span className="font-semibold">{user?.name || "User"}</span> 👋  
        (Language: {language.toUpperCase()})
      </p>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livestock Count</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+5 since last week</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Treatments</CardTitle>
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Withdrawal in progress</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Check treatment compliance</p>
          </CardContent>
        </Card>
      </div>

      {/* Weather & Alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Weather Conditions</CardTitle>
            <CardDescription>Helps decide feeding & treatment schedules</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold">Sunny, 32°C</p>
              <p className="text-muted-foreground text-sm">Humidity: 55%</p>
            </div>
            <Badge>Stable</Badge>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Farm Alerts</CardTitle>
            <CardDescription>Recent alerts & notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Withdrawal period ending soon (Cow #23)</span>
                <Badge variant="secondary">Due</Badge>
              </li>
              <li className="flex justify-between">
                <span>Low feed stock warning</span>
                <Badge variant="destructive">Critical</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Treatment Manager */}
      <TreatmentManager />
    </div>
  );
}