import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { SeasonProvider } from "@/contexts/SeasonContext";
import NESAAfrica from "./pages/programs/NESAAfrica";
import Categories from "./pages/Categories";
import Programs from "./pages/Programs";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Nominate from "./pages/Nominate";
import Dashboard from "./pages/Dashboard";
import NRCDashboard from "./pages/NRCDashboard";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SeasonProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
              <Route path="/" element={<NESAAfrica />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/programs/nesa-africa" element={<NESAAfrica />} />
              <Route path="/categories" element={<Categories />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/nominate" element={<Nominate />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/nominations" element={<Dashboard />} />
                <Route path="/nrc" element={<NRCDashboard />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SeasonProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
