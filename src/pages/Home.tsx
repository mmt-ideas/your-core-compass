import { useNavigate } from "react-router-dom";
import { Compass, CheckCircle, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage, STORAGE_KEYS, StoredValue } from "@/hooks/useLocalStorage";

const Home = () => {
  const navigate = useNavigate();
  const [coreValues] = useLocalStorage<StoredValue[]>(STORAGE_KEYS.CORE_VALUES, []);
  const hasExistingValues = coreValues.length > 0;

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <header className="py-8 md:py-12">
        <div className="max-w-3xl mb-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4 tracking-tight">
            Values Compass
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed">
            A reflective tool for leaders. Clarify your values,
            align decisions, and build mindful awareness.
          </p>

          {hasExistingValues && (
            <p className="text-sm text-muted-foreground mt-4">
              Welcome back — <span className="text-foreground font-medium">{coreValues.length} saved values</span>
            </p>
          )}
        </div>

        {/* Three Tools */}
        <section aria-labelledby="tools-heading">
          <h2 id="tools-heading" className="text-lg font-heading font-bold mb-6">
            Three tools for reflection
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <article className="calm-card">
              <div className="flex items-center gap-3 mb-3">
                <Compass className="h-7 w-7 text-primary" aria-hidden="true" />
                <h3 className="text-base font-heading font-bold">Values Clarity</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Discover what matters through a guided process or enter values directly.
              </p>
              <Button
                onClick={() => navigate("/values")}
                size="sm"
                className="w-full"
              >
                Go to Values Clarity
              </Button>
            </article>

            <article className="calm-card">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="h-7 w-7 text-primary" aria-hidden="true" />
                <h3 className="text-base font-heading font-bold">Decision Alignment</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Check if decisions support or challenge your core values.
              </p>
              <Button
                onClick={() => navigate("/decisions")}
                size="sm"
                className="w-full"
              >
                Go to Decision Alignment
              </Button>
            </article>

            <article className="calm-card">
              <div className="flex items-center gap-3 mb-3">
                <Brain className="h-7 w-7 text-primary" aria-hidden="true" />
                <h3 className="text-base font-heading font-bold">Micro Reflections</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Brief prompts to notice values in action and build awareness.
              </p>
              <Button
                onClick={() => navigate("/reflections")}
                size="sm"
                className="w-full"
              >
                Go to Micro Reflections
              </Button>
            </article>
          </div>
        </section>
      </header>
    </div>
  );
};

export default Home;
