import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Compass, Brain, CheckCircle, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import { useLocalStorage, STORAGE_KEYS, AppSettings, defaultSettings } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
const navItems = [{
  path: "/values",
  label: "Values Clarity",
  icon: Compass,
  description: "Discover your core values"
}, {
  path: "/decisions",
  label: "Decision Alignment",
  icon: CheckCircle,
  description: "Align decisions with values"
}, {
  path: "/reflections",
  label: "Micro Reflections",
  icon: Brain,
  description: "Daily reflection practice"
}, {
  path: "/settings",
  label: "Settings",
  icon: Settings,
  description: "App preferences"
}];
const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings] = useLocalStorage<AppSettings>(STORAGE_KEYS.SETTINGS, defaultSettings);
  const location = useLocation();

  // Apply settings classes to document
  const settingsClasses = cn(settings.lowStimulusMode && "low-stimulus", settings.highContrastMode && "high-contrast", settings.textSize === 'large' && "text-lg", settings.textSize === 'larger' && "text-xl");
  return <div className={cn("min-h-screen bg-background", settingsClasses)}>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-16 items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors" aria-label="Values Compass - Home">
            <Compass className="h-7 w-7 text-primary" aria-hidden="true" />
            <span className="font-heading text-xl font-bold">Values Compass</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map(item => <NavLink key={item.path} to={item.path} className={({
            isActive
          }) => cn("nav-link", isActive && "active")} aria-current={location.pathname === item.path ? "page" : undefined}>
                <item.icon className="h-5 w-5" aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>)}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-expanded={isMobileMenuOpen} aria-controls="mobile-menu" aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}>
            {isMobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && <nav id="mobile-menu" className="md:hidden border-t border-border bg-background animate-fade-in" aria-label="Mobile navigation">
            <div className="container py-4 space-y-1">
              {navItems.map(item => <NavLink key={item.path} to={item.path} className={({
            isActive
          }) => cn("nav-link w-full", isActive && "active")} onClick={() => setIsMobileMenuOpen(false)} aria-current={location.pathname === item.path ? "page" : undefined}>
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                  <div>
                    <span className="block">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </div>
                </NavLink>)}
            </div>
          </nav>}
      </header>

      {/* Main Content */}
      <main id="main-content" className="container py-8 md:py-12" role="main">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8" role="contentinfo">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Values Compass — A reflective tool for personal clarity</p>
          <p className="mt-2">Private by design — all data stays on your device, no accounts required.</p>
        </div>
      </footer>
    </div>;
};
export default Layout;