import { BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
type User = {
  username: string;
  balance:string;
  coupons:any[];
  token:string,
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isLoggedIn: false,
  login: async () => {},
  logout: async () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const [userData, token] = await Promise.all([
          AsyncStorage.getItem('userData'),
          AsyncStorage.getItem('userToken')
        ]);

        if (userData && token) {
          setUser(JSON.parse(userData));
          setIsLoggedIn(true);
        } else {
          await AsyncStorage.multiRemove(['userToken', 'userData']);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (username: string, password: string) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    // ❌ burada then kullanma
    if (!response.ok) {
      const res: any = await response.json();   // ✅ await ile çöz
      throw new Error(res.error || 'Login failed');
    }

    const responseData = await response.json();
    console.log(responseData);

    // Sunucudan gelen verilerle userData oluştur
    const userData: User = {
      username: responseData.username || username,
      balance: responseData.balance,
      coupons: responseData.coupons,
      token: responseData.token,
    };

    const fakeToken = 'fake-jwt-token';
    await Promise.all([
      AsyncStorage.setItem('userToken', fakeToken),
      AsyncStorage.setItem('userData', JSON.stringify(userData)),
    ]);

    setUser(userData);
    setIsLoggedIn(true);
    router.replace('/tabs/homeScreen');
  } catch (error: any) {
    console.error('Login error:', error);
    Alert.alert('Login Failed', error.message);
  }
};

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData']);
      setUser(null);
      setIsLoggedIn(false);
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      try {
        const updatedUser = { ...user, ...userData };
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } catch (error) {
        console.error('Update user error:', error);
      }
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isLoggedIn, 
        login, 
        logout, 
        updateUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;