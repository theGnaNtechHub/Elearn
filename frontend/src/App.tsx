import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Arena from "./pages/Arena";
import Profile from "./pages/Profile";
import LogicLab from "./pages/LogicLab";
import MrPseudo from "./pages/MrPseudo";
import LadyLogic from "./pages/LadyLogic";
import Achievements from "./pages/Achievements";
import Calendar from "./pages/Calendar";
import Admin from "./pages/Admin";
import CourseViewer from "./pages/CourseViewer";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:courseId" element={<CourseViewer />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="arena" element={<Arena />} />
            <Route path="profile" element={<Profile />} />
            <Route path="logic-lab" element={<LogicLab />} />
            <Route path="mr-pseudo" element={<MrPseudo />} />
            <Route path="lady-logic" element={<LadyLogic />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="calendar" element={<Calendar />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
