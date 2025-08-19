import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../hooks/AuthContext';

export default function UserHeader() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user?.name || 'Misafir'}</Text>
      <Text style={styles.balance}>{user?.balance || "0"} TL</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    right: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontWeight: '600',
    marginRight: 8,
    color: '#333',
  },
  balance: {
    fontWeight: 'bold',
    color: '#2ecc71',
  },
});