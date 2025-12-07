import { useNavigate } from "react-router-dom";
import { ArrowRight, RefreshCw, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage, STORAGE_KEYS, StoredValue } from "@/hooks/useLocalStorage";

// Small directional accent
const DirectionAccent = () => (
  <svg viewBox="0 0 40 40" className="w-8 h-8" aria-hidden="true">
    <line x1="0" y1="20" x2="30" y2="20" stroke="hsl(var(--accent))" strokeWidth="2" />
    <polygon points="28,15 40,20 28,25" fill="hsl(var(--accent))" />
  </svg>
);

const Home = () => {
  const navigate = useNavigate();
  const [coreValues] = useLocalStorage<StoredValue[]>(STORAGE_KEYS.CORE_VALUES, []);
  const hasExistingValues = coreValues.length > 0;

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <header className="py-12 md:py-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-5 tracking-tight">
            Values Compass
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            A reflective tool for leaders. Clarify your values,
            align decisions, and build mindful awareness.
          </p>

          {/* Actions */}
          {hasExistingValues ? (
            <div className="space-y-3 max-w-sm mb-12">
              <p className="text-sm text-muted-foreground mb-4">
                Welcome back — <span className="text-foreground font-medium">{coreValues.length} saved values</span>
              </p>

              <Button onClick={() => navigate("/decisions")} className="w-full justify-between group" size="lg">
                <span>Continue with my values</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate("/values?mode=manual")} className="flex-1">
                  <Edit3 className="h-4 w-4 mr-2" aria-hidden="true" />
                  Edit
                </Button>

                <Button variant="ghost" onClick={() => navigate("/values?mode=full")} className="flex-1 text-muted-foreground">
                  <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                  Restart
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <Button onClick={() => navigate("/values?mode=full")} size="lg" className="group">
                <span>Begin discovery</span>
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Button>

              <Button variant="outline" onClick={() => navigate("/values?mode=manual")} size="lg">
                I know my values
              </Button>
            </div>
          )}
        </div>

        {/* Three Tools - Integrated */}
        <section aria-labelledby="tools-heading" className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <DirectionAccent />
            <h2 id="tools-heading" className="text-lg font-heading font-bold">
              Three tools for reflection
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <article>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-primary flex items-center justify-center" aria-hidden="true">
                  <span className="text-primary-foreground text-xs font-bold">1</span>
                </div>
                <h3 className="text-base font-heading font-bold">Values Clarity</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Discover what matters through a guided process or enter values directly.
              </p>
            </article>

            <article>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-accent flex items-center justify-center" aria-hidden="true">
                  <span className="text-accent-foreground text-xs font-bold">2</span>
                </div>
                <h3 className="text-base font-heading font-bold">Decision Alignment</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Check if decisions support or challenge your core values.
              </p>
            </article>

            <article>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-secondary flex items-center justify-center" aria-hidden="true">
                  <span className="text-secondary-foreground text-xs font-bold">3</span>
                </div>
                <h3 className="text-base font-heading font-bold">Micro Reflections</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Brief prompts to notice values in action and build awareness.
              </p>
            </article>
          </div>
        </section>
      </header>
    </div>
  );
};

export default Home;
