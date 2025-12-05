import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, AlertCircle, Save, History, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage, STORAGE_KEYS, StoredValue, DecisionReflection } from "@/hooks/useLocalStorage";
import { decisionAlignmentPrompts } from "@/data/values";
import SpeechInput from "@/components/SpeechInput";
import { cn } from "@/lib/utils";

type Step = "decision" | "values" | "prompts" | "summary" | "history";

const DecisionChecker = () => {
  const navigate = useNavigate();
  const [coreValues] = useLocalStorage<StoredValue[]>(STORAGE_KEYS.CORE_VALUES, []);
  const [reflections, setReflections] = useLocalStorage<DecisionReflection[]>(STORAGE_KEYS.DECISION_REFLECTIONS, []);
  
  const [currentStep, setCurrentStep] = useState<Step>("decision");
  const [decision, setDecision] = useState("");
  const [selectedValueIds, setSelectedValueIds] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});

  // Check if values are set up
  if (coreValues.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-12 animate-fade-in">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
        <h1 className="text-2xl font-heading font-bold mb-4">Set up your values first</h1>
        <p className="text-muted-foreground mb-6">
          Before checking decisions, you'll need to identify your core values.
        </p>
        <Button onClick={() => navigate("/values")}>
          Go to Values Clarity
          <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
        </Button>
      </div>
    );
  }

  const handleToggleValue = (id: string) => {
    setSelectedValueIds(prev => 
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const handleResponseChange = (prompt: string, value: string) => {
    setResponses(prev => ({ ...prev, [prompt]: value }));
  };

  const generateSummary = (): string => {
    const selectedValues = coreValues.filter(v => selectedValueIds.includes(v.id));
    const valueNames = selectedValues.map(v => v.name).join(", ");
    
    return `You're considering: "${decision}"\n\nYou connected this decision to these values: ${valueNames}.\n\nThrough your reflection, you explored how this choice relates to what matters most to you. Take a moment to notice any insights that emerged.`;
  };

  const handleSaveReflection = () => {
    const reflection: DecisionReflection = {
      id: `decision-${Date.now()}`,
      decision,
      selectedValues: selectedValueIds,
      responses,
      summary: generateSummary(),
      timestamp: new Date().toISOString(),
    };
    
    setReflections([reflection, ...reflections]);
    
    // Reset for new reflection
    setDecision("");
    setSelectedValueIds([]);
    setResponses({});
    setCurrentStep("history");
  };

  const handleNewReflection = () => {
    setDecision("");
    setSelectedValueIds([]);
    setResponses({});
    setCurrentStep("decision");
  };

  // Get prompts based on selected values count
  const activePrompts = decisionAlignmentPrompts.slice(0, Math.min(5, 3 + selectedValueIds.length));

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <header className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3">
          Decision-Values Alignment
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          {currentStep === "decision" && "What decision or choice are you considering?"}
          {currentStep === "values" && "Which of your values relate to this decision?"}
          {currentStep === "prompts" && "Take time with these reflection prompts."}
          {currentStep === "summary" && "Here's a summary of your reflection."}
          {currentStep === "history" && "Your saved decision reflections."}
        </p>
      </header>

      {/* View History Button */}
      {currentStep !== "history" && reflections.length > 0 && (
        <div className="text-right mb-6">
          <Button variant="ghost" size="sm" onClick={() => setCurrentStep("history")}>
            <History className="h-4 w-4 mr-2" aria-hidden="true" />
            View history ({reflections.length})
          </Button>
        </div>
      )}

      {/* Step 1: Enter decision */}
      {currentStep === "decision" && (
        <div className="space-y-6">
          <SpeechInput
            value={decision}
            onChange={setDecision}
            placeholder="Describe the decision you're facing... (type or speak)"
            label="Your decision"
            rows={4}
            id="decision-input"
          />
          
          <div className="flex justify-end">
            <Button 
              onClick={() => setCurrentStep("values")} 
              disabled={!decision.trim()}
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Select values */}
      {currentStep === "values" && (
        <div className="space-y-6">
          <div className="calm-card bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Your decision:</p>
            <p className="font-medium">{decision}</p>
          </div>
          
          <fieldset>
            <legend className="text-lg font-medium mb-4">
              Select the values that relate to this decision
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {coreValues.map(value => (
                <button
                  key={value.id}
                  onClick={() => handleToggleValue(value.id)}
                  className={cn(
                    "calm-card text-left transition-all",
                    selectedValueIds.includes(value.id) && "ring-2 ring-primary bg-primary/5"
                  )}
                  aria-pressed={selectedValueIds.includes(value.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                        selectedValueIds.includes(value.id)
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border"
                      )}
                      aria-hidden="true"
                    >
                      {selectedValueIds.includes(value.id) && <Check className="h-4 w-4" />}
                    </div>
                    <span className="font-medium">{value.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </fieldset>
          
          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setCurrentStep("decision")}>
              Back
            </Button>
            <Button 
              onClick={() => setCurrentStep("prompts")} 
              disabled={selectedValueIds.length === 0}
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Reflection prompts */}
      {currentStep === "prompts" && (
        <div className="space-y-8">
          <div className="calm-card bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Reflecting on:</p>
            <p className="font-medium">{decision}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {coreValues
                .filter(v => selectedValueIds.includes(v.id))
                .map(v => (
                  <span key={v.id} className="value-chip selected text-xs">
                    {v.name}
                  </span>
                ))}
            </div>
          </div>
          
          {activePrompts.map((prompt, index) => (
            <div key={prompt} className="space-y-3" style={{ animationDelay: `${index * 100}ms` }}>
              <p className="font-medium text-foreground">{prompt}</p>
              <SpeechInput
                value={responses[prompt] || ""}
                onChange={(value) => handleResponseChange(prompt, value)}
                placeholder="Take your time to reflect..."
                rows={3}
              />
            </div>
          ))}
          
          <div className="flex justify-between pt-6">
            <Button variant="ghost" onClick={() => setCurrentStep("values")}>
              Back
            </Button>
            <Button onClick={() => setCurrentStep("summary")}>
              See summary
              <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Summary */}
      {currentStep === "summary" && (
        <div className="space-y-6">
          <div className="calm-card">
            <h2 className="font-heading font-bold mb-4">Your Reflection Summary</h2>
            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
              {generateSummary()}
            </p>
          </div>
          
          {Object.entries(responses).filter(([_, v]) => v.trim()).length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Your reflections:</h3>
              {Object.entries(responses)
                .filter(([_, v]) => v.trim())
                .map(([prompt, response]) => (
                  <div key={prompt} className="calm-card bg-secondary/30">
                    <p className="text-sm text-muted-foreground italic mb-2">{prompt}</p>
                    <p>{response}</p>
                  </div>
                ))}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-between pt-6">
            <Button variant="ghost" onClick={() => setCurrentStep("prompts")}>
              Back to prompts
            </Button>
            <Button onClick={handleSaveReflection}>
              <Save className="h-4 w-4 mr-2" aria-hidden="true" />
              Save reflection
            </Button>
          </div>
        </div>
      )}

      {/* History view */}
      {currentStep === "history" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-heading font-bold">Saved Reflections</h2>
            <Button onClick={handleNewReflection}>
              New reflection
            </Button>
          </div>
          
          {reflections.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No saved reflections yet.
            </p>
          ) : (
            <ul className="space-y-4">
              {reflections.map(reflection => (
                <li key={reflection.id} className="calm-card">
                  <div className="flex items-start gap-3 text-sm text-muted-foreground mb-2">
                    <Clock className="h-4 w-4 mt-0.5" aria-hidden="true" />
                    <time dateTime={reflection.timestamp}>
                      {new Date(reflection.timestamp).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </time>
                  </div>
                  <p className="font-medium mb-3">{reflection.decision}</p>
                  <div className="flex flex-wrap gap-2">
                    {reflection.selectedValues.map(id => {
                      const value = coreValues.find(v => v.id === id);
                      return value ? (
                        <span key={id} className="value-chip text-xs">
                          {value.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default DecisionChecker;
