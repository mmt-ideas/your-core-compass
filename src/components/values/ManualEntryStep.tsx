import { useState } from "react";
import { ArrowLeft, ArrowRight, Plus, X, GripVertical, HelpCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoredValue } from "@/hooks/useLocalStorage";
import { exampleValues, manualEntryPrompts } from "@/data/values";
import SpeechInput from "@/components/SpeechInput";
import { cn } from "@/lib/utils";

interface ManualEntryStepProps {
  existingValues: StoredValue[];
  onComplete: (values: StoredValue[]) => void;
  onBack: () => void;
}

const MAX_VALUES = 10;

const ManualEntryStep = ({ existingValues, onComplete, onBack }: ManualEntryStepProps) => {
  const [values, setValues] = useState<StoredValue[]>(
    existingValues.length > 0 ? existingValues : []
  );
  const [newValueName, setNewValueName] = useState("");
  const [newValueDescription, setNewValueDescription] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");

  const handleAddValue = () => {
    if (!newValueName.trim() || values.length >= MAX_VALUES) return;
    
    const newValue: StoredValue = {
      id: `manual-${Date.now()}`,
      name: newValueName.trim(),
      description: newValueDescription.trim() || undefined,
      isCustom: true,
    };
    
    setValues([...values, newValue]);
    setNewValueName("");
    setNewValueDescription("");
  };

  const handleAddSuggestion = (name: string) => {
    if (values.length >= MAX_VALUES) return;
    if (values.some(v => v.name.toLowerCase() === name.toLowerCase())) return;
    
    const newValue: StoredValue = {
      id: `suggestion-${Date.now()}`,
      name,
      isCustom: true,
    };
    
    setValues([...values, newValue]);
  };

  const handleRemoveValue = (id: string) => {
    setValues(values.filter(v => v.id !== id));
  };

  const handleStartEdit = (value: StoredValue) => {
    setEditingId(value.id);
    setEditingName(value.name);
    setEditingDescription(value.description || "");
  };

  const handleSaveEdit = () => {
    if (!editingId || !editingName.trim()) return;
    
    setValues(values.map(v => 
      v.id === editingId 
        ? { ...v, name: editingName.trim(), description: editingDescription.trim() || undefined }
        : v
    ));
    setEditingId(null);
    setEditingName("");
    setEditingDescription("");
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newValues = [...values];
    [newValues[index - 1], newValues[index]] = [newValues[index], newValues[index - 1]];
    setValues(newValues);
  };

  const handleMoveDown = (index: number) => {
    if (index === values.length - 1) return;
    const newValues = [...values];
    [newValues[index], newValues[index + 1]] = [newValues[index + 1], newValues[index]];
    setValues(newValues);
  };

  const canProceed = values.length >= 1 && values.length <= MAX_VALUES;

  return (
    <div className="space-y-8">
      {/* Speech-to-text encouragement */}
      <aside className="text-sm text-muted-foreground text-center p-4 bg-secondary rounded-lg">
        Prefer speaking? Tap the microphone icon to say your values out loud.
      </aside>

      {/* Counter */}
      <div 
        className="text-center p-4 rounded-lg bg-secondary"
        role="status"
        aria-live="polite"
      >
        <span className="text-2xl font-heading font-bold text-foreground">
          {values.length}
        </span>
        <span className="text-muted-foreground"> / {MAX_VALUES} values added</span>
      </div>

      {/* Current values list */}
      {values.length > 0 && (
        <section aria-labelledby="values-list-heading">
          <h2 id="values-list-heading" className="text-lg font-heading font-bold mb-4">
            Your values
          </h2>
          <ul className="space-y-3" role="list">
            {values.map((value, index) => (
              <li key={value.id}>
                {editingId === value.id ? (
                  <div className="calm-card space-y-3">
                    <SpeechInput
                      value={editingName}
                      onChange={setEditingName}
                      placeholder="Value name"
                      rows={1}
                    />
                    <SpeechInput
                      value={editingDescription}
                      onChange={setEditingDescription}
                      placeholder="Description (optional)"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="calm-card flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1 hover:bg-secondary rounded disabled:opacity-30"
                        aria-label={`Move ${value.name} up`}
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      </button>
                    </div>
                    
                    <div className="flex-1">
                      <button
                        onClick={() => handleStartEdit(value)}
                        className="text-left w-full"
                        aria-label={`Edit ${value.name}`}
                      >
                        <span className="font-medium block">{value.name}</span>
                        {value.description && (
                          <span className="text-sm text-muted-foreground">{value.description}</span>
                        )}
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">#{index + 1}</span>
                      <button
                        onClick={() => handleRemoveValue(value.id)}
                        className="p-2 hover:bg-destructive/10 rounded-full transition-colors"
                        aria-label={`Remove ${value.name}`}
                      >
                        <X className="h-4 w-4 text-destructive" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Add new value */}
      {values.length < MAX_VALUES && (
        <section className="calm-card space-y-4">
          <h2 className="font-heading font-bold">Add a value</h2>
          <div>
            <label htmlFor="value-name" className="block text-sm font-medium mb-2">
              Value name *
            </label>
            <SpeechInput
              id="value-name"
              value={newValueName}
              onChange={setNewValueName}
              placeholder="e.g., Integrity, Family, Growth..."
              rows={1}
            />
          </div>
          <div>
            <label htmlFor="value-desc" className="block text-sm font-medium mb-2">
              Description (optional)
            </label>
            <SpeechInput
              id="value-desc"
              value={newValueDescription}
              onChange={setNewValueDescription}
              placeholder="What does this value mean to you?"
              rows={2}
            />
          </div>
          <Button onClick={handleAddValue} disabled={!newValueName.trim()}>
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Add value
          </Button>
        </section>
      )}

      {/* Suggestions */}
      <section>
        <button
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Lightbulb className="h-4 w-4" aria-hidden="true" />
          {showSuggestions ? "Hide suggestions" : "Show example values"}
        </button>
        
        {showSuggestions && (
          <div className="mt-4 flex flex-wrap gap-2 animate-fade-in">
            {exampleValues.map(name => {
              const isAdded = values.some(v => v.name.toLowerCase() === name.toLowerCase());
              return (
                <button
                  key={name}
                  onClick={() => handleAddSuggestion(name)}
                  disabled={isAdded || values.length >= MAX_VALUES}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm border transition-all",
                    isAdded
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-background border-border hover:border-primary hover:text-primary"
                  )}
                >
                  {isAdded ? `✓ ${name}` : `+ ${name}`}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Reflection prompts */}
      <section>
        <button
          onClick={() => setShowPrompts(!showPrompts)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <HelpCircle className="h-4 w-4" aria-hidden="true" />
          {showPrompts ? "Hide prompts" : "Need help? Try a reflection prompt"}
        </button>
        
        {showPrompts && (
          <aside className="mt-4 calm-card bg-sand/30 border-sand animate-fade-in" role="complementary">
            <p className="text-muted-foreground italic mb-3">
              "{manualEntryPrompts[currentPromptIndex]}"
            </p>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setCurrentPromptIndex((currentPromptIndex + 1) % manualEntryPrompts.length)}
            >
              Another prompt
            </Button>
          </aside>
        )}
      </section>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-6 border-t border-border">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
          Back
        </Button>
        
        <Button onClick={() => onComplete(values)} disabled={!canProceed}>
          Save my core values
          <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};

export default ManualEntryStep;
