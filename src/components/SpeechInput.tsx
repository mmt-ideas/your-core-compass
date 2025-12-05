import { Mic, MicOff } from "lucide-react";
import { useEffect, useRef } from "react";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface SpeechInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  rows?: number;
  className?: string;
  id?: string;
  "aria-describedby"?: string;
}

const SpeechInput = ({
  value,
  onChange,
  placeholder = "Type or speak your response...",
  label,
  rows = 4,
  className,
  id,
  "aria-describedby": ariaDescribedBy,
}: SpeechInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { isListening, isSupported, transcript, toggleListening, resetTranscript } = useSpeechToText({
    continuous: true,
    interimResults: true,
    onResult: (text) => {
      // Append the transcribed text to existing value
      const newValue = value ? `${value} ${text}` : text;
      onChange(newValue.trim());
    },
  });

  // Update textarea when transcript changes during interim results
  useEffect(() => {
    if (transcript && isListening) {
      // Show interim results in real-time
      const displayValue = value ? `${value} ${transcript}` : transcript;
      // We only update the display, not the actual value until final result
    }
  }, [transcript, isListening, value]);

  const handleToggleSpeech = () => {
    if (!isListening) {
      resetTranscript();
    }
    toggleListening();
  };

  return (
    <div className={cn("relative", className)}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-foreground mb-2"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <Textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={cn(
            "pr-14 resize-none calm-input",
            isListening && "ring-2 ring-terracotta/50"
          )}
          aria-describedby={ariaDescribedBy}
        />
        
        {isSupported && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleToggleSpeech}
            className={cn(
              "absolute right-2 top-2 h-10 w-10 rounded-full transition-all duration-300",
              isListening 
                ? "bg-terracotta text-primary-foreground hover:bg-terracotta/90 animate-pulse-gentle" 
                : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
            )}
            aria-label={isListening ? "Stop recording" : "Start voice input"}
            aria-pressed={isListening}
          >
            {isListening ? (
              <MicOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Mic className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
        )}
      </div>
      
      {isListening && (
        <p className="mt-2 text-sm text-muted-foreground animate-fade-in" role="status" aria-live="polite">
          Listening... Speak clearly and I'll transcribe your words.
        </p>
      )}
      
      {!isSupported && (
        <p className="mt-2 text-sm text-muted-foreground">
          Speech-to-text is not supported in your browser. Please type your response.
        </p>
      )}
    </div>
  );
};

export default SpeechInput;
