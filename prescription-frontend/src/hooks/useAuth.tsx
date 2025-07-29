// // hooks/useAuth.tsx
// import { useState, useEffect, createContext, useContext } from 'react';
// import type { ReactNode } from 'react';

// const API_BASE_URL = 'https://ich7ycwdq2.execute-api.ap-south-1.amazonaws.com/prod';

// interface User {
//   username: string;
//   email: string;
//   name: string;
//   role: string;
// }

// interface AuthContextType {
//   user: User | null;
//   signIn: (username: string, password: string) => Promise<void>;
//   signOut: () => void;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check if user is already logged in
//     const token = localStorage.getItem('accessToken');
//     const userData = localStorage.getItem('user');
    
//     if (token && userData) {
//       try {
//         setUser(JSON.parse(userData));
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('user');
//       }
//     }
//     setLoading(false);
//   }, []);

//   const signIn = async (username: string, password: string): Promise<void> => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username,
//           password
//         })
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Login failed');
//       }

//       // Store tokens
//       localStorage.setItem('accessToken', data.accessToken);
//       localStorage.setItem('idToken', data.idToken);
//       localStorage.setItem('refreshToken', data.refreshToken);
//       localStorage.setItem('user', JSON.stringify(data.user));

//       setUser(data.user);
//     } catch (error) {
//       console.error('Sign in error:', error);
//       throw error;
//     }
//   };

//   const signOut = () => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('idToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   const value = {
//     user,
//     signIn,
//     signOut,
//     loading
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface User {
  username: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  signIn: () => Promise<void>;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const signIn = async (): Promise<void> => {
    // ✅ Simulated user data
    const fakeUser: User = {
      username: 'doctor2',
      email: 'doctor2@example.com',
      name: 'Dr. John Doe',
      role: 'doctor',
    };

    localStorage.setItem('user', JSON.stringify(fakeUser));
    setUser(fakeUser);
  };

  const signOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    signIn,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

