import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppLayout } from "@/components/layout/AppLayout";
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
  const { account } = useAuth();

  if (!account) return <LoginPage />;

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
