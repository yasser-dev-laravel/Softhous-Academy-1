import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
// import { Languages } from 'lucide-react';

const Login: React.FC = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'فشل تسجيل الدخول. تأكد من البيانات');
    } finally {
      setSubmitting(false);
    }
  };

  const translations = {
    welcome: 'Welcome to SoftHous Academy Management System',
    login: 'Login',
    enterCredentials: 'Enter your credentials to access the dashboard',
    username: 'Username',
    password: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    loginButton: 'Log in',
    testAccounts: 'Test Accounts',
    admin: 'Admin',
    adminUsername: 'admin',
    manager: 'Manager',
    managerUsername: 'manager',
    instructor: 'Instructor',
    instructorUsername: 'instructor',
    passwordForAll: 'Password for all',
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-academy-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <img src="/placeholder.svg" alt="Logo" className="h-12 w-12" />
            </div>
            <CardTitle className="text-2xl">{translations.welcome}</CardTitle>
            <CardDescription>
              {translations.enterCredentials}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{translations.username}</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder={translations.username}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{translations.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-gray-300 text-academy-primary focus:ring-academy-primary"
                  />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    {translations.rememberMe}
                  </Label>
                </div>
                <a
                  href="#"
                  className="text-sm text-academy-primary hover:text-academy-secondary"
                >
                  {translations.forgotPassword}
                </a>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-academy-primary hover:bg-academy-secondary"
                disabled={submitting}
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  translations.loginButton
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="font-medium text-lg mb-2">{translations.testAccounts}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{translations.admin}:</span>
              <span className="font-mono">{translations.adminUsername}</span>
            </div>
            <div className="flex justify-between">
              <span>{translations.manager}:</span>
              <span className="font-mono">{translations.managerUsername}</span>
            </div>
            <div className="flex justify-between">
              <span>{translations.instructor}:</span>
              <span className="font-mono">{translations.instructorUsername}</span>
            </div>
            <div className="flex justify-between mt-2 pt-2 border-t">
              <span>{translations.passwordForAll}:</span>
              <span className="font-mono">123456</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
