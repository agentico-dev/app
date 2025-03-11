
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { type Plan } from "@/types/plans";
import { Check } from "lucide-react";

interface PlanSelectorProps {
  plans: Plan[];
  selectedPlan: string;
  onSelectPlan: (planId: string) => void;
}

export default function PlanSelector({ plans, selectedPlan, onSelectPlan }: PlanSelectorProps) {
  // Group plans by name to show different intervals
  const plansByName = plans.reduce((acc, plan) => {
    if (!acc[plan.name]) {
      acc[plan.name] = [];
    }
    acc[plan.name].push(plan);
    return acc;
  }, {} as Record<string, Plan[]>);

  return (
    <RadioGroup
      value={selectedPlan}
      onValueChange={onSelectPlan}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {Object.entries(plansByName).map(([name, planVariants]) => (
        <Card
          key={name}
          className={`relative cursor-pointer transition-all ${
            planVariants.some(p => p.id === selectedPlan)
              ? 'border-primary ring-2 ring-primary ring-offset-2'
              : 'hover:border-primary/50'
          }`}
        >
          <CardContent className="p-6">
            <RadioGroupItem
              value={planVariants[0].id}
              id={name}
              className="absolute right-4 top-4"
            />
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{name}</h3>
                <p className="text-sm text-muted-foreground">
                  {planVariants[0].description}
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold">$0</div>
                <div className="text-sm text-muted-foreground">During beta</div>
              </div>
              <ul className="space-y-2 text-sm">
                {planVariants[0].features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </RadioGroup>
  );
}
