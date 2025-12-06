import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useLocalStorage, STORAGE_KEYS, StoredValue, ValueSorting } from "@/hooks/useLocalStorage";
import ValuesSortingStep from "@/components/values/ValuesSortingStep";
import ValuesSelectionStep from "@/components/values/ValuesSelectionStep";
import ManualEntryStep from "@/components/values/ManualEntryStep";
import ValuesComplete from "@/components/values/ValuesComplete";

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

  useEffect(() => {
    if (mode === "manual") {
      setCurrentStep("manual");
    } else if (mode === "full") {
      setCurrentStep("sorting");
    }
  }, [mode]);

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

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <header className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3">
          Values Clarity
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
          {currentStep === "sorting" && "Sort these values based on their importance to you right now."}
          {currentStep === "selection" && "Now choose up to 10 values that feel most essential."}
          {currentStep === "manual" && "Enter the values that matter most to you."}
          {currentStep === "complete" && "Your core values are ready to guide you."}
        </p>
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
