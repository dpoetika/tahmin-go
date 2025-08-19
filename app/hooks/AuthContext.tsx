import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
  balance:string;
  avatar?: string;
  joinDate?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
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

  const login = async (email: string, password: string) => {
    try {
      // Örnek authentication (gerçek projede API çağrısı yapılmalı)
      if (email === 'test@test.com' && password === '123456') {
        const fakeToken = 'fake-jwt-token';
        const userData: User = {
          id: '1',
          name: 'Test Kullanıcı',
          email: email,
          balance:"200",
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          joinDate: new Date().toLocaleDateString('tr-TR')
        };

        await Promise.all([
          AsyncStorage.setItem('userToken', fakeToken),
          AsyncStorage.setItem('userData', JSON.stringify(userData))
        ]);

        setUser(userData);
        setIsLoggedIn(true);
        router.replace('/tabs/homeScreen');
      } else {
        throw new Error('Geçersiz email veya şifre');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Hata yukarı fırlatılıyor
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