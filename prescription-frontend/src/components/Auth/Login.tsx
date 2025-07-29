import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiService } from '../../services/api';

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    role: 'doctor'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
  };

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     await signIn(loginData.username, loginData.password);
  //     toast.success('Welcome back, Doctor! 👨‍⚕️');
  //     navigate('/dashboard');
  //   } catch (error: any) {
  //     console.error('Login error:', error);
  //     toast.error(error.message || 'Login failed. Please check your credentials.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };


 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
 
  try {
    await signIn(); // ✅ No need to pass username/password
    toast.success('Welcome back, Doctor! 👨‍⚕️');
    navigate('/dashboard');
  } catch (error: any) {
    console.error('Login error:', error);
    toast.error(error.message || 'Login failed.');
  } finally {
    setLoading(false);
  }
};


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await apiService.signup(signupData);
      toast.success('Account created successfully! 🎉 Please login with your credentials.');
      setActiveTab('login');
      setLoginData({ username: signupData.username, password: '' });
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Account creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '100px',
        height: '100px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        top: '70%',
        right: '10%',
        width: '150px',
        height: '150px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse',
      }} />
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '20%',
        width: '80px',
        height: '80px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '50%',
        animation: 'float 7s ease-in-out infinite',
      }} />

      {/* Main Container */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        width: '100%',
        maxWidth: '450px',
        padding: '0',
        overflow: 'hidden',
        position: 'relative'
      }}>
        
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          padding: '40px 30px 30px',
          textAlign: 'center',
          color: 'white',
          position: 'relative'
        }}>
          {/* Medical Cross Icon */}
          <div style={{
            width: '80px',
            height: '80px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}>
            🏥
          </div>
          
          <h1 style={{
            margin: '0 0 10px 0',
            fontSize: '28px',
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            MediScript Pro
          </h1>
          <p style={{
            margin: '0 0 20px 0',
            fontSize: '16px',
            opacity: 0.9,
            fontWeight: '300'
          }}>
            Digital Prescription Management System
          </p>
          
          {/* Date and Time */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: '12px',
            fontSize: '14px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontWeight: '600' }}>{formatTime(currentTime)}</div>
            <div style={{ opacity: 0.8, fontSize: '12px' }}>{formatDate(currentTime)}</div>
          </div>
        </div>

        <div style={{ padding: '30px' }}>
          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '30px',
            position: 'relative'
          }}>
            <button
              onClick={() => setActiveTab('login')}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                background: activeTab === 'login' ? '#4facfe' : 'transparent',
                color: activeTab === 'login' ? 'white' : '#666',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                zIndex: 1
              }}
            >
              🔐 Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                background: activeTab === 'signup' ? '#4facfe' : 'transparent',
                color: activeTab === 'signup' ? 'white' : '#666',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                zIndex: 1
              }}
            >
              ✨ Create Account
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} style={{ animation: 'slideIn 0.3s ease' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#333',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  👤 Username
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  value={loginData.username}
                  onChange={handleLoginChange}
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '12px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    background: '#fafbfc'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4facfe';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 4px rgba(79, 172, 254, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e1e5e9';
                    e.target.style.background = '#fafbfc';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your username"
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#333',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  🔒 Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={loginData.password}
                    onChange={handleLoginChange}
                    style={{
                      width: '100%',
                      padding: '16px',
                      paddingRight: '50px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '12px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box',
                      background: '#fafbfc'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#4facfe';
                      e.target.style.background = 'white';
                      e.target.style.boxShadow = '0 0 0 4px rgba(79, 172, 254, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e1e5e9';
                      e.target.style.background = '#fafbfc';
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '4px'
                    }}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: loading ? '#ccc' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(79, 172, 254, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(79, 172, 254, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Signing In...
                  </span>
                ) : (
                  '🚀 Sign In to Dashboard'
                )}
              </button>

              {/* Test Credentials */}
              <div style={{
                marginTop: '20px',
                padding: '16px',
                background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                borderRadius: '12px',
                fontSize: '13px',
                border: '1px solid rgba(79, 172, 254, 0.2)'
              }}>
                <div style={{ fontWeight: '600', color: '#1976d2', marginBottom: '8px' }}>
                  🧪 Test Credentials
                </div>
                <div style={{ color: '#5e35b1' }}>
                  <strong>Username:</strong> doctor2<br />
                  <strong>Password:</strong> TestPass123!
                </div>
              </div>
            </form>
          )}

          {/* Signup Form */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignup} style={{ animation: 'slideIn 0.3s ease' }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    color: '#333',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    👤 Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    required
                    value={signupData.username}
                    onChange={handleSignupChange}
                    style={{
                      width: '100%',
                      padding: '14px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '10px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      background: '#fafbfc'
                    }}
                    placeholder="Choose a username"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    color: '#333',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    📧 Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={signupData.email}
                    onChange={handleSignupChange}
                    style={{
                      width: '100%',
                      padding: '14px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '10px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      background: '#fafbfc'
                    }}
                    placeholder="your.email@hospital.com"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    color: '#333',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    👨‍⚕️ Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={signupData.name}
                    onChange={handleSignupChange}
                    style={{
                      width: '100%',
                      padding: '14px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '10px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      background: '#fafbfc'
                    }}
                    placeholder="Dr. John Smith"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    color: '#333',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    🩺 Role
                  </label>
                  <select
                    name="role"
                    value={signupData.role}
                    onChange={handleSignupChange}
                    style={{
                      width: '100%',
                      padding: '14px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '10px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      background: '#fafbfc'
                    }}
                  >
                    <option value="doctor">👨‍⚕️ Doctor</option>
                    <option value="admin">👨‍💼 Admin</option>
                    <option value="pharmacist">💊 Pharmacist</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    color: '#333',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    🔒 Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={signupData.password}
                    onChange={handleSignupChange}
                    style={{
                      width: '100%',
                      padding: '14px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '10px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      background: '#fafbfc'
                    }}
                    placeholder="Create a strong password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: loading ? '#ccc' : 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)',
                  marginTop: '20px'
                }}
              >
                {loading ? '⏳ Creating Account...' : '✨ Create My Account'}
              </button>

              <div style={{
                marginTop: '16px',
                padding: '14px',
                background: 'linear-gradient(135deg, #f0f4f8 0%, #e8f5e8 100%)',
                borderRadius: '10px',
                fontSize: '12px',
                color: '#2d5016',
                border: '1px solid rgba(45, 80, 22, 0.1)'
              }}>
                ✓ Choose a unique username (no @ symbol)<br />
                ✓ Use your professional email address<br />
                ✓ Password should be strong and secure
              </div>
            </form>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Login;