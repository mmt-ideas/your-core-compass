import { useState } from "react";
import { Trash2, AlertTriangle, Moon, Sun, Type, Zap, ZapOff, Sparkles, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useLocalStorage, STORAGE_KEYS, AppSettings, defaultSettings } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

const Settings = () => {
  const [settings, setSettings] = useLocalStorage<AppSettings>(STORAGE_KEYS.SETTINGS, defaultSettings);
  const [apiKey, setApiKey] = useLocalStorage<string>(STORAGE_KEYS.OPENAI_API_KEY, "");
  const [, , removeCoreValues] = useLocalStorage(STORAGE_KEYS.CORE_VALUES, []);
  const [, , removeValuesSorting] = useLocalStorage(STORAGE_KEYS.VALUES_SORTING, {});
  const [, , removeDecisionReflections] = useLocalStorage(STORAGE_KEYS.DECISION_REFLECTIONS, []);
  const [, , removeMicroReflections] = useLocalStorage(STORAGE_KEYS.MICRO_REFLECTIONS, []);
  const [, , removeCustomValues] = useLocalStorage(STORAGE_KEYS.CUSTOM_VALUES, []);
  const [, , removeOnboarding] = useLocalStorage(STORAGE_KEYS.ONBOARDING_COMPLETE, false);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);

  const handleSettingChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings({ ...settings, [key]: value });
    
    // Apply high contrast mode to document
    if (key === 'highContrastMode') {
      document.documentElement.classList.toggle('high-contrast', value as boolean);
    }
    
    // Apply low stimulus mode to document
    if (key === 'lowStimulusMode') {
      document.documentElement.classList.toggle('low-stimulus', value as boolean);
    }
  };

  const handleResetAllData = () => {
    removeCoreValues();
    removeValuesSorting();
    removeDecisionReflections();
    removeMicroReflections();
    removeCustomValues();
    removeOnboarding();
    setShowResetConfirm(false);
    window.location.reload();
  };

  const textSizeOptions: { value: AppSettings['textSize']; label: string }[] = [
    { value: 'normal', label: 'Normal' },
    { value: 'large', label: 'Large' },
    { value: 'larger', label: 'Larger' },
  ];

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <header className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3">
          Settings
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Customize your experience to suit your preferences.
        </p>
      </header>

      <div className="space-y-8">
        {/* AI Features Section */}
        <section aria-labelledby="ai-heading" className="space-y-6">
          <h2 id="ai-heading" className="text-lg font-heading font-bold border-b border-border pb-2">
            AI-Powered Reflections
          </h2>

          {/* AI Reflections Toggle */}
          <div className="calm-card flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-muted-foreground mt-0.5" aria-hidden="true" />
              <div>
                <label htmlFor="ai-reflections" className="font-medium block">
                  Enable AI reflections
                </label>
                <p className="text-sm text-muted-foreground">
                  Get personalized reflection questions in Decision Alignment using ChatGPT.
                </p>
              </div>
            </div>
            <Switch
              id="ai-reflections"
              checked={settings.aiReflectionsEnabled}
              onCheckedChange={(checked) => handleSettingChange('aiReflectionsEnabled', checked)}
            />
          </div>

          {/* OpenAI API Key */}
          {settings.aiReflectionsEnabled && (
            <div className="calm-card">
              <div className="flex items-start gap-3 mb-4">
                <Sparkles className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <label htmlFor="api-key" className="font-medium block mb-1">
                    OpenAI API Key
                  </label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your API key is stored locally and never sent anywhere except directly to OpenAI's API.
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline ml-1"
                    >
                      Get your API key here.
                    </a>
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="api-key"
                        type={showApiKey ? "text" : "password"}
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        placeholder="sk-..."
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showApiKey ? "Hide API key" : "Show API key"}
                      >
                        {showApiKey ? (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                    <Button
                      onClick={() => setApiKey(tempApiKey)}
                      disabled={tempApiKey === apiKey}
                    >
                      Save
                    </Button>
                  </div>
                  {apiKey && (
                    <p className="text-xs text-primary mt-2">✓ API key configured</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Accessibility Section */}
        <section aria-labelledby="accessibility-heading" className="space-y-6">
          <h2 id="accessibility-heading" className="text-lg font-heading font-bold border-b border-border pb-2">
            Accessibility
          </h2>

          {/* Low Stimulus Mode */}
          <div className="calm-card flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {settings.lowStimulusMode ? (
                <ZapOff className="h-5 w-5 text-muted-foreground mt-0.5" aria-hidden="true" />
              ) : (
                <Zap className="h-5 w-5 text-muted-foreground mt-0.5" aria-hidden="true" />
              )}
              <div>
                <label htmlFor="low-stimulus" className="font-medium block">
                  Low stimulus mode
                </label>
                <p className="text-sm text-muted-foreground">
                  Removes shadows and reduces visual ornamentation for a calmer experience.
                </p>
              </div>
            </div>
            <Switch
              id="low-stimulus"
              checked={settings.lowStimulusMode}
              onCheckedChange={(checked) => handleSettingChange('lowStimulusMode', checked)}
            />
          </div>

          {/* High Contrast Mode */}
          <div className="calm-card flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 border-2 border-foreground rounded mt-0.5" aria-hidden="true" />
              <div>
                <label htmlFor="high-contrast" className="font-medium block">
                  High contrast mode
                </label>
                <p className="text-sm text-muted-foreground">
                  Increases contrast between text and background for better visibility.
                </p>
              </div>
            </div>
            <Switch
              id="high-contrast"
              checked={settings.highContrastMode}
              onCheckedChange={(checked) => handleSettingChange('highContrastMode', checked)}
            />
          </div>

          {/* Text Size */}
          <div className="calm-card">
            <div className="flex items-start gap-3 mb-4">
              <Type className="h-5 w-5 text-muted-foreground mt-0.5" aria-hidden="true" />
              <div>
                <span className="font-medium block">Text size</span>
                <p className="text-sm text-muted-foreground">
                  Adjust the base text size throughout the app.
                </p>
              </div>
            </div>
            <div className="flex gap-2" role="radiogroup" aria-label="Text size options">
              {textSizeOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSettingChange('textSize', option.value)}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-all",
                    settings.textSize === option.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:border-primary"
                  )}
                  role="radio"
                  aria-checked={settings.textSize === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reduced Motion */}
          <div className="calm-card flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Moon className="h-5 w-5 text-muted-foreground mt-0.5" aria-hidden="true" />
              <div>
                <label htmlFor="reduced-motion" className="font-medium block">
                  Reduced motion
                </label>
                <p className="text-sm text-muted-foreground">
                  Minimizes animations. Note: Your browser's "reduce motion" preference is also respected.
                </p>
              </div>
            </div>
            <Switch
              id="reduced-motion"
              checked={settings.reducedMotion}
              onCheckedChange={(checked) => handleSettingChange('reducedMotion', checked)}
            />
          </div>
        </section>

        {/* Data Section */}
        <section aria-labelledby="data-heading" className="space-y-6">
          <h2 id="data-heading" className="text-lg font-heading font-bold border-b border-border pb-2">
            Your Data
          </h2>

          <div className="calm-card bg-destructive/5 border-destructive/20">
            <div className="flex items-start gap-3 mb-4">
              <Trash2 className="h-5 w-5 text-destructive mt-0.5" aria-hidden="true" />
              <div>
                <span className="font-medium block">Reset all data</span>
                <p className="text-sm text-muted-foreground">
                  This will permanently delete all your saved values, reflections, and preferences. This cannot be undone.
                </p>
              </div>
            </div>
            
            {showResetConfirm ? (
              <div className="bg-background rounded-lg p-4 border border-destructive/30">
                <div className="flex items-center gap-2 text-destructive mb-3">
                  <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                  <span className="font-medium">Are you sure?</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  All your data will be permanently deleted from this device.
                </p>
                <div className="flex gap-3">
                  <Button 
                    variant="destructive" 
                    onClick={handleResetAllData}
                  >
                    Yes, delete everything
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowResetConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={() => setShowResetConfirm(true)}
              >
                Reset all data
              </Button>
            )}
          </div>
        </section>

        {/* About Section */}
        <section aria-labelledby="about-heading" className="space-y-4">
          <h2 id="about-heading" className="text-lg font-heading font-bold border-b border-border pb-2">
            About Values Compass
          </h2>
          
          <div className="calm-card">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Values Compass is a reflective tool designed to help you clarify your personal values and align your decisions with what matters most to you.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mt-3">
              All your data is stored locally on your device. Nothing is sent to any server. Your reflections remain private and secure.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
