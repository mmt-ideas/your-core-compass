import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, AlertCircle, Save, History, Clock, AlertTriangle, CheckCircle2, Lightbulb, Sparkles, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage, STORAGE_KEYS, StoredValue, DecisionReflection, AppSettings, defaultSettings } from "@/hooks/useLocalStorage";
import { decisionAlignmentPrompts } from "@/data/values";
import { generatePersonalizedQuestions, generateRoundSummary } from "@/lib/aiService";
import SpeechInput from "@/components/SpeechInput";
import { cn } from "@/lib/utils";

type Step = "decision" | "values" | "ai-reflection" | "prompts" | "summary" | "history";

const DecisionChecker = () => {
  const navigate = useNavigate();
  const [coreValues] = useLocalStorage<StoredValue[]>(STORAGE_KEYS.CORE_VALUES, []);
  const [reflections, setReflections] = useLocalStorage<DecisionReflection[]>(STORAGE_KEYS.DECISION_REFLECTIONS, []);
  const [settings] = useLocalStorage<AppSettings>(STORAGE_KEYS.SETTINGS, defaultSettings);
  const [apiKey] = useLocalStorage<string>(STORAGE_KEYS.OPENAI_API_KEY, "");

  const [currentStep, setCurrentStep] = useState<Step>("decision");
  const [decision, setDecision] = useState("");
  const [supportedValueIds, setSupportedValueIds] = useState<string[]>([]);
  const [jeopardizedValueIds, setJeopardizedValueIds] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});

  // AI Reflection state
  const [aiQuestions, setAiQuestions] = useState<string[]>([]);
  const [aiResponses, setAiResponses] = useState<Record<string, string>>({});
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [questionRound, setQuestionRound] = useState(1);
  const [roundSummary, setRoundSummary] = useState<string>("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Auto-generate summary when all AI questions are answered
  useEffect(() => {
    const generateSummary = async () => {
      // Only generate if we have questions and all are answered
      const answeredCount = Object.values(aiResponses).filter(v => v.trim()).length;
      if (aiQuestions.length > 0 && answeredCount === aiQuestions.length && !roundSummary && !isGeneratingSummary) {
        setIsGeneratingSummary(true);

        const supportedValues = coreValues.filter(v => supportedValueIds.includes(v.id));
        const jeopardizedValues = coreValues.filter(v => jeopardizedValueIds.includes(v.id));

        // Get only the current round's answers (the last 3 questions)
        const currentRoundQuestions = aiQuestions.slice(-3);
        const currentRoundAnswers: Record<string, string> = {};
        currentRoundQuestions.forEach(q => {
          if (aiResponses[q]) {
            currentRoundAnswers[q] = aiResponses[q];
          }
        });

        const result = await generateRoundSummary(
          apiKey,
          decision,
          supportedValues,
          jeopardizedValues,
          currentRoundAnswers
        );

        if (!result.error && result.summary) {
          setRoundSummary(result.summary);
        }

        setIsGeneratingSummary(false);
      }
    };

    generateSummary();
  }, [aiResponses, aiQuestions, roundSummary, isGeneratingSummary, coreValues, supportedValueIds, jeopardizedValueIds, apiKey, decision]);

  // Check if values are set up
  if (coreValues.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
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

  const handleToggleSupported = (id: string) => {
    setSupportedValueIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(v => v !== id);
      }
      // Remove from jeopardized if adding to supported
      setJeopardizedValueIds(current => current.filter(v => v !== id));
      return [...prev, id];
    });
  };

  const handleToggleJeopardized = (id: string) => {
    setJeopardizedValueIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(v => v !== id);
      }
      // Remove from supported if adding to jeopardized
      setSupportedValueIds(current => current.filter(v => v !== id));
      return [...prev, id];
    });
  };

  const handleResponseChange = (prompt: string, value: string) => {
    setResponses(prev => ({ ...prev, [prompt]: value }));
  };

  const generateSummary = (): string => {
    const supportedValues = coreValues.filter(v => supportedValueIds.includes(v.id));
    const jeopardizedValues = coreValues.filter(v => jeopardizedValueIds.includes(v.id));

    let summary = `Decision/Dilemma: "${decision}"\n\n`;

    if (supportedValues.length > 0) {
      summary += `✓ Values Honored: ${supportedValues.map(v => v.name).join(", ")}\n\n`;
    }

    if (jeopardizedValues.length > 0) {
      summary += `⚠ Values at Risk: ${jeopardizedValues.map(v => v.name).join(", ")}\n\n`;
    }

    summary += "Through this reflection, you've examined the trade-offs and explored what matters most in this situation. This awareness supports you in making a conscious, integrity-based choice.";

    return summary;
  };

  const handleSaveReflection = () => {
    const reflection: DecisionReflection = {
      id: `decision-${Date.now()}`,
      decision,
      selectedValues: [...supportedValueIds, ...jeopardizedValueIds],
      responses,
      summary: generateSummary(),
      timestamp: new Date().toISOString(),
    };

    setReflections([reflection, ...reflections]);

    // Reset for new reflection
    setDecision("");
    setSupportedValueIds([]);
    setJeopardizedValueIds([]);
    setResponses({});
    setCurrentStep("history");
  };

  const handleNewReflection = () => {
    setDecision("");
    setSupportedValueIds([]);
    setJeopardizedValueIds([]);
    setResponses({});
    setAiQuestions([]);
    setAiResponses({});
    setQuestionRound(1);
    setAiError(null);
    setRoundSummary("");
    setCurrentStep("decision");
  };

  const handleGenerateAIQuestions = async () => {
    setIsGeneratingQuestions(true);
    setAiError(null);

    const supportedValues = coreValues.filter(v => supportedValueIds.includes(v.id));
    const jeopardizedValues = coreValues.filter(v => jeopardizedValueIds.includes(v.id));

    const result = await generatePersonalizedQuestions(
      apiKey,
      decision,
      supportedValues,
      jeopardizedValues,
      aiResponses // Pass previous responses for context
    );

    setIsGeneratingQuestions(false);

    if (result.error) {
      setAiError(result.error);
    } else {
      setAiQuestions(result.questions);
      setCurrentStep("ai-reflection");
    }
  };

  const handleAIResponseChange = (question: string, answer: string) => {
    setAiResponses(prev => ({ ...prev, [question]: answer }));
  };

  const handleContinueWithMoreQuestions = async () => {
    setQuestionRound(prev => prev + 1);
    setRoundSummary(""); // Clear previous summary
    await handleGenerateAIQuestions();
  };

  const handleProceedToManualPrompts = () => {
    // Merge AI responses into regular responses
    setResponses(prev => ({ ...prev, ...aiResponses }));
    setCurrentStep("prompts");
  };

  const handleSkipAI = () => {
    setCurrentStep("prompts");
  };

  // Get prompts - show all prompts for thorough reflection
  const activePrompts = decisionAlignmentPrompts;

  const answeredAIQuestions = Object.values(aiResponses).filter(v => v.trim()).length;
  const allAIQuestionsAnswered = answeredAIQuestions === aiQuestions.length && aiQuestions.length > 0;

  return (
    <div className="animate-fade-in">
      <header className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3">
          Decision Alignment
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          {currentStep === "decision" && "What decision or dilemma are you facing?"}
          {currentStep === "values" && "Identify which values are supported or jeopardized by this decision."}
          {currentStep === "ai-reflection" && `AI-Generated Questions (Round ${questionRound})`}
          {currentStep === "prompts" && "Reflect deeply on the trade-offs and what matters most."}
          {currentStep === "summary" && "Your values alignment analysis."}
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
            placeholder="Describe the decision or dilemma you're facing... What choice are you trying to make? (type or speak)"
            label="Your decision or dilemma"
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

      {/* Step 2: Identify supported and jeopardized values */}
      {currentStep === "values" && (
        <div className="space-y-6">
          <div className="calm-card bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Reflecting on:</p>
            <p className="font-medium">{decision}</p>
          </div>

          <div className="calm-card bg-primary/5 border-primary/20">
            <div className="flex items-start gap-3 mb-4">
              <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-2">Understanding Value Trade-offs</p>
                <p>For each of your values, consider: Does this decision honor and support this value, or does it compromise or jeopardize it? A value can also be neutral - neither supported nor jeopardized.</p>
              </div>
            </div>
          </div>

          <fieldset>
            <legend className="text-lg font-medium mb-4">
              Categorize your values in relation to this decision
            </legend>
            <div className="space-y-4">
              {coreValues.map(value => (
                <div
                  key={value.id}
                  className="calm-card"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-medium flex-1">{value.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleSupported(value.id)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border transition-all",
                          supportedValueIds.includes(value.id)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-muted-foreground border-border hover:border-primary"
                        )}
                        aria-pressed={supportedValueIds.includes(value.id)}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Honored
                      </button>
                      <button
                        onClick={() => handleToggleJeopardized(value.id)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border transition-all",
                          jeopardizedValueIds.includes(value.id)
                            ? "bg-destructive text-destructive-foreground border-destructive"
                            : "bg-background text-muted-foreground border-border hover:border-destructive"
                        )}
                        aria-pressed={jeopardizedValueIds.includes(value.id)}
                      >
                        <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                        At Risk
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </fieldset>

          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setCurrentStep("decision")}>
              Back
            </Button>
            {settings.aiReflectionsEnabled && apiKey ? (
              <Button
                onClick={handleGenerateAIQuestions}
                disabled={supportedValueIds.length === 0 && jeopardizedValueIds.length === 0}
              >
                <Sparkles className="h-4 w-4 mr-2" aria-hidden="true" />
                Get AI Questions
                <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentStep("prompts")}
                disabled={supportedValueIds.length === 0 && jeopardizedValueIds.length === 0}
              >
                Continue to reflection
                <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Step 2.5: AI-Powered Reflection Questions */}
      {currentStep === "ai-reflection" && (
        <div className="space-y-8">
          <div className="calm-card bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Reflecting on:</p>
            <p className="font-medium mb-3">{decision}</p>

            {supportedValueIds.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-2">✓ Values Honored:</p>
                <div className="flex flex-wrap gap-2">
                  {coreValues
                    .filter(v => supportedValueIds.includes(v.id))
                    .map(v => (
                      <span key={v.id} className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                        {v.name}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {jeopardizedValueIds.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">⚠ Values at Risk:</p>
                <div className="flex flex-wrap gap-2">
                  {coreValues
                    .filter(v => jeopardizedValueIds.includes(v.id))
                    .map(v => (
                      <span key={v.id} className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                        <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                        {v.name}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>

          {isGeneratingQuestions ? (
            <div className="calm-card text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" aria-hidden="true" />
              <p className="text-muted-foreground">Generating personalized questions...</p>
            </div>
          ) : aiError ? (
            <div className="calm-card bg-destructive/5 border-destructive/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-medium text-destructive mb-2">Unable to generate questions</p>
                  <p className="text-sm text-muted-foreground">{aiError}</p>
                  {!apiKey && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => navigate("/settings")}
                    >
                      Go to Settings
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="calm-card bg-primary/5 border-primary/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-2">AI-Powered Personalized Questions</p>
                    <p className="text-muted-foreground">
                      These questions are specifically crafted for your situation to help you explore value trade-offs more deeply.
                      {questionRound > 1 && " These questions build on your previous reflections."}
                    </p>
                  </div>
                </div>
              </div>

              {aiQuestions.map((question, index) => (
                <div key={question} className="space-y-3">
                  <p className="font-medium text-foreground">{question}</p>
                  <SpeechInput
                    value={aiResponses[question] || ""}
                    onChange={(value) => handleAIResponseChange(question, value)}
                    placeholder="Take your time to reflect..."
                    rows={3}
                  />
                </div>
              ))}

              {/* Summary and Check-in */}
              {answeredAIQuestions > 0 && (
                <div className="calm-card bg-secondary/50 border-secondary">
                  <p className="font-medium mb-3">Round Summary</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    You've answered {answeredAIQuestions} of {aiQuestions.length} questions in this round.
                    {allAIQuestionsAnswered && " Ready to proceed?"}
                  </p>

                  {/* AI-generated summary */}
                  {allAIQuestionsAnswered && (
                    <>
                      {isGeneratingSummary ? (
                        <div className="p-4 rounded-lg bg-background/50 border border-border mb-4">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            <p className="text-sm">Generating your reflection summary...</p>
                          </div>
                        </div>
                      ) : roundSummary ? (
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mb-4">
                          <p className="text-sm leading-relaxed">{roundSummary}</p>
                        </div>
                      ) : null}
                    </>
                  )}

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={handleContinueWithMoreQuestions}
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span>
                        <RefreshCw className="h-4 w-4 inline mr-2" aria-hidden="true" />
                        Get more AI questions (explore further)
                      </span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>

                    <Button
                      onClick={handleProceedToManualPrompts}
                      className="w-full justify-between"
                      disabled={answeredAIQuestions === 0}
                    >
                      <span>Continue with structured prompts</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex justify-between pt-6 border-t border-border">
            <Button variant="ghost" onClick={() => setCurrentStep("values")}>
              Back
            </Button>
            {!isGeneratingQuestions && !aiError && (
              <Button variant="ghost" onClick={handleSkipAI}>
                Skip to manual prompts
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Reflection prompts */}
      {currentStep === "prompts" && (
        <div className="space-y-8">
          <div className="calm-card bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Reflecting on:</p>
            <p className="font-medium mb-3">{decision}</p>

            {supportedValueIds.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-2">✓ Values Honored:</p>
                <div className="flex flex-wrap gap-2">
                  {coreValues
                    .filter(v => supportedValueIds.includes(v.id))
                    .map(v => (
                      <span key={v.id} className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                        {v.name}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {jeopardizedValueIds.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">⚠ Values at Risk:</p>
                <div className="flex flex-wrap gap-2">
                  {coreValues
                    .filter(v => jeopardizedValueIds.includes(v.id))
                    .map(v => (
                      <span key={v.id} className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                        <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                        {v.name}
                      </span>
                    ))}
                </div>
              </div>
            )}
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
            <h2 className="font-heading font-bold mb-4">Values Alignment Analysis</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Decision/Dilemma:</p>
                <p className="font-medium">{decision}</p>
              </div>

              {supportedValueIds.length > 0 && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-start gap-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-primary mb-1">Values Honored by This Decision</p>
                      <p className="text-sm text-muted-foreground">These values are supported and reinforced:</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {coreValues
                      .filter(v => supportedValueIds.includes(v.id))
                      .map(v => (
                        <span key={v.id} className="px-3 py-1 text-sm rounded-full bg-primary text-primary-foreground">
                          {v.name}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {jeopardizedValueIds.length > 0 && (
                <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                  <div className="flex items-start gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-destructive mb-1">Values at Risk with This Decision</p>
                      <p className="text-sm text-muted-foreground">These values may be compromised or jeopardized:</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {coreValues
                      .filter(v => jeopardizedValueIds.includes(v.id))
                      .map(v => (
                        <span key={v.id} className="px-3 py-1 text-sm rounded-full bg-destructive text-destructive-foreground">
                          {v.name}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm leading-relaxed">
                  Through this reflection, you've examined the trade-offs and explored what matters most in this situation. This awareness supports you in making a conscious, integrity-based choice.
                </p>
              </div>
            </div>
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
