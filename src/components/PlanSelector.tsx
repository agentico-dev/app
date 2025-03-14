
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { type Plan } from "@/types/plans";
import { Check } from "lucide-react";

interface PlanSelectorProps {
  plans?: Plan[];
  selectedPlan: string;
  selectedPlanId?: string;  // Added for backward compatibility
  onSelectPlan: (planId: string) => void;
}

export default function PlanSelector({ 
  plans = [], 
  selectedPlan, 
  selectedPlanId, 
  onSelectPlan 
}: PlanSelectorProps) {
  // Use selectedPlanId as a fallback if selectedPlan is not provided
  const activePlanId = selectedPlan || selectedPlanId || '';

  // If plans array is empty, provide default plans
  const plansToUse = plans.length > 0 ? plans : [
    {
      id: 'free',
      name: 'Free',
      description: 'Get started with basic features',
      price: 0,
      interval: 'monthly' as const,
      features: ['5 projects', 'Basic analytics', 'Community support'],
      active: true
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For professional developers and teams',
      price: 0,
      interval: 'monthly' as const,
      features: ['Unlimited projects', 'Advanced analytics', 'Priority support', 'Custom integrations'],
      active: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations with complex needs',
      price: 0,
      interval: 'monthly' as const,
      features: ['Unlimited everything', 'Dedicated support', 'Custom development', 'SLA guarantees', 'Enterprise SSO'],
      active: true
    }
  ];

  // Group plans by name to show different intervals
  const plansByName = plansToUse.reduce((acc, plan) => {
    if (!acc[plan.name]) {
      acc[plan.name] = [];
    }
    acc[plan.name].push(plan);
    return acc;
  }, {} as Record<string, Plan[]>);

  return (
    <RadioGroup
      value={activePlanId}
      onValueChange={onSelectPlan}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {Object.entries(plansByName).map(([name, planVariants]) => (
        <Card
          key={name}
          className={`relative cursor-pointer transition-all ${
            planVariants.some(p => p.id === activePlanId)
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
