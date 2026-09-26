import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  Mail, 
  Lock, 
  LogIn,
  ArrowLeft
} from "lucide-react";
import api from "../services/api";

// --- OFFICIAL BRAND LOGO SVGs ---
const GoogleLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
    <path d="M16.671 15.542l.532-3.469h-3.328V9.82c0-.949.465-1.874 1.956-1.874h1.514V5.008s-1.375-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.633H7.078v3.469h3.047v8.385a12.09 12.09 0 003.75 0v-8.385h2.796z" fill="#ffffff"/>
  </svg>
);

const AppleLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" fill="#000000"/>
  </svg>
);

export default function LoginPage() {
  const navigate = useNavigate();

  // --- UI STATE ---
  const [showEmailForm, setShowEmailForm] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [error, setError] = useState("");
  const [googleReady, setGoogleReady] = useState(false);

  // --- RATE LIMITING STATE ---
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  const getDeviceId = () => {
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem("deviceId", deviceId);
    }
    return deviceId;
  };

  const getDeviceName = () => {
    return `${navigator.platform || "Web"} Browser`;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
    setError(""); // Clear error when typing
  };

  const saveLogin = (data) => {
    if (data.token) localStorage.setItem("accessToken", data.token);
    if (data.sessionId) localStorage.setItem("sessionId", data.sessionId);
    if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
    if (rememberMe) localStorage.setItem("rememberMe", "true");
  };

  const validateForm = () => {
    const { email, password } = form;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!password) {
      setError("Please enter your password.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (isLocked) {
      setError(`Too many attempts. Please wait ${lockoutTimer} seconds.`);
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
        deviceId: getDeviceId(),
        deviceName: getDeviceName(),
      });

      const data = response.data;

      // 1. Check if Account is Unverified (200 OK, but flagged)
      if (data.unverified || data.status === "unverified" || data.needsVerification) {
        sessionStorage.setItem("registrationEmail", form.email.trim());
        navigate("/verify-otp");
        return;
      }

      // 2. Check if 2FA is required
      if (data.twoFARequired) {
        sessionStorage.setItem("loginTicket", data.loginTicket);
        sessionStorage.setItem("loginEmail", form.email);
        navigate("/2fa-login");
        return;
      }

      saveLogin(data);
      navigate("/redeem");

    } catch (err) {
      const errData = err.response?.data;
      
      // Convert the entire error response to a lowercase string so we can aggressively search it
      const errString = String(
        errData?.message || 
        errData?.error || 
        (typeof errData === 'string' ? errData : "")
      ).toLowerCase();

      // --- AGGRESSIVE UNVERIFIED DETECTION ---
      // Checks for codes, flags, or if the words "verify" or "unverified" exist ANYWHERE in the error message
      const needsVerification = 
        errData?.unverified === true ||
        errData?.code === "ACCOUNT_UNVERIFIED" ||
        errString.includes("unverified") ||
        errString.includes("verify");

      if (needsVerification) {
        // Stop the rate limiter from triggering, save the email, and push them to OTP
        sessionStorage.setItem("registrationEmail", form.email.trim());
        
        // Optional: If your backend has an endpoint to trigger a new OTP code automatically:
        // await api.post("/auth/resend-otp", { email: form.email.trim() }).catch(()=> {});
        
        navigate("/verify-otp");
        return; 
      }

      // If it wasn't a verification error, show the standard error and trigger rate limit
      setError(
        errData?.error ||
        errData?.message ||
        "Unable to login. Please check your credentials."
      );

      setFailedAttempts((prev) => {
        const newAttempts = prev + 1;
        if (newAttempts >= 3) {
          setIsLocked(true);
          let timeLeft = 60;
          setLockoutTimer(timeLeft);
          
          const countdown = setInterval(() => {
            timeLeft -= 1;
            setLockoutTimer(timeLeft);
            if (timeLeft <= 0) {
              clearInterval(countdown);
              setIsLocked(false);
              setFailedAttempts(0);
            }
          }, 1000);
        }
        return newAttempts;
      });
    } finally {
      setLoading(false);
    }
  };

  /* Google Identity Services */
  const handleGoogleCredential = async (credentialResponse) => {
    setError("");
    setSocialLoading("google");
    try {
      const response = await api.post("/auth/oauth/google", {
        idToken: credentialResponse.credential,
        deviceId: getDeviceId(),
        deviceName: getDeviceName(),
      });
      saveLogin(response.data);
      navigate("/redeem");
    } catch (err) {
      setError(err.response?.data?.error || "Google sign-in failed.");
    } finally {
      setSocialLoading("");
    }
  };

  /* Apple Sign In */
  const handleAppleLogin = async () => {
    setError("");
    setSocialLoading("apple");
    try {
      if (!window.AppleID) throw new Error("Apple Sign In is not loaded yet.");
      const response = await window.AppleID.auth.signIn();
      const identityToken = response?.authorization?.id_token;
      
      if (!identityToken) throw new Error("Apple did not return an identity token.");

      let name = "";
      if (response?.user?.name) {
        name = [response.user.name.firstName, response.user.name.lastName]
          .filter(Boolean)
          .join(" ");
      }

      const apiResponse = await api.post("/auth/oauth/apple", {
        idToken: identityToken,
        name,
        deviceId: getDeviceId(),
        deviceName: getDeviceName(),
      });

      saveLogin(apiResponse.data);
      navigate("/redeem");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Apple sign-in failed.");
    } finally {
      setSocialLoading("");
    }
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login triggered");
  };

  useEffect(() => {
    const initializeGoogle = () => {
      if (!window.google?.accounts?.id) return;
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredential,
      });
      setGoogleReady(true);
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  useEffect(() => {
    const initializeApple = () => {
      if (!window.AppleID) return;
      const clientId = import.meta.env.VITE_APPLE_CLIENT_ID;
      if (!clientId) return;
      window.AppleID.auth.init({
        clientId,
        scope: "name email",
        redirectURI: window.location.origin + "/auth/apple/callback",
        usePopup: true,
      });
    };

    if (window.AppleID) {
      initializeApple();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    script.onload = initializeApple;
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  const handleGoogleButton = () => {
    if (!googleReady || !window.google?.accounts?.id) {
      setError("Google Sign In is not ready yet.");
      return;
    }
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        setError(`Google Sign In could not open: ${notification.getNotDisplayedReason()}.`);
      } else if (notification.isSkippedMoment()) {
        setError(`Google Sign In was skipped: ${notification.getSkippedReason()}.`);
      }
    });
  };

  return (
    <div className="auth-page-wrapper">
      
      {/* Top Left Brand Logo - Navigates Home */}
      <Link to="/" className="brand-logo-top" style={{ textDecoration: 'none' }}>
        <div className="brand-icon">
          <span>$</span>
        </div>
        <span>Marketplace</span>
      </Link>

      <div className="auth-card">
        
        {/* --- VIEW 1: SOCIAL OPTIONS & EMAIL SELECTION --- */}
        {!showEmailForm ? (
          <div className="view-social-selection fade-in">
            <div className="auth-header">
              <div className="auth-icon-box">
                <LogIn size={22} color="#111" />
              </div>
              <h1>Welcome back</h1>
              <p>Sign in to access your gift cards, wallet,<br/>and digital services, all in one place.</p>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <div className="social-buttons-column">
              <button 
                className="btn-social-fullwidth" 
                onClick={handleGoogleButton} 
                disabled={!!socialLoading || loading || isLocked}
              >
                {socialLoading === "google" ? <Loader2 className="spin" size={20} /> : <GoogleLogo size={20} />}
                <span>Continue with Google</span>
              </button>
              
              <button 
                className="btn-social-fullwidth" 
                onClick={handleAppleLogin} 
                disabled={!!socialLoading || loading || isLocked}
              >
                {socialLoading === "apple" ? <Loader2 className="spin" size={20} /> : <AppleLogo size={20} />}
                <span>Continue with Apple</span>
              </button>
              
              <button 
                className="btn-social-fullwidth" 
                onClick={handleFacebookLogin} 
                disabled={!!socialLoading || loading || isLocked}
              >
                {socialLoading === "facebook" ? <Loader2 className="spin" size={20} /> : <FacebookLogo size={20} />}
                <span>Continue with Facebook</span>
              </button>
            </div>

            <div className="auth-divider">
              <span>Or</span>
            </div>

            <button className="btn-submit" onClick={() => setShowEmailForm(true)}>
              <Mail size={18} /> Sign in with Email
            </button>

            <div className="auth-switch" style={{ marginTop: "24px" }}>
              Don't have an account? <Link to="/register">Sign up</Link>
            </div>
          </div>
        ) : (

          /* --- VIEW 2: FULL EMAIL LOGIN FORM --- */
          <div className="view-email-form fade-in">
            
            {/* Back Button to return to social options */}
            <button className="btn-back" onClick={() => setShowEmailForm(false)}>
              <ArrowLeft size={18} /> Back
            </button>

            <div className="auth-header" style={{ marginTop: "16px" }}>
              <h1>Sign in with email</h1>
              <p>Enter your email and password below to login securely.</p>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              
              <div className="input-group">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="input-group">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="auth-meta-row">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="btn-submit"
                disabled={loading || !!socialLoading || isLocked}
                style={{ marginTop: "8px" }}
              >
                {loading ? (
                  <Loader2 className="spin" size={18} />
                ) : isLocked ? (
                  `Locked (${lockoutTimer}s)`
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <div className="auth-switch" style={{ marginTop: "20px" }}>
              Don't have an account? <Link to="/register">Sign up</Link>
            </div>
            
          </div>
        )}

      </div>
    </div>
  );
}