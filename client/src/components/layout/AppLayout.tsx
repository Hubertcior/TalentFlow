import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Logo } from "@/components/brand/Logo";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { LogOut, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppLayoutProps { children: ReactNode }

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { account, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 px-4 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

            <Link to="/" className="flex items-center gap-2.5 group">
              <Logo size={28} />
              <div className="leading-tight">
                <div className="brand-wordmark text-base">
                  talen<span className="text-primary">f</span><span className="text-primary">low</span>
                </div>
              </div>
            </Link>

            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title={theme === "dark" ? "Jasny motyw" : "Ciemny motyw"}
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </Button>

              {account && (
                <>
                  <div className="flex items-center gap-2.5 ml-1">
                    <div
                      className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white bg-gradient-to-br shrink-0",
                        account.color,
                      )}
                    >
                      {account.initials}
                    </div>
                    <div className="hidden sm:block leading-tight">
                      <div className="text-sm font-medium text-foreground leading-none">
                        {account.displayName}
                      </div>
                      <div className="text-[10px] text-muted-foreground capitalize mt-0.5">
                        {account.role === "talent" ? "Kandydat" : "Mentor"}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    title="Wyloguj"
                  >
                    <LogOut size={15} />
                  </Button>
                </>
              )}
            </div>
          </header>

          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
