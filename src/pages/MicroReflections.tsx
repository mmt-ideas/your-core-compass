import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Save, Clock, Tag, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage, STORAGE_KEYS, StoredValue, MicroReflection } from "@/hooks/useLocalStorage";
import { microReflectionPrompts } from "@/data/values";
import SpeechInput from "@/components/SpeechInput";
import { cn } from "@/lib/utils";

const MicroReflections = () => {
  const navigate = useNavigate();
  const [coreValues] = useLocalStorage<StoredValue[]>(STORAGE_KEYS.CORE_VALUES, []);
  const [reflections, setReflections] = useLocalStorage<MicroReflection[]>(STORAGE_KEYS.MICRO_REFLECTIONS, []);
  
  const [currentPrompt, setCurrentPrompt] = useState(() => 
    microReflectionPrompts[Math.floor(Math.random() * microReflectionPrompts.length)]
  );
  const [response, setResponse] = useState("");
  const [taggedValue, setTaggedValue] = useState<string | undefined>();
  const [showHistory, setShowHistory] = useState(false);

  // Check if values are set up
  if (coreValues.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-12 animate-fade-in">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
        <h1 className="text-2xl font-heading font-bold mb-4">Set up your values first</h1>
        <p className="text-muted-foreground mb-6">
          Micro reflections work best when connected to your core values.
        </p>
        <Button onClick={() => navigate("/values")}>
          Go to Values Clarity
          <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
        </Button>
      </div>
    );
  }

  const handleNewPrompt = () => {
    const otherPrompts = microReflectionPrompts.filter(p => p !== currentPrompt);
    setCurrentPrompt(otherPrompts[Math.floor(Math.random() * otherPrompts.length)]);
  };

  const handleSave = () => {
    if (!response.trim()) return;
    
    const reflection: MicroReflection = {
      id: `micro-${Date.now()}`,
      prompt: currentPrompt,
      response: response.trim(),
      taggedValue,
      timestamp: new Date().toISOString(),
    };
    
    setReflections([reflection, ...reflections]);
    setResponse("");
    setTaggedValue(undefined);
    handleNewPrompt();
  };

  const getValueName = (id: string) => {
    return coreValues.find(v => v.id === id)?.name || id;
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <header className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3">
          Micro Reflections
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Brief moments of awareness to notice your values in daily life.
        </p>
      </header>

      {/* Toggle between new reflection and history */}
      <div className="flex justify-center gap-2 mb-8">
        <Button
          variant={!showHistory ? "default" : "outline"}
          onClick={() => setShowHistory(false)}
        >
          New reflection
        </Button>
        <Button
          variant={showHistory ? "default" : "outline"}
          onClick={() => setShowHistory(true)}
        >
          History ({reflections.length})
        </Button>
      </div>

      {!showHistory ? (
        <div className="space-y-8">
          {/* Prompt card */}
          <div className="calm-card bg-sand/30 border-sand text-center">
            <p className="text-xl font-heading leading-relaxed text-foreground mb-4">
              "{currentPrompt}"
            </p>
            <Button variant="ghost" size="sm" onClick={handleNewPrompt}>
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
              Different prompt
            </Button>
          </div>

          {/* Response input */}
          <div>
            <SpeechInput
              value={response}
              onChange={setResponse}
              placeholder="Take a moment to reflect... (type or speak)"
              label="Your reflection"
              rows={5}
              id="reflection-input"
            />
          </div>

          {/* Tag a value (optional) */}
          <fieldset>
            <legend className="flex items-center gap-2 text-sm font-medium mb-3">
              <Tag className="h-4 w-4" aria-hidden="true" />
              Tag a value (optional)
            </legend>
            <div className="flex flex-wrap gap-2">
              {coreValues.map(value => (
                <button
                  key={value.id}
                  onClick={() => setTaggedValue(taggedValue === value.id ? undefined : value.id)}
                  className={cn(
                    "value-chip",
                    taggedValue === value.id && "selected"
                  )}
                  aria-pressed={taggedValue === value.id}
                >
                  {value.name}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Save button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={!response.trim()}>
              <Save className="h-4 w-4 mr-2" aria-hidden="true" />
              Save reflection
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {reflections.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No reflections saved yet. Start with a new reflection above.
            </p>
          ) : (
            <ul className="space-y-4" role="list">
              {reflections.map(reflection => (
                <li key={reflection.id} className="calm-card">
                  <div className="flex items-start gap-3 text-sm text-muted-foreground mb-3">
                    <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
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
                  
                  <p className="text-sm text-muted-foreground italic mb-2">
                    "{reflection.prompt}"
                  </p>
                  
                  <p className="text-foreground leading-relaxed mb-3">
                    {reflection.response}
                  </p>
                  
                  {reflection.taggedValue && (
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <span className="value-chip text-xs">
                        {getValueName(reflection.taggedValue)}
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default MicroReflections;
