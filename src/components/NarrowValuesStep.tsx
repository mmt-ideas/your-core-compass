import { Button } from "@/components/ui/button";
import ValueCard from "@/components/ValueCard";
import { getValueById } from "@/data/values";
import { ArrowRight, ArrowLeft, Info } from "lucide-react";

interface NarrowValuesStepProps {
  selectedValues: string[];
  narrowedValues: string[];
  onSelect: (valueId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const NarrowValuesStep = ({ 
  selectedValues, 
  narrowedValues, 
  onSelect, 
  onNext, 
  onBack 
}: NarrowValuesStepProps) => {
  const values = selectedValues.map(id => getValueById(id)).filter(Boolean);

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
          Narrow to Your Top 5
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          From your selected values, choose the 5 that are absolutely essential to who you are. 
          These are the values you couldn't imagine living without.
        </p>
      </div>

      <div className="glass-panel p-4 mb-6 flex items-center gap-3">
        <Info className="w-5 h-5 text-primary flex-shrink-0" />
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{narrowedValues.length}</span> of 5 values selected
          {narrowedValues.length < 5 && ` — Select ${5 - narrowedValues.length} more`}
          {narrowedValues.length === 5 && " — Perfect! You can continue"}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {values.map(value => value && (
          <ValueCard
            key={value.id}
            value={value}
            selected={narrowedValues.includes(value.id)}
            onClick={() => onSelect(value.id)}
            showDescription
          />
        ))}
      </div>

      <div className="flex justify-between sticky bottom-4">
        <Button variant="outline" size="lg" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>
        <Button
          variant="hero"
          size="lg"
          onClick={onNext}
          disabled={narrowedValues.length !== 5}
          className="gap-2"
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default NarrowValuesStep;
