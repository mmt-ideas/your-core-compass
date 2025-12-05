import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useLocalStorage, STORAGE_KEYS, StoredValue, ValueSorting } from "@/hooks/useLocalStorage";
import ValuesSortingStep from "@/components/values/ValuesSortingStep";
import ValuesSelectionStep from "@/components/values/ValuesSelectionStep";
import ManualEntryStep from "@/components/values/ManualEntryStep";
import ValuesComplete from "@/components/values/ValuesComplete";
import { Grid2X2, Grid3X3, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

type FlowStep = "sorting" | "selection" | "manual" | "complete";
type ColumnCount = 2 | 3 | 4;

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
  const [columns, setColumns] = useState<ColumnCount>(2);

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

        {/* Column selector - only show for sorting and selection steps */}
        {(currentStep === "sorting" || currentStep === "selection") && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <span className="text-sm text-muted-foreground mr-2">Columns:</span>
            <div className="inline-flex rounded-lg border border-border bg-background p-1" role="group" aria-label="Column layout options">
              <button
                onClick={() => setColumns(2)}
                className={cn(
                  "inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                  columns === 2
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="2 columns"
                aria-pressed={columns === 2}
              >
                <Grid2X2 className="h-4 w-4" aria-hidden="true" />
                <span>2</span>
              </button>
              <button
                onClick={() => setColumns(3)}
                className={cn(
                  "inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                  columns === 3
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="3 columns"
                aria-pressed={columns === 3}
              >
                <Grid3X3 className="h-4 w-4" aria-hidden="true" />
                <span>3</span>
              </button>
              <button
                onClick={() => setColumns(4)}
                className={cn(
                  "inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                  columns === 4
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="4 columns"
                aria-pressed={columns === 4}
              >
                <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                <span>4</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {currentStep === "sorting" && (
        <ValuesSortingStep
          sorting={sorting}
          onSortingChange={setSorting}
          customValues={customValues}
          onCustomValuesChange={setCustomValues}
          onComplete={handleSortingComplete}
          onSkip={() => setCurrentStep("manual")}
          columns={columns}
        />
      )}

      {currentStep === "selection" && (
        <ValuesSelectionStep
          sorting={sorting}
          customValues={customValues}
          onComplete={handleSelectionComplete}
          onBack={() => setCurrentStep("sorting")}
          columns={columns}
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
