import { useNavigate } from "react-router-dom";
import { ArrowRight, RefreshCw, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage, STORAGE_KEYS, StoredValue } from "@/hooks/useLocalStorage";

const Home = () => {
  const navigate = useNavigate();
  const [coreValues] = useLocalStorage<StoredValue[]>(STORAGE_KEYS.CORE_VALUES, []);
  const hasExistingValues = coreValues.length > 0;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Hero Section with Bauhaus geometric accent */}
      <header className="py-16 md:py-20 relative">
        {/* Geometric accent - Bauhaus inspired */}
        <div className="absolute top-8 right-0 w-24 h-24 md:w-32 md:h-32 opacity-10" aria-hidden="true">
          <div className="absolute inset-0 bg-primary rounded-full" />
          <div className="absolute top-1/2 left-0 w-full h-1/2 bg-accent" />
        </div>
        
        <div className="relative">
          {/* Simple geometric logo mark */}
          <div className="flex items-center gap-3 mb-8" aria-hidden="true">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <div className="w-8 h-1 bg-accent" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6 tracking-tight">
            Values Compass
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
            A reflective space for leaders. Clarify your core values, 
            align decisions with what matters, and build mindful awareness.
          </p>
        </div>
      </header>

      {/* Action Section */}
      <section className="pb-16 border-b border-border">
        {hasExistingValues ? (
          <div className="space-y-6">
            <p className="text-base text-muted-foreground">
              Welcome back — you have <span className="text-foreground font-medium">{coreValues.length} saved values</span>.
            </p>
            
            <div className="flex flex-col gap-3 max-w-md">
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
                <span>Edit values</span>
                <Edit3 className="h-4 w-4" aria-hidden="true" />
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => navigate("/values?mode=full")}
                className="w-full justify-between text-muted-foreground"
                size="lg"
              >
                <span>Start fresh</span>
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
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
              I know my values
            </Button>
          </div>
        )}
      </section>

      {/* About Values - Clean card */}
      <section className="py-16 border-b border-border">
        <div className="flex items-start gap-6">
          {/* Bauhaus geometric accent */}
          <div className="hidden sm:flex flex-col gap-2 pt-1" aria-hidden="true">
            <div className="w-4 h-4 bg-primary" />
            <div className="w-4 h-8 bg-accent/30" />
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-heading font-bold text-foreground mb-4">
              What are personal values?
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Personal values are the principles that guide how you live and lead. 
              They reflect what truly matters — like integrity, creativity, or growth — 
              and serve as your compass for decisions.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Clarity about values helps you make authentic decisions, navigate challenges 
              with confidence, and lead in alignment with who you are.
            </p>
          </div>
        </div>
      </section>

      {/* Three Modules - Grid */}
      <section className="py-16" aria-labelledby="modules-heading">
        <h2 id="modules-heading" className="text-xl font-heading font-bold mb-8">
          Three tools for reflection
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <article className="group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary flex items-center justify-center" aria-hidden="true">
                <span className="text-primary-foreground text-sm font-bold">1</span>
              </div>
              <h3 className="text-base font-heading font-bold">Values Clarity</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-11">
              Discover what matters most through a guided process, or enter values you already know.
            </p>
          </article>
          
          <article className="group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-accent flex items-center justify-center" aria-hidden="true">
                <span className="text-accent-foreground text-sm font-bold">2</span>
              </div>
              <h3 className="text-base font-heading font-bold">Decision Alignment</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-11">
              Check if a decision supports or challenges your values for conscious choices.
            </p>
          </article>
          
          <article className="group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-secondary flex items-center justify-center" aria-hidden="true">
                <span className="text-secondary-foreground text-sm font-bold">3</span>
              </div>
              <h3 className="text-base font-heading font-bold">Micro Reflections</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-11">
              Brief prompts to notice your values in action and build awareness.
            </p>
          </article>
        </div>
      </section>

      {/* Privacy footer */}
      <footer className="py-8 border-t border-border">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Private by design.</span>{" "}
          All data stays on your device. No accounts, no cloud.
        </p>
      </footer>
    </div>
  );
};

export default Home;
