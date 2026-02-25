import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dumbbell, Mail, Lock, User, ArrowLeft, Chrome } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

type AuthMode = "login" | "signup" | "forgot";

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast({ title: "Login failed", description: String(error), variant: "destructive" });
    }
  };

  const handleAppleLogin = async () => {
    const { error } = await lovable.auth.signInWithOAuth("apple", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast({ title: "Login failed", description: String(error), variant: "destructive" });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/dashboard");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: name },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email ✉️", description: "We sent you a verification link." });
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email sent", description: "Check your inbox for a reset link." });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo & Title */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Dumbbell className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome to Gym Planner</h1>
          <p className="text-muted-foreground text-sm">Your AI-powered fitness companion</p>
        </div>

        {!showEmail ? (
          <div className="space-y-4">
            {/* Social Login Buttons */}
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              size="lg"
              className="w-full h-16 text-lg rounded-2xl gap-3 font-bold border-border/50 hover:bg-secondary/50 transition-all active:scale-[0.98]"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <Button
              onClick={handleAppleLogin}
              size="lg"
              className="w-full h-16 text-lg rounded-2xl gap-3 font-bold bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-[0.98] shadow-lg shadow-foreground/10"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </Button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-background px-4 text-muted-foreground font-bold">or</span>
              </div>
            </div>

            <Button
              onClick={() => setShowEmail(true)}
              variant="ghost"
              size="lg"
              className="w-full h-14 text-base rounded-2xl gap-3 font-bold text-muted-foreground hover:text-foreground transition-all"
            >
              <Mail className="w-5 h-5" />
              Sign in with Email
            </Button>

            <p className="text-center text-sm text-muted-foreground pt-4 font-medium">
              New here?{" "}
              <button onClick={() => { setShowEmail(true); setMode("signup"); }} className="text-primary font-bold hover:underline">
                Create account
              </button>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setShowEmail(false); setMode("login"); }}
              className="gap-2 -ml-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>

            <h2 className="text-lg font-semibold text-foreground">
              {mode === "login" && "Sign in with email"}
              {mode === "signup" && "Create your account"}
              {mode === "forgot" && "Reset your password"}
            </h2>

            <form onSubmit={mode === "login" ? handleLogin : mode === "signup" ? handleSignup : handleForgot} className="space-y-4">
              {mode === "signup" && (
                <div className="relative">
                  <User className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                  <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="pl-12 h-14 rounded-2xl border-border/50 focus:border-primary/50 transition-all" required />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-4 top-4.5 w-5 h-5 text-muted-foreground" />
                <Input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-12 h-14 rounded-2xl border-border/50 focus:border-primary/50 transition-all" required />
              </div>
              {mode !== "forgot" && (
                <div className="relative">
                  <Lock className="absolute left-4 top-4.5 w-5 h-5 text-muted-foreground" />
                  <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-12 h-14 rounded-2xl border-border/50 focus:border-primary/50 transition-all" required minLength={6} />
                </div>
              )}
              <Button type="submit" size="lg" className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? "Please wait..." : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
              </Button>
            </form>

            <div className="text-center text-sm space-y-4">
              {mode === "login" && (
                <>
                  <button onClick={() => setMode("forgot")} className="text-primary font-bold hover:underline block mx-auto">
                    Forgot password?
                  </button>
                  <p className="text-muted-foreground font-medium">
                    Don't have an account?{" "}
                    <button onClick={() => setMode("signup")} className="text-primary font-bold hover:underline">Sign up</button>
                  </p>
                </>
              )}
              {mode === "signup" && (
                <p className="text-muted-foreground font-medium">
                  Already have an account?{" "}
                  <button onClick={() => setMode("login")} className="text-primary font-bold hover:underline">Sign in</button>
                </p>
              )}
              {mode === "forgot" && (
                <button onClick={() => setMode("login")} className="text-primary font-bold hover:underline">
                  Back to sign in
                </button>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate("/")}
          className="block mx-auto text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
