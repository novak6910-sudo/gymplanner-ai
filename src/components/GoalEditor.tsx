import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings2, Check, X } from "lucide-react";

interface GoalEditorProps {
  label: string;
  value: number;
  unit: string;
  onSave: (newValue: number) => void;
}

export default function GoalEditor({ label, value, unit, onSave }: GoalEditorProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  const handleSave = () => {
    const num = parseInt(draft);
    if (num > 0) {
      onSave(num);
      setEditing(false);
    }
  };

  if (!editing) {
    return (
      <button
        onClick={() => { setDraft(String(value)); setEditing(true); }}
        className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-sm"
      >
        <Settings2 className="w-3.5 h-3.5" />
        <span>{label}: {value}{unit}</span>
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <Input
        type="number"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="w-24 h-8 text-sm"
        min={1}
        autoFocus
        onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditing(false); }}
      />
      <span className="text-xs text-muted-foreground">{unit}</span>
      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleSave}><Check className="w-3.5 h-3.5 text-success" /></Button>
      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(false)}><X className="w-3.5 h-3.5 text-muted-foreground" /></Button>
    </div>
  );
}
