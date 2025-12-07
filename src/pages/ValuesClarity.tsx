import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useLocalStorage, STORAGE_KEYS, StoredValue, ValueSorting } from "@/hooks/useLocalStorage";
import ValuesSortingStep from "@/components/values/ValuesSortingStep";
import ValuesSelectionStep from "@/components/values/ValuesSelectionStep";
import ManualEntryStep from "@/components/values/ManualEntryStep";
import ValuesComplete from "@/components/values/ValuesComplete";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type FlowStep = "sorting" | "selection" | "manual" | "complete";

const ValuesClarity = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get("mode") || "full";

  const [coreValues, setCoreValues] = useLocalStorage<StoredValue[]>(STORAGE_KEYS.CORE_VALUES, []);
  const [sorting, setSorting] = useLocalStorage<ValueSorting>(STORAGE_KEYS.VALUES_SORTING, {
    veryImportant: [],
    important: [],
    notImportantNow: [],
  });
  const [customValues, setCustomValues] = useLocalStorage<StoredValue[]>(STORAGE_KEYS.CUSTOM_VALUES, []);
  const [, setOnboarded] = useLocalStorage<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETE, false);

  const [currentStep, setCurrentStep] = useState<FlowStep>(() => {
    if (mode === "manual") return "manual";
    if (coreValues.length > 0 && mode !== "full") return "complete";
    return "sorting";
  });

  const [visitedSteps, setVisitedSteps] = useState<Set<FlowStep>>(() => {
    const initial = new Set<FlowStep>();
    if (mode === "manual") {
      initial.add("manual");
    } else {
      initial.add("sorting");
    }
    return initial;
  });

  useEffect(() => {
    if (mode === "manual") {
      setCurrentStep("manual");
      setVisitedSteps(new Set(["manual"]));
    } else if (mode === "full") {
      setCurrentStep("sorting");
      setVisitedSteps(new Set(["sorting"]));
    }
  }, [mode]);

  useEffect(() => {
    setVisitedSteps((prev) => new Set(prev).add(currentStep));
  }, [currentStep]);

  const handleSortingComplete = () => {
    setCurrentStep("selection");
  };

  const handleSelectionComplete = (selected: StoredValue[]) => {
    setCoreValues(selected);
    setOnboarded(true);
    setCurrentStep("complete");
  };

  const handleManualComplete = (values: StoredValue[]) => {
    setCoreValues(values);
    setOnboarded(true);
    setCurrentStep("complete");
  };

  const handleStartOver = () => {
    setCurrentStep("sorting");
    navigate("/values?mode=full");
  };

  const handleEditManually = () => {
    setCurrentStep("manual");
  };

  const handleStepClick = (step: FlowStep) => {
    if (visitedSteps.has(step)) {
      setCurrentStep(step);
    }
  };

  // Define progress steps based on mode
  const progressSteps = mode === "manual"
    ? [
        { id: "manual" as FlowStep, label: "Enter Values", number: 1 },
        { id: "complete" as FlowStep, label: "Your Core Values", number: 2 },
      ]
    : [
        { id: "sorting" as FlowStep, label: "Sort", number: 1 },
        { id: "selection" as FlowStep, label: "Select", number: 2 },
        { id: "complete" as FlowStep, label: "Your Core Values", number: 3 },
      ];

  const currentStepIndex = progressSteps.findIndex(s => s.id === currentStep);

  return (
    <div className="container mx-auto animate-fade-in">
      <header className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3">
          Values Clarity
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          {currentStep === "sorting" && "Drag values between columns to sort them by importance."}
          {currentStep === "selection" && "Now choose up to 10 values that feel most essential."}
          {currentStep === "manual" && "Enter the values that matter most to you."}
          {currentStep === "complete" && "Your core values are ready to guide you."}
        </p>

        {/* Progress indicator */}
        <nav aria-label="Progress" className="max-w-3xl mx-auto mt-8">
          <ol className="flex items-center justify-center gap-2" role="list">
            {progressSteps.map((step, index) => (
              <li key={step.id} className="flex items-center">
                <button
                  onClick={() => handleStepClick(step.id)}
                  disabled={!visitedSteps.has(step.id)}
                  className={cn(
                    "relative px-4 py-3 text-sm transition-all w-[160px] text-center rounded-md",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    currentStep === step.id && "bg-primary/15 text-primary font-semibold",
                    currentStep !== step.id && visitedSteps.has(step.id) && "text-primary/80 hover:text-primary hover:bg-primary/5 cursor-pointer underline decoration-primary/40 hover:decoration-primary",
                    !visitedSteps.has(step.id) && "text-muted-foreground cursor-default"
                  )}
                  aria-label={`Step ${step.number}: ${step.label}`}
                  aria-current={currentStep === step.id ? 'step' : undefined}
                  tabIndex={visitedSteps.has(step.id) ? 0 : -1}
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <span className={cn(
                      "flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all",
                      currentStep === step.id && "bg-primary text-primary-foreground shadow-sm",
                      currentStep !== step.id && visitedSteps.has(step.id) && "bg-primary/80 text-primary-foreground",
                      !visitedSteps.has(step.id) && "bg-muted text-muted-foreground border-2 border-border"
                    )}>
                      {index < currentStepIndex ? (
                        <Check className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <span aria-hidden="true">{step.number}</span>
                      )}
                    </span>
                    <span className="leading-tight text-xs font-medium">
                      {step.label}
                    </span>
                  </div>
                  <span className="sr-only">
                    {currentStep === step.id ? '(Current step)' : visitedSteps.has(step.id) ? '(Completed - click to return)' : '(Not yet available)'}
                  </span>
                </button>

                {index < progressSteps.length - 1 && (
                  <ArrowRight
                    className={cn(
                      "h-5 w-5 mx-2 flex-shrink-0 transition-colors",
                      index < currentStepIndex ? "text-primary" : "text-border"
                    )}
                    aria-hidden="true"
                  />
                )}
              </li>
            ))}
          </ol>
        </nav>
      </header>

      {currentStep === "sorting" && (
        <ValuesSortingStep
          sorting={sorting}
          onSortingChange={setSorting}
          customValues={customValues}
          onCustomValuesChange={setCustomValues}
          onComplete={handleSortingComplete}
          onSkip={() => setCurrentStep("manual")}
        />
      )}

      {currentStep === "selection" && (
        <ValuesSelectionStep
          sorting={sorting}
          customValues={customValues}
          onComplete={handleSelectionComplete}
          onBack={() => setCurrentStep("sorting")}
        />
      )}

      {currentStep === "manual" && (
        <ManualEntryStep
          existingValues={coreValues}
          onComplete={handleManualComplete}
          onBack={() => navigate("/")}
        />
      )}

      {currentStep === "complete" && (
        <ValuesComplete
          values={coreValues}
          onStartOver={handleStartOver}
          onEditManually={handleEditManually}
        />
      )}
    </div>
  );
};

export default ValuesClarity;
