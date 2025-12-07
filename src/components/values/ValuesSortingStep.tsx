import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Download, HelpCircle, ArrowRight, SkipForward, GripVertical, RotateCcw, FileText, Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { personalValues, getValueById, valuesReflectionPrompts } from "@/data/values";
import { StoredValue, ValueSorting } from "@/hooks/useLocalStorage";
import SpeechInput from "@/components/SpeechInput";
import { cn } from "@/lib/utils";
import { validateValueName, sanitizeInput, INPUT_LIMITS } from "@/lib/security";
import jsPDF from "jspdf";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  pointerWithin,
  useSensor,
  useSensors,
  PointerSensor,
  useDroppable,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ValuesSortingStepProps {
  sorting: ValueSorting;
  onSortingChange: (sorting: ValueSorting) => void;
  customValues: StoredValue[];
  onCustomValuesChange: (values: StoredValue[]) => void;
  onComplete: () => void;
  onSkip: () => void;
}

type SortCategory = "veryImportant" | "important" | "notImportantNow";

const categoryLabels: Record<SortCategory, string> = {
  veryImportant: "Very Important",
  important: "Important",
  notImportantNow: "Not Important Right Now",
};

const categoryDescriptions: Record<SortCategory, string> = {
  veryImportant: "These feel essential to who you are",
  important: "These matter, but may not be central right now",
  notImportantNow: "These don't resonate as strongly at this time",
};

const ValuesSortingStep = ({
  sorting,
  onSortingChange,
  customValues,
  onCustomValuesChange,
  onComplete,
  onSkip,
}: ValuesSortingStepProps) => {
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [showReflectionPrompt, setShowReflectionPrompt] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showDescriptions, setShowDescriptions] = useState(false);

  // Configure drag sensors for mouse and touch with activation constraints
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Get all values including custom ones
  const allValues = [...personalValues, ...customValues];
  
  // Get unsorted values
  const sortedIds = [...sorting.veryImportant, ...sorting.important, ...sorting.notImportantNow];
  const unsortedValues = allValues.filter(v => !sortedIds.includes(v.id));

  const handleSort = (valueId: string, category: SortCategory) => {
    const newSorting = { ...sorting };

    // Remove from all categories first
    Object.keys(newSorting).forEach(key => {
      newSorting[key as SortCategory] = newSorting[key as SortCategory].filter(id => id !== valueId);
    });

    // Add to new category
    newSorting[category] = [...newSorting[category], valueId];
    onSortingChange(newSorting);
  };

  const handleResetSorting = () => {
    onSortingChange({
      veryImportant: [],
      important: [],
      notImportantNow: [],
    });
  };

  const handleDeleteCustomValue = (valueId: string) => {
    // Remove from custom values
    const updatedCustomValues = customValues.filter(v => v.id !== valueId);
    onCustomValuesChange(updatedCustomValues);

    // Remove from sorting if it's sorted
    const newSorting = { ...sorting };
    Object.keys(newSorting).forEach(key => {
      newSorting[key as SortCategory] = newSorting[key as SortCategory].filter(id => id !== valueId);
    });
    onSortingChange(newSorting);
  };

  const handleAddCustomValue = () => {
    const sanitizedName = sanitizeInput(customName, INPUT_LIMITS.VALUE_NAME);
    const sanitizedDescription = sanitizeInput(customDescription, INPUT_LIMITS.VALUE_DESCRIPTION);

    if (!sanitizedName) return;

    // Validate using security utility
    const validation = validateValueName(sanitizedName);
    if (!validation.valid) {
      alert(validation.error || "Invalid value name");
      return;
    }

    const newValue: StoredValue = {
      id: `custom-${Date.now()}`,
      name: sanitizedName,
      description: sanitizedDescription || undefined,
      isCustom: true,
    };

    onCustomValuesChange([...customValues, newValue]);
    setCustomName("");
    setCustomDescription("");
    setShowAddCustom(false);
  };

  const handleDownloadText = () => {
    const veryImportantValues = sorting.veryImportant.map(id => getValueInfo(id)).filter(Boolean) as StoredValue[];
    const importantValues = sorting.important.map(id => getValueInfo(id)).filter(Boolean) as StoredValue[];
    const notImportantValues = sorting.notImportantNow.map(id => getValueInfo(id)).filter(Boolean) as StoredValue[];

    let content = "MY VALUES\n";
    content += "=" + "=".repeat(50) + "\n\n";
    content += `Date: ${new Date().toLocaleDateString()}\n\n`;

    if (veryImportantValues.length > 0) {
      content += "VERY IMPORTANT\n";
      content += "-" + "-".repeat(50) + "\n";
      content += "These feel essential to who you are\n\n";
      veryImportantValues.forEach(v => {
        content += `• ${v.name}\n`;
        if (v.description) content += `  ${v.description}\n`;
        content += "\n";
      });
      content += "\n";
    }

    if (importantValues.length > 0) {
      content += "IMPORTANT\n";
      content += "-" + "-".repeat(50) + "\n";
      content += "These matter, but may not be central right now\n\n";
      importantValues.forEach(v => {
        content += `• ${v.name}\n`;
        if (v.description) content += `  ${v.description}\n`;
        content += "\n";
      });
      content += "\n";
    }

    if (notImportantValues.length > 0) {
      content += "NOT IMPORTANT RIGHT NOW\n";
      content += "-" + "-".repeat(50) + "\n";
      content += "These don't resonate as strongly at this time\n\n";
      notImportantValues.forEach(v => {
        content += `• ${v.name}\n`;
        if (v.description) content += `  ${v.description}\n`;
        content += "\n";
      });
      content += "\n";
    }

    if (unsortedValues.length > 0) {
      content += "UNSORTED VALUES\n";
      content += "-" + "-".repeat(50) + "\n\n";
      unsortedValues.forEach(v => {
        content += `• ${v.name}\n`;
        if (v.description) content += `  ${v.description}\n`;
        content += "\n";
      });
    }

    content += "\n" + "=".repeat(50) + "\n";
    content += "Generated by Values Compass\n";

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `my-values-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = 20;

    // Brand colors (converted from HSL to RGB)
    const brandBlue = [38, 102, 229]; // Primary blue
    const brandPurple = [153, 102, 204]; // Accent purple
    const darkText = [41, 46, 51]; // Foreground dark
    const lightBg = [239, 243, 247]; // Background light

    // Helper function to draw header on each page
    const drawHeader = () => {
      // Header background bar
      doc.setFillColor(brandBlue[0], brandBlue[1], brandBlue[2]);
      doc.rect(0, 0, pageWidth, 25, 'F');

      // Values Compass title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text("VALUES COMPASS", margin, 15);

      // Subtitle
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text("Discover what matters most", margin, 20);

      // Reset text color
      doc.setTextColor(darkText[0], darkText[1], darkText[2]);
      yPosition = 35;
    };

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize: number, fontStyle: 'normal' | 'bold' = 'normal', color: number[] = darkText) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', fontStyle);
      doc.setTextColor(color[0], color[1], color[2]);
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line: string) => {
        if (yPosition > 270) {
          doc.addPage();
          drawHeader();
        }
        doc.text(line, margin, yPosition);
        yPosition += fontSize * 0.5;
      });
    };

    // Helper function to add section header with colored background
    const addSectionHeader = (title: string, description: string, color: number[]) => {
      if (yPosition > 250) {
        doc.addPage();
        drawHeader();
      }

      // Section header background
      doc.setFillColor(color[0], color[1], color[2], 0.1);
      doc.roundedRect(margin - 5, yPosition - 5, maxWidth + 10, 16, 3, 3, 'F');

      // Section title
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(title, margin, yPosition + 2);
      yPosition += 8;

      // Section description
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(darkText[0], darkText[1], darkText[2]);
      const descLines = doc.splitTextToSize(description, maxWidth);
      descLines.forEach((line: string) => {
        doc.text(line, margin, yPosition);
        yPosition += 4;
      });
      yPosition += 4;
    };

    // Draw initial header
    drawHeader();

    // Document title
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.text("My Core Values", margin, yPosition);
    yPosition += 8;

    // Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }), margin, yPosition);
    yPosition += 15;

    const veryImportantValues = sorting.veryImportant.map(id => getValueInfo(id)).filter(Boolean) as StoredValue[];
    const importantValues = sorting.important.map(id => getValueInfo(id)).filter(Boolean) as StoredValue[];
    const notImportantValues = sorting.notImportantNow.map(id => getValueInfo(id)).filter(Boolean) as StoredValue[];

    // Very Important section
    if (veryImportantValues.length > 0) {
      addSectionHeader("VERY IMPORTANT", "These feel essential to who you are", brandBlue);

      veryImportantValues.forEach((v, index) => {
        if (yPosition > 260) {
          doc.addPage();
          drawHeader();
        }

        // Value bullet point
        doc.setFillColor(brandBlue[0], brandBlue[1], brandBlue[2]);
        doc.circle(margin + 2, yPosition - 1.5, 1.5, 'F');

        // Value name
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        doc.text(v.name, margin + 6, yPosition);
        yPosition += 5;

        // Value description
        if (v.description) {
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(80, 80, 80);
          const descLines = doc.splitTextToSize(v.description, maxWidth - 6);
          descLines.forEach((line: string) => {
            doc.text(line, margin + 6, yPosition);
            yPosition += 4;
          });
        }
        yPosition += 2;
      });
      yPosition += 6;
    }

    // Important section
    if (importantValues.length > 0) {
      addSectionHeader("IMPORTANT", "These matter, but may not be central right now", brandPurple);

      importantValues.forEach(v => {
        if (yPosition > 260) {
          doc.addPage();
          drawHeader();
        }

        // Value bullet point
        doc.setFillColor(brandPurple[0], brandPurple[1], brandPurple[2]);
        doc.circle(margin + 2, yPosition - 1.5, 1.5, 'F');

        // Value name
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        doc.text(v.name, margin + 6, yPosition);
        yPosition += 5;

        // Value description
        if (v.description) {
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(80, 80, 80);
          const descLines = doc.splitTextToSize(v.description, maxWidth - 6);
          descLines.forEach((line: string) => {
            doc.text(line, margin + 6, yPosition);
            yPosition += 4;
          });
        }
        yPosition += 2;
      });
      yPosition += 6;
    }

    // Not Important section
    if (notImportantValues.length > 0) {
      addSectionHeader("NOT IMPORTANT RIGHT NOW", "These don't resonate as strongly at this time", [120, 120, 120]);

      notImportantValues.forEach(v => {
        if (yPosition > 260) {
          doc.addPage();
          drawHeader();
        }

        // Value bullet point
        doc.setFillColor(150, 150, 150);
        doc.circle(margin + 2, yPosition - 1.5, 1.5, 'F');

        // Value name
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        doc.text(v.name, margin + 6, yPosition);
        yPosition += 5;

        // Value description
        if (v.description) {
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(80, 80, 80);
          const descLines = doc.splitTextToSize(v.description, maxWidth - 6);
          descLines.forEach((line: string) => {
            doc.text(line, margin + 6, yPosition);
            yPosition += 4;
          });
        }
        yPosition += 2;
      });
      yPosition += 6;
    }

    // Unsorted section
    if (unsortedValues.length > 0) {
      addSectionHeader("UNSORTED VALUES", "Values you haven't categorized yet", [180, 180, 180]);

      unsortedValues.forEach(v => {
        if (yPosition > 260) {
          doc.addPage();
          drawHeader();
        }

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        doc.text(`• ${v.name}`, margin + 2, yPosition);
        yPosition += 5;
      });
    }

    // Footer on last page
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);

      // Footer line
      doc.setDrawColor(brandBlue[0], brandBlue[1], brandBlue[2]);
      doc.setLineWidth(0.5);
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

      // Footer text
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text("Generated by Values Compass", margin, pageHeight - 10);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
    }

    doc.save(`my-values-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const getValueInfo = (id: string) => {
    return getValueById(id) || customValues.find(v => v.id === id);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over) {
      return;
    }

    const valueId = active.id as string;
    const overId = over.id as string;

    // Determine which category an item is in
    const getCategory = (id: string): SortCategory | "unsorted" | null => {
      // Check if it's a column ID first
      if (id === "unsorted" || id === "veryImportant" || id === "important" || id === "notImportantNow") {
        return id as SortCategory | "unsorted";
      }

      // Check sorted categories
      if (sorting.veryImportant.includes(id)) return "veryImportant";
      if (sorting.important.includes(id)) return "important";
      if (sorting.notImportantNow.includes(id)) return "notImportantNow";

      // Must be unsorted
      return "unsorted";
    };

    const activeCategory = getCategory(valueId);
    const targetCategory = getCategory(overId);

    // If target is a column ID, move to that column
    if (overId === "unsorted" || overId === "veryImportant" || overId === "important" || overId === "notImportantNow") {
      if (overId === "unsorted") {
        // Remove from all sorted categories
        const newSorting = { ...sorting };
        Object.keys(newSorting).forEach(key => {
          newSorting[key as SortCategory] = newSorting[key as SortCategory].filter(id => id !== valueId);
        });
        onSortingChange(newSorting);
      } else {
        // Move to the target category
        handleSort(valueId, overId as SortCategory);
      }
      return;
    }

    // If dragging onto an item in the same category, reorder
    if (activeCategory === targetCategory && activeCategory !== "unsorted" && activeCategory !== null) {
      const categoryKey = activeCategory as SortCategory;
      const items = sorting[categoryKey];
      const oldIndex = items.indexOf(valueId);
      const newIndex = items.indexOf(overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newSorting = {
          ...sorting,
          [categoryKey]: arrayMove(items, oldIndex, newIndex),
        };
        onSortingChange(newSorting);
      }
      return;
    }

    // If dragging onto an item in a different category, move to that category
    if (targetCategory && targetCategory !== "unsorted" && targetCategory !== activeCategory) {
      handleSort(valueId, targetCategory as SortCategory);
    }
  };

  const canProceed = sorting.veryImportant.length > 0;

  const activeValue = activeId ? getValueInfo(activeId) : null;

  // Define columns for the 4-column layout
  const columns = [
    { id: "unsorted", label: "Values to Sort", values: unsortedValues, description: "Drag values to categorize them" },
    { id: "veryImportant", label: "Very Important", values: sorting.veryImportant.map(id => getValueInfo(id)).filter(Boolean) as StoredValue[], description: categoryDescriptions.veryImportant },
    { id: "important", label: "Important", values: sorting.important.map(id => getValueInfo(id)).filter(Boolean) as StoredValue[], description: categoryDescriptions.important },
    { id: "notImportantNow", label: "Not Important Right Now", values: sorting.notImportantNow.map(id => getValueInfo(id)).filter(Boolean) as StoredValue[], description: categoryDescriptions.notImportantNow },
  ];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Header with progress and actions */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-heading font-bold">Sort Your Values</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {sortedIds.length} of {allValues.length} values sorted
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={showReflectionPrompt ? "default" : "outline"}
              size="sm"
              onClick={() => setShowReflectionPrompt(!showReflectionPrompt)}
            >
              <HelpCircle className="h-4 w-4 mr-2" aria-hidden="true" />
              Help me decide
            </Button>
            <Button
              variant={showDescriptions ? "default" : "outline"}
              size="sm"
              onClick={() => setShowDescriptions(!showDescriptions)}
            >
              {showDescriptions ? (
                <EyeOff className="h-4 w-4 mr-2" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
              )}
              {showDescriptions ? "Hide" : "Show"} descriptions
            </Button>
            {sortedIds.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleResetSorting}>
                <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
                Reset sorting
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                  Download
                  <ChevronDown className="h-4 w-4 ml-2" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDownloadText}>
                  <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
                  Text file (.txt)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                  PDF file (.pdf)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" onClick={onComplete} disabled={!canProceed}>
              Continue to selection
              <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Reflection prompts */}
        {showReflectionPrompt && (
          <aside className="calm-card bg-sand/30 border-sand" role="complementary">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-slate-blue mt-0.5" aria-hidden="true" />
              <div className="flex-1">
                <p className="font-medium text-foreground mb-2">Reflection prompt</p>
                <p className="text-muted-foreground italic leading-relaxed">
                  {valuesReflectionPrompts[currentPromptIndex]}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3"
                  onClick={() => setCurrentPromptIndex((currentPromptIndex + 1) % valuesReflectionPrompts.length)}
                >
                  Next prompt
                  <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </aside>
        )}

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" role="region" aria-label="Values sorting columns">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col h-full">
              {/* Column Header */}
              <div className="mb-3 min-h-[60px]">
                <h3 className="font-heading font-bold text-lg flex items-center gap-2">
                  {column.label}
                  <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                    {column.values.length}
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-tight">{column.description}</p>
              </div>

              {/* Droppable Column */}
              <DroppableZone
                id={column.id}
                className="flex-1"
              >
                <SortableContext
                  items={column.values.map(v => v.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2" role="list" aria-label={`${column.label} values`}>
                    {column.values.length > 0 ? (
                      column.values.map((value) => (
                        <ValueCard
                          key={value.id}
                          value={value}
                          showDescription={showDescriptions}
                          onDelete={handleDeleteCustomValue}
                        />
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground text-sm py-8">
                        {column.id === "unsorted" ? "All values sorted!" : "Drag values here"}
                      </p>
                    )}
                  </div>
                </SortableContext>

                {/* Add custom value (only in first column) */}
                {column.id === "unsorted" && (
                  <div className="pt-2 mt-2 border-t border-border">
                    {showAddCustom ? (
                      <div className="space-y-3 p-3 bg-background rounded-lg border border-border">
                        <h4 className="font-heading font-semibold text-sm">Add a custom value</h4>
                        <div>
                          <label htmlFor="custom-name" className="block text-xs font-medium mb-1">
                            Value name *
                          </label>
                          <SpeechInput
                            id="custom-name"
                            value={customName}
                            onChange={setCustomName}
                            placeholder="Enter your value..."
                            rows={1}
                          />
                        </div>
                        <div>
                          <label htmlFor="custom-desc" className="block text-xs font-medium mb-1">
                            Description (optional)
                          </label>
                          <SpeechInput
                            id="custom-desc"
                            value={customDescription}
                            onChange={setCustomDescription}
                            placeholder="What does this value mean to you?"
                            rows={2}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleAddCustomValue} disabled={!customName.trim()}>
                            Add value
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setShowAddCustom(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" className="w-full" onClick={() => setShowAddCustom(true)}>
                        <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                        Add a custom value
                      </Button>
                    )}
                  </div>
                )}
              </DroppableZone>
            </div>
          ))}
        </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end items-center pt-6 border-t border-border">
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onSkip}>
            <SkipForward className="h-4 w-4 mr-2" aria-hidden="true" />
            Skip to manual entry
          </Button>
          <Button onClick={onComplete} disabled={!canProceed}>
            Continue to selection
            <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>

    <DragOverlay>
      {activeValue ? (
        <div className="bg-background border-2 border-primary rounded-lg p-3 shadow-xl cursor-grabbing opacity-95">
          <div className="flex items-start gap-2">
            <GripVertical className="h-4 w-4 text-primary mt-0.5" aria-hidden="true" />
            <div>
              <h4 className="font-semibold text-base text-foreground">{activeValue.name}</h4>
              {showDescriptions && activeValue.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {activeValue.description}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </DragOverlay>
  </DndContext>
  );
};

// Droppable zone component
interface DroppableZoneProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

const DroppableZone = ({ id, children, className }: DroppableZoneProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[400px] rounded-lg border-2 border-dashed transition-all p-3",
        isOver ? "border-primary bg-primary/5" : "border-border bg-background/50",
        className
      )}
      role="group"
      aria-label={`Drop zone for ${id}`}
    >
      {children}
    </div>
  );
};

// Simplified value card component
interface ValueCardProps {
  value: StoredValue | { id: string; name: string; description?: string; isCustom?: boolean };
  showDescription?: boolean;
  onDelete?: (id: string) => void;
}

const ValueCard = ({ value, showDescription = false, onDelete }: ValueCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: value.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && value.isCustom) {
      onDelete(value.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "bg-background border border-border rounded-lg p-3 transition-all cursor-grab active:cursor-grabbing hover:border-primary hover:shadow-sm relative group",
        isDragging && "ring-2 ring-primary shadow-lg"
      )}
      role="listitem"
      tabIndex={0}
      aria-label={`${value.name}${value.description ? `: ${value.description}` : ""}`}
      onKeyDown={(e) => {
        // Allow keyboard navigation
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          // Focus handling for accessibility
        }
      }}
    >
      <div className="flex items-start gap-2">
        <GripVertical
          className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0"
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-base text-foreground leading-snug">
            {value.name}
          </h4>
          {showDescription && value.description && (
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {value.description}
            </p>
          )}
        </div>
        {value.isCustom && onDelete && (
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded-md"
            aria-label={`Delete ${value.name}`}
            title="Delete custom value"
          >
            <X className="h-4 w-4 text-destructive" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ValuesSortingStep;
