import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

const ResultsDisplay = ({ data, loading, error, type }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-sm text-muted-foreground">Searching {type} details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7 text-destructive" />
        </div>
        <p className="text-sm font-medium text-destructive">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mt-6 p-6 rounded-xl bg-secondary/50 border border-border animate-scale-in">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-foreground">{type} Details Found</h3>
      </div>
      <div className="grid gap-3">
        {Object.entries(data).map(([key, value]) => (
          <div
            key={key}
            className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2 border-b border-border/50 last:border-0"
          >
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide min-w-[140px]">
              {key.replace(/_/g, " ")}
            </span>
            <span className="text-sm font-medium text-foreground">{value || "N/A"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsDisplay;
