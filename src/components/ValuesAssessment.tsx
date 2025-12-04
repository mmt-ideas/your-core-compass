import { useState } from "react";
import ProgressIndicator from "@/components/ProgressIndicator";
import WelcomeStep from "@/components/WelcomeStep";
import SelectValuesStep from "@/components/SelectValuesStep";
import NarrowValuesStep from "@/components/NarrowValuesStep";
import RankValuesStep from "@/components/RankValuesStep";
import ResultsStep from "@/components/ResultsStep";

type Step = "welcome" | "select" | "narrow" | "rank" | "results";

const stepOrder: Step[] = ["welcome", "select", "narrow", "rank", "results"];
const stepLabels = ["Start", "Select", "Narrow", "Rank", "Results"];

const ValuesAssessment = () => {
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [narrowedValues, setNarrowedValues] = useState<string[]>([]);
  const [rankedValues, setRankedValues] = useState<string[]>([]);

  const currentStepIndex = stepOrder.indexOf(currentStep);

  const handleSelectValue = (valueId: string) => {
    setSelectedValues(prev =>
      prev.includes(valueId)
        ? prev.filter(id => id !== valueId)
        : [...prev, valueId]
    );
  };

  const handleNarrowValue = (valueId: string) => {
    setNarrowedValues(prev => {
      if (prev.includes(valueId)) {
        return prev.filter(id => id !== valueId);
      }
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, valueId];
    });
  };

  const handleRestart = () => {
    setCurrentStep("welcome");
    setSelectedValues([]);
    setNarrowedValues([]);
    setRankedValues([]);
  };

  const goToNarrow = () => {
    setCurrentStep("narrow");
  };

  const goToRank = () => {
    setRankedValues(narrowedValues);
    setCurrentStep("rank");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl py-8 px-4">
        {currentStep !== "welcome" && (
          <div className="mb-10">
            <ProgressIndicator
              currentStep={currentStepIndex}
              totalSteps={stepOrder.length}
              stepLabels={stepLabels}
            />
          </div>
        )}

        <main className="pb-20">
          {currentStep === "welcome" && (
            <WelcomeStep onStart={() => setCurrentStep("select")} />
          )}

          {currentStep === "select" && (
            <SelectValuesStep
              selectedValues={selectedValues}
              onSelect={handleSelectValue}
              onNext={goToNarrow}
            />
          )}

          {currentStep === "narrow" && (
            <NarrowValuesStep
              selectedValues={selectedValues}
              narrowedValues={narrowedValues}
              onSelect={handleNarrowValue}
              onNext={goToRank}
              onBack={() => setCurrentStep("select")}
            />
          )}

          {currentStep === "rank" && (
            <RankValuesStep
              rankedValues={rankedValues}
              onReorder={setRankedValues}
              onNext={() => setCurrentStep("results")}
              onBack={() => setCurrentStep("narrow")}
            />
          )}

          {currentStep === "results" && (
            <ResultsStep
              rankedValues={rankedValues}
              onRestart={handleRestart}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ValuesAssessment;
