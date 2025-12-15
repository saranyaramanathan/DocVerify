import { cn } from "../lib/utils";

const SearchCard = ({ children, className }) => {
  return (
    <div
      className={cn(
        "bg-card rounded-2xl border border-border shadow-card p-6 animate-slide-up",
        className
      )}
    >
      {children}
    </div>
  );
};

const SearchCardHeader = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
};

const SearchCardContent = ({ children, className }) => {
  return <div className={cn("space-y-4", className)}>{children}</div>;
};

export { SearchCard, SearchCardHeader, SearchCardContent };
