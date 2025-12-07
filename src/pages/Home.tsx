import { useNavigate } from "react-router-dom";
import { ArrowRight, RefreshCw, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage, STORAGE_KEYS, StoredValue } from "@/hooks/useLocalStorage";

// Bauhaus-inspired compass graphic
const CompassGraphic = () => <svg viewBox="0 0 120 120" className="w-28 h-28 md:w-36 md:h-36" aria-hidden="true" role="img">
    {/* Outer circle - blue */}
    <circle cx="60" cy="60" r="55" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" />
    
    {/* Inner geometric elements */}
    <circle cx="60" cy="60" r="8" fill="hsl(var(--accent))" />
    
    {/* Cardinal direction lines */}
    <line x1="60" y1="15" x2="60" y2="40" stroke="hsl(var(--primary))" strokeWidth="3" />
    <line x1="60" y1="80" x2="60" y2="105" stroke="hsl(var(--muted-foreground))" strokeWidth="2" opacity="0.5" />
    <line x1="15" y1="60" x2="40" y2="60" stroke="hsl(var(--muted-foreground))" strokeWidth="2" opacity="0.5" />
    <line x1="80" y1="60" x2="105" y2="60" stroke="hsl(var(--muted-foreground))" strokeWidth="2" opacity="0.5" />
    
    {/* North arrow - accent color */}
    <polygon points="60,20 54,45 60,38 66,45" fill="hsl(var(--accent))" />
    
    {/* Decorative quarter arc */}
    <path d="M 85 35 A 35 35 0 0 1 85 85" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" opacity="0.6" />
  </svg>;

// Small directional accent
const DirectionAccent = () => <svg viewBox="0 0 40 40" className="w-8 h-8" aria-hidden="true">
    <line x1="0" y1="20" x2="30" y2="20" stroke="hsl(var(--accent))" strokeWidth="2" />
    <polygon points="28,15 40,20 28,25" fill="hsl(var(--accent))" />
  </svg>;
const Home = () => {
  const navigate = useNavigate();
  const [coreValues] = useLocalStorage<StoredValue[]>(STORAGE_KEYS.CORE_VALUES, []);
  const hasExistingValues = coreValues.length > 0;
  return <div className="animate-fade-in">
      {/* Hero Section */}
      <header className="py-16 md:py-[20px]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-5 tracking-tight">
              Values Compass
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md mb-8">
              A reflective tool for leaders. Clarify your values, 
              align decisions, and build mindful awareness.
            </p>

            {/* Actions */}
            {hasExistingValues ? <div className="space-y-3 max-w-sm">
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
              </div> : <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => navigate("/values?mode=full")} size="lg" className="group">
                  <span>Begin discovery</span>
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Button>
                
                <Button variant="outline" onClick={() => navigate("/values?mode=manual")} size="lg">
                  I know my values
                </Button>
              </div>}
          </div>

          {/* Compass Graphic */}
          <div className="hidden md:block">
            <CompassGraphic />
          </div>
        </div>
      </header>

      {/* Three Tools - Compact */}
      <section aria-labelledby="tools-heading" className="border-t border-border py-[20px]">
        <div className="flex items-center gap-3 mb-8">
          <DirectionAccent />
          <h2 id="tools-heading" className="text-lg font-heading font-bold">
            Three tools for reflection
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
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

        {/* Privacy note - inline */}
        
      </section>
    </div>;
};
export default Home;