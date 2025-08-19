import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from '../hooks/AuthContext';

export default function ProfileScreen() {
  const { user, logout, isLoading, updateUser } = useAuth();

  // Kullanıcı verilerini context'ten al
  const profileData = {
    name: user?.name || "Misafir Kullanıcı",
    email: user?.email || "email@example.com",
    balance:user?.balance || 200,
    joinDate: user?.joinDate || "Bilinmiyor",
    avatar: user?.avatar || "https://randomuser.me/api/portraits/men/1.jpg",
    stats: {
      posts: 24,
      followers: 156,
      following: 89,
    },
    bio: "React Native geliştiricisi ve teknoloji meraklısı"
  };

  const handleUpdateAvatar = () => {
    // Avatar güncelleme örneği
    updateUser({ 
      avatar: "https://randomuser.me/api/portraits/women/1.jpg" 
    });
  };

  return (
    <View style={styles.container}>
      {/* Profil Başlık */}
      <View style={styles.profileHeader}>
        <Pressable onPress={handleUpdateAvatar}>
          <Image 
            source={{ uri: profileData.avatar }} 
            style={styles.avatar}
          />
        </Pressable>
        <Text style={styles.name}>{profileData.name}</Text>
        <Text style={styles.email}>{profileData.email}</Text>
      </View>

      {/* İstatistikler */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{profileData.stats.posts}</Text>
          <Text style={styles.statLabel}>Gönderi</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{profileData.stats.followers}</Text>
          <Text style={styles.statLabel}>Takipçi</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{profileData.stats.following}</Text>
          <Text style={styles.statLabel}>Takip</Text>
        </View>
      </View>

      {/* Kullanıcı Bilgileri */}
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <Text style={styles.infoText}>Katılma Tarihi: {profileData.joinDate}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="document-text-outline" size={20} color="#666" />
          <Text style={styles.infoText}>Hakkımda: {profileData.bio}</Text>
        </View>
      </View>

      {/* Çıkış Yap Butonu */}
      <Pressable 
        style={({ pressed }) => [
          styles.logoutButton,
          { opacity: pressed ? 0.7 : 1 }
        ]}
        onPress={logout}
        disabled={isLoading}
      >
        <Ionicons name="exit-outline" size={20} color="white" />
        <Text style={styles.logoutText}>
          {isLoading ? "Çıkış Yapılıyor..." : "Çıkış Yap"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoContainer: {
    marginVertical: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#444',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 8,
    marginTop: 'auto',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});