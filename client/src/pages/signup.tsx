import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'wouter';
import axios from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import MaterialInput from '@/components/ui/MaterialInput';
import { login } from '@/store/authSlice';
import { RootState } from '@/store';
import { useToast } from '@/hooks/use-toast';

// Form validation schema
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const dispatch = useDispatch();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { error, loading } = useSelector((state: RootState) => state.auth);
  const [signupError, setSignupError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      setSignupError(null);
      const response = await axios.post('/api/auth/register', {
        name: values.name,
        email: values.email,
        password: values.password
      });

      // Automatically log in after successful registration
      if (response.data) {
        dispatch(
          login({
            email: values.email,
            password: values.password
          }) as any
        );
        
        toast({
          title: "Registration successful",
          description: "Your account has been created"
        });
        
        // Redirect to dashboard
        setLocation('/dashboard');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setSignupError(error.response.data.message || 'Registration failed');
      } else {
        setSignupError('Registration failed. Please try again.');
      }
      
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "There was an error creating your account"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create an Account</h1>
          <p className="text-gray-600 mt-2">Sign up to manage your todos</p>
        </div>

        {signupError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {signupError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <MaterialInput
            label="Name"
            {...register('name')}
            error={errors.name?.message}
            disabled={loading}
          />

          <MaterialInput
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            disabled={loading}
          />

          <MaterialInput
            label="Password"
            type="password"
            {...register('password')}
            error={errors.password?.message}
            disabled={loading}
          />

          <MaterialInput
            label="Confirm Password"
            type="password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
            disabled={loading}
          />

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}