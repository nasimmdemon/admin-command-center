import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/CountUp";

export const CountUpDemo = () => {
  const [key, setKey] = useState(0);
  return (
    <div className="space-y-4">
      <CountUp key={key} end={100} suffix="%" className="text-4xl font-bold" />
      <Button variant="outline" size="sm" onClick={() => setKey((k) => k + 1)}>
        Restart animation
      </Button>
    </div>
  );
};
