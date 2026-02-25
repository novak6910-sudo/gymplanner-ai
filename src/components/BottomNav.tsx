import { Home, ClipboardList, PlusCircle, BarChart3, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  const tabs = [
    { id: "home", label: "Home", icon: Home, path: "/dashboard" },
    { id: "plans", label: "My Plans", icon: ClipboardList, path: "/plans" },
    { id: "create", label: "Create", icon: PlusCircle, path: "/create", isMain: true },
    { id: "tracking", label: "Tracking", icon: BarChart3, path: "/tracking" },
    { id: "account", label: "Account", icon: User, path: "/account" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border/50 pb-safe">
      <div className="max-w-lg mx-auto flex items-end justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = path === tab.path;
          const Icon = tab.icon;

          if (tab.isMain) {
            return (
              <Link
                key={tab.id}
                to={tab.path}
                className="relative -top-4 flex flex-col items-center gap-1 group"
              >
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
                  isActive 
                    ? "bg-primary text-primary-foreground scale-110" 
                    : "bg-primary/90 text-primary-foreground group-hover:scale-105"
                )}>
                  <Icon className="w-8 h-8" />
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.id}
              to={tab.path}
              className="flex flex-col items-center justify-center gap-1 w-16 h-full transition-all active:scale-95"
            >
              <Icon className={cn(
                "w-6 h-6 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
