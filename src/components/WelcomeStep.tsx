import { Button } from "@/components/ui/button";
import { Compass, Heart, Target } from "lucide-react";

interface WelcomeStepProps {
  onStart: () => void;
}

const WelcomeStep = ({ onStart }: WelcomeStepProps) => {
  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-8">
        <Compass className="w-10 h-10 text-primary" />
      </div>
      
      <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
        Discover Your Core Values
      </h1>
      
      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
        Understanding your personal values is the foundation of authentic leadership. 
        This assessment will guide you through a reflective journey to identify what 
        matters most to you.
      </p>
      
      <div className="grid sm:grid-cols-3 gap-6 mb-10 w-full">
        <div className="glass-panel p-6 text-center">
          <Heart className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-heading font-semibold mb-2">Select</h3>
          <p className="text-sm text-muted-foreground">
            Choose values that resonate with you
          </p>
        </div>
        <div className="glass-panel p-6 text-center">
          <Target className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-heading font-semibold mb-2">Narrow</h3>
          <p className="text-sm text-muted-foreground">
            Focus on your most important values
          </p>
        </div>
        <div className="glass-panel p-6 text-center">
          <Compass className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-heading font-semibold mb-2">Rank</h3>
          <p className="text-sm text-muted-foreground">
            Prioritize your top five values
          </p>
        </div>
      </div>
      
      <Button variant="hero" size="xl" onClick={onStart}>
        Begin Your Journey
      </Button>
      
      <p className="text-sm text-muted-foreground mt-6">
        Takes approximately 10-15 minutes
      </p>
    </div>
  );
};

export default WelcomeStep;
