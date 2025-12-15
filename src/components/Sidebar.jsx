import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { CreditCard, FileText, Building2, Menu, X, Search } from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
  {
    title: "PAN Search",
    path: "/pan-search",
    icon: CreditCard,
    description: "Search & verify PAN details",
  },
  {
    title: "GST Search",
    path: "/gst-search",
    icon: Building2,
    description: "Lookup GST information",
  },
  {
    title: "Bank Statement",
    path: "/bank-statement",
    icon: FileText,
    description: "Upload & analyze statements",
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/pan-search" && location.pathname === "/") return true;
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-sidebar text-sidebar-foreground shadow-elevated"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-40 w-72 bg-sidebar text-sidebar-foreground transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Search className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-sidebar-foreground">DocVerify</h1>
                <p className="text-xs text-sidebar-foreground/60">Document Search Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                      active ? "bg-sidebar-primary-foreground/20" : "bg-sidebar-accent"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.title}</p>
                    <p
                      className={cn(
                        "text-xs",
                        active ? "text-sidebar-primary-foreground/70" : "text-sidebar-foreground/50"
                      )}
                    >
                      {item.description}
                    </p>
                  </div>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="p-4 rounded-xl bg-sidebar-accent">
              <p className="text-xs text-sidebar-foreground/60">
                Secure document verification powered by advanced OCR technology
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
