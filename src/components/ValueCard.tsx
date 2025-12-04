import { cn } from "@/lib/utils";
import { Value } from "@/data/values";
import { Check } from "lucide-react";

interface ValueCardProps {
  value: Value;
  selected: boolean;
  onClick: () => void;
  showDescription?: boolean;
  rank?: number;
}

const ValueCard = ({ value, selected, onClick, showDescription = false, rank }: ValueCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "value-card text-left w-full group",
        selected && "selected"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {rank && (
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                {rank}
              </span>
            )}
            <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {value.name}
            </h3>
          </div>
          {showDescription && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {value.description}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
            selected
              ? "bg-primary border-primary"
              : "border-border group-hover:border-primary/50"
          )}
        >
          {selected && <Check className="w-4 h-4 text-primary-foreground" />}
        </div>
      </div>
    </button>
  );
};

export default ValueCard;
