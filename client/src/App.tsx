import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { logout } from "./store/authSlice";

function Router() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Auto-redirect to login if not authenticated and trying to access protected routes
    if (!isAuthenticated && location !== "/" && location !== "/signup") {
      setLocation("/");
    }
    
    // Auto-redirect to dashboard if authenticated and on login or signup page
    if (isAuthenticated && (location === "/" || location === "/signup")) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, location, setLocation]);

  // Logout handler - for auth timeout or manual logout
  useEffect(() => {
    const checkToken = () => {
      const tokenTimestamp = localStorage.getItem('tokenTimestamp');
      if (tokenTimestamp) {
        const expirationTime = parseInt(tokenTimestamp) + (30 * 60 * 1000); // 30 minutes timeout
        if (Date.now() > expirationTime) {
          dispatch(logout());
        }
      }
    };

    const interval = setInterval(checkToken, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
