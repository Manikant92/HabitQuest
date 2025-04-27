import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PointsProvider } from "@/contexts/points/PointsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import StatsPage from "./pages/StatsPage";
import HistoryPage from "./pages/HistoryPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LeaderboardPage from "./pages/LeaderboardPage";
import QuizPage from "./pages/QuizPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <PointsProvider>
          <TooltipProvider>
            <div className="min-h-screen">
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/auth" element={<AuthPage />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="stats" element={<StatsPage />} />
                    <Route path="history" element={<HistoryPage />} />
                    <Route path="leaderboard" element={<LeaderboardPage />} />
                    <Route path="quiz" element={<QuizPage />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </div>
          </TooltipProvider>
        </PointsProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
