import { Dumbbell, FileText, Crown, LogIn, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isPaid: boolean;
}

export default function Navbar({ currentView, onNavigate, isPaid }: NavbarProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const links = [
    { id: "home", label: "Home", icon: Dumbbell },
    { id: "plan", label: "My Plan", icon: FileText },
    { id: "progress", label: "Progress", icon: BarChart3 },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 font-bold text-foreground"
        >
          <Dumbbell className="w-5 h-5 text-primary" />
          GymPlanner
        </button>

        <div className="flex items-center gap-1">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                currentView === link.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <link.icon className="w-4 h-4 inline mr-1" />
              <span className="hidden sm:inline">{link.label}</span>
            </button>
          ))}
          <button
            onClick={() => onNavigate("upgrade")}
            className={`ml-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              isPaid
                ? "bg-premium/10 text-premium"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            <Crown className="w-4 h-4 inline mr-1" />
            <span className="hidden sm:inline">{isPaid ? "Pro" : "Upgrade"}</span>
          </button>
          {!user && (
            <button
              onClick={() => navigate("/auth")}
              className="ml-1 px-3 py-2 rounded-xl text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              <LogIn className="w-4 h-4 inline mr-1" />
              <span className="hidden sm:inline">Login</span>
            </button>
          )}
          {user && (
            <button
              onClick={() => navigate("/dashboard")}
              className="ml-1 px-3 py-2 rounded-xl text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
