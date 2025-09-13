"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Treatment {
  medicine: string;
  dose: string;
  date: string;
  withdrawal: string;
}

export default function TreatmentManager() {
  const [medicine, setMedicine] = useState("");
  const [dose, setDose] = useState("");
  const [date, setDate] = useState("");
  const [withdrawal, setWithdrawal] = useState("");
  const [treatmentHistory, setTreatmentHistory] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(false);

  // Handle treatment submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicine || !dose || !date || !withdrawal) return;

    const newTreatment: Treatment = {
      medicine,
      dose,
      date,
      withdrawal,
    };

    setTreatmentHistory([newTreatment, ...treatmentHistory]);

    // Reset form
    setMedicine("");
    setDose("");
    setDate("");
    setWithdrawal("");
  };

  // Simulate loading for history
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 600);
  }, [treatmentHistory.length]);

  return (
    <div className="space-y-6">
      {/* Treatment Input Form */}
      <Card className="border-2 shadow-md">
        <CardHeader>
          <CardTitle>Record New Treatment</CardTitle>
          <CardDescription>Log medicines and withdrawal periods for livestock</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="medicine">Medicine</Label>
              <Input
                id="medicine"
                placeholder="Enter medicine name"
                value={medicine}
                onChange={(e) => setMedicine(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dose">Dose</Label>
              <Input
                id="dose"
                placeholder="Enter dose"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="date">Treatment Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="withdrawal">Withdrawal Period</Label>
              <Input
                id="withdrawal"
                placeholder="e.g. 7 days"
                value={withdrawal}
                onChange={(e) => setWithdrawal(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Add Treatment
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Treatment History */}
      <Card className="border-2 shadow-md">
        <CardHeader>
          <CardTitle>Treatment History</CardTitle>
          <CardDescription>Recent treatments and withdrawal periods</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : treatmentHistory.length > 0 ? (
            <div className="space-y-3">
              {treatmentHistory.map((treatment, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/30 transition-colors"
                >
                  <div>
                    <p className="font-medium">
                      {treatment.medicine} – {treatment.dose}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Date: {new Date(treatment.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Withdrawal: {treatment.withdrawal}
                    </p>
                  </div>
                  <Badge
                    variant={
                      treatment.withdrawal.toLowerCase().includes("expired")
                        ? "secondary"
                        : "default"
                    }
                  >
                    {treatment.withdrawal}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No treatments recorded yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
