import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../hooks/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('test@test.com');
  const [password, setPassword] = useState('123456');
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error:any) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20, textAlign: 'center' }}>Login</Text>
      
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 }}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 }}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 5 }}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          {isLoading ? 'Loading...' : 'Login'}
        </Text>
      </TouchableOpacity>

      {/* Test bilgileri */}
      <Text style={{ marginTop: 20, color: 'gray', textAlign: 'center' }}>
        Test kullanıcısı: test@test.com / 123456
      </Text>
    </View>
  );
}