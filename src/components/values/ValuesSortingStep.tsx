import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Download, HelpCircle, ArrowRight, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { personalValues, getValueById, valuesReflectionPrompts } from "@/data/values";
import { StoredValue, ValueSorting } from "@/hooks/useLocalStorage";
import SpeechInput from "@/components/SpeechInput";
import { cn } from "@/lib/utils";

interface ValuesSortingStepProps {
  sorting: ValueSorting;
  onSortingChange: (sorting: ValueSorting) => void;
  customValues: StoredValue[];
  onCustomValuesChange: (values: StoredValue[]) => void;
  onComplete: () => void;
  onSkip: () => void;
  columns?: 2 | 3 | 4;
}

type SortCategory = "veryImportant" | "important" | "notImportantNow";

const categoryLabels: Record<SortCategory, string> = {
  veryImportant: "Very Important",
  important: "Important",
  notImportantNow: "Not Important Right Now",
};

const categoryDescriptions: Record<SortCategory, string> = {
  veryImportant: "These feel essential to who you are",
  important: "These matter, but may not be central right now",
  notImportantNow: "These don't resonate as strongly at this time",
};

const ValuesSortingStep = ({
  sorting,
  onSortingChange,
  customValues,
  onCustomValuesChange,
  onComplete,
  onSkip,
  columns = 2,
}: ValuesSortingStepProps) => {
  const [expandedValue, setExpandedValue] = useState<string | null>(null);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [showReflectionPrompt, setShowReflectionPrompt] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  // Get all values including custom ones
  const allValues = [...personalValues, ...customValues];
  
  // Get unsorted values
  const sortedIds = [...sorting.veryImportant, ...sorting.important, ...sorting.notImportantNow];
  const unsortedValues = allValues.filter(v => !sortedIds.includes(v.id));

  const handleSort = (valueId: string, category: SortCategory) => {
    const newSorting = { ...sorting };
    
    // Remove from all categories first
    Object.keys(newSorting).forEach(key => {
      newSorting[key as SortCategory] = newSorting[key as SortCategory].filter(id => id !== valueId);
    });
    
    // Add to new category
    newSorting[category] = [...newSorting[category], valueId];
    onSortingChange(newSorting);
  };

  const handleAddCustomValue = () => {
    if (!customName.trim()) return;
    
    const newValue: StoredValue = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      description: customDescription.trim() || undefined,
      isCustom: true,
    };
    
    onCustomValuesChange([...customValues, newValue]);
    setCustomName("");
    setCustomDescription("");
    setShowAddCustom(false);
  };

  const handleDownloadValues = () => {
    const content = allValues
      .map(v => `${v.name}: ${v.description || "No description"}`)
      .join("\n\n");
    
    const blob = new Blob([`Values List\n\n${content}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "values-list.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getValueInfo = (id: string) => {
    return getValueById(id) || customValues.find(v => v.id === id);
  };

  const canProceed = sorting.veryImportant.length > 0;

  // Generate grid class based on columns
  const gridClass = cn(
    "grid gap-3",
    columns === 2 && "sm:grid-cols-2",
    columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
    columns === 4 && "sm:grid-cols-2 lg:grid-cols-4"
  );

  return (
    <div className="space-y-8">
      {/* Progress indicator */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {sortedIds.length} of {allValues.length} values sorted
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleDownloadValues}>
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            Download list
          </Button>
        </div>
      </div>

      {/* Unsorted values */}
      {unsortedValues.length > 0 && (
        <section aria-labelledby="unsorted-heading">
          <h2 id="unsorted-heading" className="text-lg font-heading font-bold mb-4">
            Values to sort ({unsortedValues.length})
          </h2>
          <div className={gridClass}>
            {unsortedValues.map(value => (
              <ValueSortCard
                key={value.id}
                value={value}
                isExpanded={expandedValue === value.id}
                onToggleExpand={() => setExpandedValue(expandedValue === value.id ? null : value.id)}
                onSort={(category) => handleSort(value.id, category)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Sorted categories */}
      {(["veryImportant", "important", "notImportantNow"] as SortCategory[]).map(category => (
        sorting[category].length > 0 && (
          <section key={category} aria-labelledby={`${category}-heading`}>
            <h2 id={`${category}-heading`} className="text-lg font-heading font-bold mb-2">
              {categoryLabels[category]} ({sorting[category].length})
            </h2>
            <p className="text-sm text-muted-foreground mb-4">{categoryDescriptions[category]}</p>
            <div className={gridClass}>
              {sorting[category].map(id => {
                const value = getValueInfo(id);
                if (!value) return null;
                return (
                  <ValueSortCard
                    key={id}
                    value={value}
                    currentCategory={category}
                    isExpanded={expandedValue === id}
                    onToggleExpand={() => setExpandedValue(expandedValue === id ? null : id)}
                    onSort={(newCategory) => handleSort(id, newCategory)}
                  />
                );
              })}
            </div>
          </section>
        )
      ))}

      {/* Add custom value */}
      <section className="border-t border-border pt-6">
        {showAddCustom ? (
          <div className="calm-card space-y-4">
            <h3 className="font-heading font-bold">Add a custom value</h3>
            <div>
              <label htmlFor="custom-name" className="block text-sm font-medium mb-2">
                Value name *
              </label>
              <SpeechInput
                id="custom-name"
                value={customName}
                onChange={setCustomName}
                placeholder="Enter your value..."
                rows={1}
              />
            </div>
            <div>
              <label htmlFor="custom-desc" className="block text-sm font-medium mb-2">
                Description (optional)
              </label>
              <SpeechInput
                id="custom-desc"
                value={customDescription}
                onChange={setCustomDescription}
                placeholder="What does this value mean to you?"
                rows={2}
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAddCustomValue} disabled={!customName.trim()}>
                Add value
              </Button>
              <Button variant="ghost" onClick={() => setShowAddCustom(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setShowAddCustom(true)}>
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Add a custom value
          </Button>
        )}
      </section>

      {/* Reflection prompts */}
      {showReflectionPrompt && (
        <aside className="calm-card bg-sand/30 border-sand" role="complementary">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-slate-blue mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-medium text-foreground mb-2">Help me decide</p>
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
        <Button 
          variant="ghost" 
          onClick={() => setShowReflectionPrompt(!showReflectionPrompt)}
        >
          <HelpCircle className="h-4 w-4 mr-2" aria-hidden="true" />
          {showReflectionPrompt ? "Hide prompts" : "Help me decide"}
        </Button>
        
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onSkip}>
            <SkipForward className="h-4 w-4 mr-2" aria-hidden="true" />
            Skip to manual entry
          </Button>
          <Button onClick={onComplete} disabled={!canProceed}>
            Continue to selection
            <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Value card component for sorting
interface ValueSortCardProps {
  value: StoredValue | { id: string; name: string; description: string; category: string };
  currentCategory?: SortCategory;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSort: (category: SortCategory) => void;
}

const ValueSortCard = ({ value, currentCategory, isExpanded, onToggleExpand, onSort }: ValueSortCardProps) => {
  return (
    <div className="calm-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-2 text-left w-full"
            aria-expanded={isExpanded}
          >
            <span className="font-medium">{value.name}</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            )}
          </button>
          {isExpanded && value.description && (
            <p className="text-sm text-muted-foreground mt-2 animate-fade-in">
              {value.description}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-3" role="group" aria-label={`Sort ${value.name}`}>
        {(["veryImportant", "important", "notImportantNow"] as SortCategory[]).map(category => (
          <button
            key={category}
            onClick={() => onSort(category)}
            className={cn(
              "px-3 py-1.5 text-xs rounded-full border transition-all duration-200",
              currentCategory === category
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary hover:text-foreground"
            )}
            aria-pressed={currentCategory === category}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ValuesSortingStep;
