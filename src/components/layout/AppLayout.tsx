import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Logo } from "@/components/brand/Logo";
import { RoleSwitcher } from "@/components/brand/RoleSwitcher";
import { Link } from "react-router-dom";

interface AppLayoutProps { children: ReactNode }

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Global header */}
          <header className="h-14 flex items-center gap-3 px-4 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

            <Link to="/" className="flex items-center gap-2.5 group">
              <Logo size={28} />
              <div className="leading-tight">
                <div className="brand-wordmark text-base">
                  talen<span className="text-primary">f</span><span className="text-primary">low</span>
                </div>
                <div className="text-[10px] text-muted-foreground tracking-wider uppercase">
                  GovTech Polska 2025
                </div>
              </div>
            </Link>

            <div className="ml-auto flex items-center gap-3">
              <RoleSwitcher />
            </div>
          </header>

          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
