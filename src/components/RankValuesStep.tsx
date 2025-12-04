import { Button } from "@/components/ui/button";
import { getValueById } from "@/data/values";
import { ArrowRight, ArrowLeft, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface RankValuesStepProps {
  rankedValues: string[];
  onReorder: (newOrder: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const RankValuesStep = ({ rankedValues, onReorder, onNext, onBack }: RankValuesStepProps) => {
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...rankedValues];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    onReorder(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === rankedValues.length - 1) return;
    const newOrder = [...rankedValues];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    onReorder(newOrder);
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
          Rank Your Values
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Now prioritize your top 5 values from most important (#1) to least important (#5). 
          Use the arrows to reorder them.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-3 mb-8">
        {rankedValues.map((valueId, index) => {
          const value = getValueById(valueId);
          if (!value) return null;

          return (
            <div
              key={value.id}
              className={cn(
                "glass-panel p-4 flex items-center gap-4 animate-scale-in",
                "hover:border-primary/30 transition-all duration-300"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">
                  {index + 1}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {value.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {value.description}
                </p>
              </div>
              
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className={cn(
                    "p-1.5 rounded hover:bg-muted transition-colors",
                    index === 0 && "opacity-30 cursor-not-allowed"
                  )}
                  aria-label="Move up"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === rankedValues.length - 1}
                  className={cn(
                    "p-1.5 rounded hover:bg-muted transition-colors",
                    index === rankedValues.length - 1 && "opacity-30 cursor-not-allowed"
                  )}
                  aria-label="Move down"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between sticky bottom-4">
        <Button variant="outline" size="lg" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>
        <Button variant="hero" size="lg" onClick={onNext} className="gap-2">
          See My Results
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default RankValuesStep;
