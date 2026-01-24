import { Toaster } from "@/components/ui/toaster";
import Nominees from "./pages/Nominees";
import NomineeProfile from "./pages/NomineeProfile";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { SeasonProvider } from "@/contexts/SeasonContext";

// Pages
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

// About Pages
import About from "./pages/about/About";
import Vision2035 from "./pages/about/Vision2035";
import Governance from "./pages/about/Governance";
import Timeline from "./pages/about/Timeline";
import SCEF from "./pages/about/SCEF";

// Award Pages
import PlatinumAward from "./pages/awards/PlatinumAward";
import IconAward from "./pages/awards/IconAward";
import GoldAward from "./pages/awards/GoldAward";
import BlueGarnetAward from "./pages/awards/BlueGarnetAward";
import Winners from "./pages/awards/Winners";

// Media Pages
import MediaHub from "./pages/media/MediaHub";
import NESATV from "./pages/media/NESATV";
import Shows from "./pages/media/Shows";
import Webinars from "./pages/media/Webinars";
import Gala from "./pages/media/Gala";

// Support Pages
import Donate from "./pages/Donate";
import Judges from "./pages/Judges";
import Partners from "./pages/Partners";
import Chapters from "./pages/Chapters";
import Volunteer from "./pages/Volunteer";
import Contact from "./pages/Contact";
import Vote from "./pages/Vote";

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
                {/* Landing */}
                <Route path="/" element={<NESAAfrica />} />
                <Route path="/programs" element={<Programs />} />
                <Route path="/programs/nesa-africa" element={<NESAAfrica />} />
                
                {/* About */}
                <Route path="/about" element={<About />} />
                <Route path="/about/vision-2035" element={<Vision2035 />} />
                <Route path="/about/governance" element={<Governance />} />
                <Route path="/about/timeline" element={<Timeline />} />
                <Route path="/about/scef" element={<SCEF />} />
                
                {/* Awards */}
                <Route path="/categories" element={<Categories />} />
                <Route path="/awards/platinum" element={<PlatinumAward />} />
                <Route path="/awards/icon" element={<IconAward />} />
                <Route path="/awards/gold" element={<GoldAward />} />
                <Route path="/awards/blue-garnet" element={<BlueGarnetAward />} />
                <Route path="/awards/winners" element={<Winners />} />
                
                {/* Media */}
                <Route path="/media" element={<MediaHub />} />
                <Route path="/media/tv" element={<NESATV />} />
                <Route path="/media/shows" element={<Shows />} />
                <Route path="/media/webinars" element={<Webinars />} />
                <Route path="/media/gala" element={<Gala />} />
                
                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* User Actions */}
                <Route path="/nominate" element={<Nominate />} />
                <Route path="/nominees" element={<Nominees />} />
                <Route path="/nominees/:slug" element={<NomineeProfile />} />
                <Route path="/vote" element={<Vote />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/nominations" element={<Dashboard />} />
                <Route path="/nrc" element={<NRCDashboard />} />
                
                {/* Support */}
                <Route path="/donate" element={<Donate />} />
                <Route path="/judges" element={<Judges />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/chapters" element={<Chapters />} />
                <Route path="/volunteer" element={<Volunteer />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Utility */}
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
