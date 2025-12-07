import { useNavigate } from "react-router-dom";
import { ArrowRight, RefreshCw, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage, STORAGE_KEYS, StoredValue } from "@/hooks/useLocalStorage";

// Option 1: Minimalist geometric hand with compass
const CompassOption1 = () => (
  <svg viewBox="0 0 160 200" className="w-32 h-40 md:w-40 md:h-48" aria-hidden="true" role="img">
    {/* Hand silhouette - simplified geometric */}
    <path 
      d="M50 180 L50 120 Q50 100 60 90 L60 70 Q60 60 70 60 L90 60 Q100 60 100 70 L100 90 Q110 100 110 120 L110 180 Z" 
      fill="hsl(var(--muted))" 
      stroke="hsl(var(--foreground))" 
      strokeWidth="2"
    />
    {/* Thumb */}
    <path 
      d="M50 130 Q30 125 25 110 Q20 95 35 90 Q50 85 55 100" 
      fill="hsl(var(--muted))" 
      stroke="hsl(var(--foreground))" 
      strokeWidth="2"
    />
    
    {/* Compass body - outer ring */}
    <circle cx="80" cy="65" r="45" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="3" />
    <circle cx="80" cy="65" r="38" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Compass face */}
    <circle cx="80" cy="65" r="35" fill="hsl(var(--card))" />
    
    {/* Cardinal directions */}
    <text x="80" y="38" textAnchor="middle" fontSize="10" fontWeight="bold" fill="hsl(var(--primary))">N</text>
    <text x="80" y="98" textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground))">S</text>
    <text x="50" y="68" textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground))">W</text>
    <text x="110" y="68" textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground))">E</text>
    
    {/* Compass needle */}
    <polygon points="80,30 75,65 80,60 85,65" fill="hsl(var(--accent))" />
    <polygon points="80,100 75,65 80,70 85,65" fill="hsl(var(--muted-foreground))" />
    
    {/* Center pin */}
    <circle cx="80" cy="65" r="4" fill="hsl(var(--primary))" />
    
    {/* Degree marks */}
    <line x1="80" y1="33" x2="80" y2="38" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
    <line x1="80" y1="92" x2="80" y2="97" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
    <line x1="48" y1="65" x2="53" y2="65" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
    <line x1="107" y1="65" x2="112" y2="65" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
  </svg>
);

// Option 2: Bold Bauhaus style with strong shapes
const CompassOption2 = () => (
  <svg viewBox="0 0 160 200" className="w-32 h-40 md:w-40 md:h-48" aria-hidden="true" role="img">
    {/* Hand - bold geometric blocks */}
    <rect x="55" y="110" width="50" height="80" rx="8" fill="hsl(var(--secondary))" />
    <rect x="60" y="100" width="12" height="35" rx="4" fill="hsl(var(--secondary))" />
    <rect x="74" y="95" width="12" height="40" rx="4" fill="hsl(var(--secondary))" />
    <rect x="88" y="100" width="12" height="35" rx="4" fill="hsl(var(--secondary))" />
    {/* Thumb */}
    <ellipse cx="42" cy="130" rx="15" ry="10" fill="hsl(var(--secondary))" transform="rotate(-30 42 130)" />
    
    {/* Compass - bold primary ring */}
    <circle cx="80" cy="70" r="50" fill="hsl(var(--primary))" />
    <circle cx="80" cy="70" r="42" fill="hsl(var(--background))" />
    
    {/* Inner ring with tick marks */}
    <circle cx="80" cy="70" r="36" fill="none" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="4 4" />
    
    {/* Cardinal markers - bold blocks */}
    <rect x="76" y="28" width="8" height="12" fill="hsl(var(--accent))" />
    <rect x="76" y="100" width="8" height="8" fill="hsl(var(--muted-foreground))" />
    <rect x="32" y="66" width="8" height="8" fill="hsl(var(--muted-foreground))" />
    <rect x="120" y="66" width="8" height="8" fill="hsl(var(--muted-foreground))" />
    
    {/* Direction labels */}
    <text x="80" y="50" textAnchor="middle" fontSize="12" fontWeight="bold" fill="hsl(var(--primary))">N</text>
    <text x="80" y="98" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">S</text>
    <text x="48" y="73" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">W</text>
    <text x="112" y="73" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">E</text>
    
    {/* Compass needle - geometric triangle */}
    <polygon points="80,35 72,70 80,65 88,70" fill="hsl(var(--accent))" />
    <polygon points="80,105 72,70 80,75 88,70" fill="hsl(var(--foreground))" opacity="0.4" />
    
    {/* Center circle */}
    <circle cx="80" cy="70" r="6" fill="hsl(var(--primary))" />
    <circle cx="80" cy="70" r="3" fill="hsl(var(--background))" />
  </svg>
);

// Option 3: Elegant line art style
const CompassOption3 = () => (
  <svg viewBox="0 0 160 200" className="w-32 h-40 md:w-40 md:h-48" aria-hidden="true" role="img">
    {/* Hand outline - elegant curves */}
    <path 
      d="M45 185 L45 130 Q45 115 55 105 L55 85 Q55 75 65 75 L70 75 L70 70 Q70 62 78 62 L82 62 Q90 62 90 70 L90 75 L95 75 Q105 75 105 85 L105 105 Q115 115 115 130 L115 185" 
      fill="none" 
      stroke="hsl(var(--foreground))" 
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Thumb outline */}
    <path 
      d="M45 140 Q25 135 22 118 Q20 100 38 98 Q52 96 55 110" 
      fill="none" 
      stroke="hsl(var(--foreground))" 
      strokeWidth="2"
      strokeLinecap="round"
    />
    
    {/* Compass outer ring */}
    <circle cx="80" cy="68" r="48" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" />
    <circle cx="80" cy="68" r="44" fill="hsl(var(--card))" stroke="hsl(var(--accent))" strokeWidth="1" />
    
    {/* Degree marks around compass */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
      const rad = (angle - 90) * Math.PI / 180;
      const x1 = 80 + 38 * Math.cos(rad);
      const y1 = 68 + 38 * Math.sin(rad);
      const x2 = 80 + 44 * Math.cos(rad);
      const y2 = 68 + 44 * Math.sin(rad);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(var(--foreground))" strokeWidth={i % 2 === 0 ? 2 : 1} />;
    })}
    
    {/* Cardinal directions */}
    <text x="80" y="38" textAnchor="middle" fontSize="11" fontWeight="bold" fill="hsl(var(--accent))">N</text>
    <text x="80" y="104" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">S</text>
    <text x="46" y="72" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">W</text>
    <text x="114" y="72" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">E</text>
    
    {/* Elegant needle */}
    <path d="M80 28 L76 68 L80 62 L84 68 Z" fill="hsl(var(--accent))" />
    <path d="M80 108 L76 68 L80 74 L84 68 Z" fill="hsl(var(--muted-foreground))" opacity="0.5" />
    
    {/* Decorative inner circle */}
    <circle cx="80" cy="68" r="20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
    
    {/* Center ornament */}
    <circle cx="80" cy="68" r="5" fill="hsl(var(--primary))" />
    <circle cx="80" cy="68" r="2" fill="hsl(var(--accent))" />
  </svg>
);

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
            {hasExistingValues ? (
              <div className="space-y-3 max-w-sm">
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
              <div className="flex flex-col sm:flex-row gap-3">
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

          {/* Three Compass Options for Review */}
          <div className="flex flex-col gap-6 items-center">
            <p className="text-sm text-muted-foreground font-medium">Choose a style:</p>
            <div className="flex gap-4 flex-wrap justify-center">
              <div className="flex flex-col items-center gap-2 p-3 border border-border rounded-lg bg-card">
                <CompassOption1 />
                <span className="text-xs text-muted-foreground">Option 1</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 border border-border rounded-lg bg-card">
                <CompassOption2 />
                <span className="text-xs text-muted-foreground">Option 2</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 border border-border rounded-lg bg-card">
                <CompassOption3 />
                <span className="text-xs text-muted-foreground">Option 3</span>
              </div>
            </div>
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
      </section>
    </div>
  );
};

export default Home;
