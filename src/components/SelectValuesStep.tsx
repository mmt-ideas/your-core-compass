import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ValueCard from "@/components/ValueCard";
import { personalValues, Value } from "@/data/values";
import { ArrowRight, Info } from "lucide-react";

interface SelectValuesStepProps {
  selectedValues: string[];
  onSelect: (valueId: string) => void;
  onNext: () => void;
}

const SelectValuesStep = ({ selectedValues, onSelect, onNext }: SelectValuesStepProps) => {
  const [shuffledValues, setShuffledValues] = useState<Value[]>([]);

  useEffect(() => {
    // Shuffle values on mount for variety
    const shuffled = [...personalValues].sort(() => Math.random() - 0.5);
    setShuffledValues(shuffled);
  }, []);

  const categories = [...new Set(shuffledValues.map(v => v.category))];

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
          Select Values That Resonate
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Review the values below and select all that feel important to you. 
          Don't overthink it—go with your initial instinct.
        </p>
      </div>

      <div className="glass-panel p-4 mb-6 flex items-center gap-3">
        <Info className="w-5 h-5 text-primary flex-shrink-0" />
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{selectedValues.length}</span> values selected
          {selectedValues.length < 10 && " — Select at least 10 to continue"}
        </p>
      </div>

      <div className="space-y-8 mb-8">
        {categories.map(category => {
          const categoryValues = shuffledValues.filter(v => v.category === category);
          return (
            <div key={category}>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {category}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoryValues.map(value => (
                  <ValueCard
                    key={value.id}
                    value={value}
                    selected={selectedValues.includes(value.id)}
                    onClick={() => onSelect(value.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end sticky bottom-4">
        <Button
          variant="hero"
          size="lg"
          onClick={onNext}
          disabled={selectedValues.length < 10}
          className="gap-2"
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default SelectValuesStep;
