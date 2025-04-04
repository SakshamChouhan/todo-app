import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
import { RootState } from "../store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MaterialInput from "../components/ui/MaterialInput";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

// Form schema with validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required")
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  
  const onSubmit = (values: LoginFormValues) => {
    dispatch(login(values) as any);
  };
  
  // Show toast on login error
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error
      });
    }
  }, [error, toast]);
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background-default">
      <Card className="w-full max-w-md p-8 mx-4">
        <CardContent className="p-0">
          <h1 className="text-3xl font-medium text-text-primary mb-6 text-center">TodoMaster</h1>
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <MaterialInput
              label="Email"
              type="email"
              id="email"
              error={form.formState.errors.email?.message}
              {...form.register("email")}
            />
            
            <MaterialInput
              label="Password"
              type="password"
              id="password"
              error={form.formState.errors.password?.message}
              {...form.register("password")}
            />
            
            <Button 
              type="submit" 
              className="w-full py-2 px-4 bg-primary-main text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 transition-colors"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            
            {/* Information box */}
            <div className="mt-4 p-3 bg-gray-100 rounded-md">
              <p className="text-xs text-text-secondary mb-1">Information:</p>
              <p className="text-xs text-text-primary">Test Credentials: </p>
              <p className="text-xs text-text-primary">Email: user@example.com</p>
              <p className="text-xs text-text-primary">Password: mypassword</p>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-text-secondary text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary-main hover:text-primary-dark font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
