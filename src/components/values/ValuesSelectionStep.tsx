import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getValueById, valuesReflectionPrompts } from "@/data/values";
import { StoredValue, ValueSorting } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

interface ValuesSelectionStepProps {
  sorting: ValueSorting;
  customValues: StoredValue[];
  onComplete: (selected: StoredValue[]) => void;
  onBack: () => void;
}

const MAX_VALUES = 10;

const ValuesSelectionStep = ({
  sorting,
  customValues,
  onComplete,
  onBack,
}: ValuesSelectionStepProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showReflectionPrompt, setShowReflectionPrompt] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  // Combine very important and important values for selection
  const candidateIds = [...sorting.veryImportant, ...sorting.important];
  
  const getValueInfo = (id: string): StoredValue | null => {
    const predefined = getValueById(id);
    if (predefined) {
      return { id: predefined.id, name: predefined.name, description: predefined.description };
    }
    return customValues.find(v => v.id === id) || null;
  };

  const handleToggleValue = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(v => v !== id);
      }
      if (prev.length >= MAX_VALUES) {
        return prev; // Soft prevent beyond max
      }
      return [...prev, id];
    });
  };

  const handleComplete = () => {
    const selectedValues = selectedIds
      .map(getValueInfo)
      .filter((v): v is StoredValue => v !== null);
    onComplete(selectedValues);
  };

  const canProceed = selectedIds.length >= 1 && selectedIds.length <= MAX_VALUES;

  return (
    <div className="space-y-8">
      {/* Counter */}
      <div 
        className="text-center p-4 rounded-lg bg-secondary"
        role="status"
        aria-live="polite"
      >
        <span className="text-2xl font-heading font-bold text-foreground">
          {selectedIds.length}
        </span>
        <span className="text-muted-foreground"> / {MAX_VALUES} values selected</span>
        {selectedIds.length >= MAX_VALUES && (
          <p className="text-sm text-muted-foreground mt-1">
            Maximum reached. Deselect a value to choose a different one.
          </p>
        )}
      </div>

      {/* Very Important section */}
      {sorting.veryImportant.length > 0 && (
        <section aria-labelledby="very-important-heading">
          <h2 id="very-important-heading" className="text-lg font-heading font-bold mb-4">
            Your very important values
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sorting.veryImportant.map(id => {
              const value = getValueInfo(id);
              if (!value) return null;
              return (
                <SelectableValueCard
                  key={id}
                  value={value}
                  isSelected={selectedIds.includes(id)}
                  onToggle={() => handleToggleValue(id)}
                  disabled={!selectedIds.includes(id) && selectedIds.length >= MAX_VALUES}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Important section */}
      {sorting.important.length > 0 && (
        <section aria-labelledby="important-heading">
          <h2 id="important-heading" className="text-lg font-heading font-bold mb-4">
            Your important values
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sorting.important.map(id => {
              const value = getValueInfo(id);
              if (!value) return null;
              return (
                <SelectableValueCard
                  key={id}
                  value={value}
                  isSelected={selectedIds.includes(id)}
                  onToggle={() => handleToggleValue(id)}
                  disabled={!selectedIds.includes(id) && selectedIds.length >= MAX_VALUES}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Reflection prompts */}
      {showReflectionPrompt && (
        <aside className="calm-card bg-sand/30 border-sand" role="complementary">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-slate-blue mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-medium text-foreground mb-2">Reflection prompt</p>
              <p className="text-muted-foreground italic">
                "{valuesReflectionPrompts[currentPromptIndex]}"
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2"
                onClick={() => setCurrentPromptIndex((currentPromptIndex + 1) % valuesReflectionPrompts.length)}
              >
                Another prompt
              </Button>
            </div>
          </div>
        </aside>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-6 border-t border-border">
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Back to sorting
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setShowReflectionPrompt(!showReflectionPrompt)}
          >
            <HelpCircle className="h-4 w-4 mr-2" aria-hidden="true" />
            {showReflectionPrompt ? "Hide prompts" : "Help me decide"}
          </Button>
        </div>
        
        <Button onClick={handleComplete} disabled={!canProceed}>
          Save my core values
          <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};

interface SelectableValueCardProps {
  value: StoredValue;
  isSelected: boolean;
  onToggle: () => void;
  disabled: boolean;
}

const SelectableValueCard = ({ value, isSelected, onToggle, disabled }: SelectableValueCardProps) => {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "calm-card text-left transition-all duration-300 w-full",
        isSelected && "ring-2 ring-primary bg-primary/5",
        disabled && !isSelected && "opacity-50 cursor-not-allowed"
      )}
      aria-pressed={isSelected}
      aria-label={`${value.name}: ${isSelected ? "selected" : "not selected"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <span className="font-medium block">{value.name}</span>
          {value.description && (
            <span className="text-sm text-muted-foreground mt-1 block">
              {value.description}
            </span>
          )}
        </div>
        <div
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
            isSelected
              ? "bg-primary border-primary text-primary-foreground"
              : "border-border"
          )}
          aria-hidden="true"
        >
          {isSelected && <Check className="h-4 w-4" />}
        </div>
      </div>
    </button>
  );
};

export default ValuesSelectionStep;
