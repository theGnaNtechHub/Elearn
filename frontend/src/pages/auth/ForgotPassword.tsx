import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Mail, Key, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { checkEmailExists, resetPassword } from "@/utils/userAuth";

type Step = 'email' | 'otp' | 'password' | 'success';

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim()) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    // Check if email exists
    if (!checkEmailExists(email.trim())) {
      setError("Email not found. Please check your email or sign up for a new account.");
      setLoading(false);
      return;
    }

    // Generate mock OTP (in real app, this would be sent via email service)
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockOtp);
    
    toast({
      title: "OTP Sent!",
      description: `Mock OTP: ${mockOtp} (In real app, this would be sent to your email)`,
      duration: 10000, // Show for 10 seconds so user can see the OTP
    });

    setCurrentStep('otp');
    setLoading(false);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      setLoading(false);
      return;
    }

    if (otp.trim() !== generatedOtp) {
      setError("Invalid OTP. Please try again.");
      setLoading(false);
      return;
    }

    setCurrentStep('password');
    setLoading(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("Please fill in both password fields.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Reset password
    const result = resetPassword(email, newPassword);
    
    if (result.success) {
      setCurrentStep('success');
      toast({
        title: "Password Reset Successful!",
        description: "Your password has been updated successfully.",
      });
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const renderEmailStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-xl font-semibold text-primary">Enter Your Email</h2>
        <p className="text-platform-gray-dark text-sm mt-2">
          We'll send you an OTP to reset your password
        </p>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <Button type="submit" className="w-full btn-accent" disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </Button>
      </form>
    </div>
  );

  const renderOtpStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Key className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-primary">Enter OTP</h2>
        <p className="text-platform-gray-dark text-sm mt-2">
          Enter the 6-digit code sent to {email}
        </p>
      </div>

      <form onSubmit={handleOtpSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">OTP Code</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
            disabled={loading}
            className="text-center text-lg tracking-wider"
          />
        </div>
        <Button type="submit" className="w-full btn-accent" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          className="w-full"
          onClick={() => setCurrentStep('email')}
        >
          Back to Email
        </Button>
      </form>
    </div>
  );

  const renderPasswordStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Key className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-primary">Reset Password</h2>
        <p className="text-platform-gray-dark text-sm mt-2">
          Create a new password for your account
        </p>
      </div>

      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <Button type="submit" className="w-full btn-accent" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-primary">Password Reset Successfully!</h2>
        <p className="text-platform-gray-dark text-sm mt-2">
          Your password has been updated. You can now sign in with your new password.
        </p>
      </div>

      <Button 
        className="w-full btn-accent"
        onClick={() => navigate('/signin')}
      >
        Go to Sign In
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-platform-gray/30 p-4">
      <Card className="w-full max-w-md scale-in">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Link 
              to="/signin" 
              className="absolute left-6 p-2 hover:bg-platform-gray rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <CardTitle className="text-2xl font-bold text-primary">
              Forgot Password
            </CardTitle>
          </div>
          <CardDescription className="text-platform-gray-dark">
            {currentStep === 'email' && "Enter your email to reset your password"}
            {currentStep === 'otp' && "Verify your identity with OTP"}
            {currentStep === 'password' && "Create a new secure password"}
            {currentStep === 'success' && "Password reset completed"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {currentStep === 'email' && renderEmailStep()}
          {currentStep === 'otp' && renderOtpStep()}
          {currentStep === 'password' && renderPasswordStep()}
          {currentStep === 'success' && renderSuccessStep()}
          
          <div className="text-center mt-6">
            <span className="text-sm text-platform-gray-dark">
              Remember your password?{" "}
              <Link to="/signin" className="text-accent hover:underline font-medium">
                Sign In
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;