<<<<<<< HEAD
=======
import { useEffect } from "react";
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { useTalentFlow } from "@/store/useTalentFlow";
import LoginPage from "./pages/LoginPage.tsx";

import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import TalentsPage from "./pages/TalentsPage.tsx";
import TalentDetailPage from "./pages/TalentDetailPage.tsx";
import TasksPage from "./pages/TasksPage.tsx";
import TaskDetailPage from "./pages/TaskDetailPage.tsx";
import InboxPage from "./pages/InboxPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import EmployersPage from "./pages/EmployersPage.tsx";
import DecisionsPage from "./pages/DecisionsPage.tsx";

const queryClient = new QueryClient();

const AppRoutes = () => {
<<<<<<< HEAD
  const { account, isAuthLoading } = useAuth();
  const isDataLoading = useTalentFlow((s) => s.isLoading);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Ładowanie…</p>
        </div>
      </div>
    );
  }

  if (!account) return <LoginPage />;

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Pobieranie danych…</p>
        </div>
      </div>
    );
  }

=======
  const { account } = useAuth();
  const initialize = useTalentFlow((s) => s.initialize);
  useEffect(() => { initialize(); }, [initialize]);

  if (!account) return <LoginPage />;

>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/talents" element={<TalentsPage />} />
          <Route path="/talents/:id" element={<TalentDetailPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/employers" element={<EmployersPage />} />
          <Route path="/decisions" element={<DecisionsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <AuthProvider>
          <RoleProvider>
            <AppRoutes />
          </RoleProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
