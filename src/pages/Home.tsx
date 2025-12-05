import { useNavigate } from "react-router-dom";
import { Compass, ArrowRight, RefreshCw, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage, STORAGE_KEYS, StoredValue } from "@/hooks/useLocalStorage";

const Home = () => {
  const navigate = useNavigate();
  const [coreValues] = useLocalStorage<StoredValue[]>(STORAGE_KEYS.CORE_VALUES, []);
  const hasExistingValues = coreValues.length > 0;

  return (
    <div className="max-w-2xl mx-auto text-center animate-fade-in">
      {/* Hero Section */}
      <div className="py-12 md:py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-8">
          <Compass className="h-10 w-10 text-primary" aria-hidden="true" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6 leading-tight">
          Welcome to Values Compass
        </h1>
        
        <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto">
          A gentle space for reflection. Clarify what matters most to you, 
          check your decisions against your values, and build a practice of mindful awareness.
        </p>

        {/* Returning User Options */}
        {hasExistingValues ? (
          <div className="space-y-4 mb-12">
            <p className="text-sm text-muted-foreground mb-6">
              Welcome back. You have {coreValues.length} saved values.
            </p>
            
            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              <Button
                onClick={() => navigate("/decisions")}
                className="w-full justify-between group"
                size="lg"
              >
                <span>Continue with my values</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate("/values?mode=manual")}
                className="w-full justify-between"
                size="lg"
              >
                <span>Edit my values manually</span>
                <Edit3 className="h-5 w-5" aria-hidden="true" />
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => navigate("/values?mode=full")}
                className="w-full justify-between text-muted-foreground"
                size="lg"
              >
                <span>Start fresh with guided flow</span>
                <RefreshCw className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mb-12">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => navigate("/values?mode=full")}
                size="lg"
                className="group"
              >
                <span>Begin guided discovery</span>
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate("/values?mode=manual")}
                size="lg"
              >
                I already know my values
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* How it works */}
      <section className="py-12 border-t border-border" aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="text-xl font-heading font-bold mb-8">
          Three ways to reflect
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <article className="calm-card">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-primary font-bold" aria-hidden="true">1</span>
            </div>
            <h3 className="font-heading font-bold mb-2">Values Clarity</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover what matters most through a thoughtful sorting process, or simply enter the values you already know.
            </p>
          </article>
          
          <article className="calm-card">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <span className="text-accent font-bold" aria-hidden="true">2</span>
            </div>
            <h3 className="font-heading font-bold mb-2">Decision Alignment</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Understand which values are supported or jeopardized by your decisions to make conscious, integrity-based choices.
            </p>
          </article>
          
          <article className="calm-card">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-4">
              <span className="text-secondary-foreground font-bold" aria-hidden="true">3</span>
            </div>
            <h3 className="font-heading font-bold mb-2">Micro Reflections</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Build awareness through brief daily reflections that help you notice your values in action.
            </p>
          </article>
        </div>
      </section>

      {/* Privacy note */}
      <section className="py-8 text-sm text-muted-foreground">
        <p>
          <strong>Your data stays with you.</strong> Everything is stored locally on your device. 
          No accounts, no cloud, no tracking.
        </p>
      </section>
    </div>
  );
};

export default Home;
