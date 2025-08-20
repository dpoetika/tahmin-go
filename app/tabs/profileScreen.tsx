import { Ionicons } from '@expo/vector-icons';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from '../hooks/AuthContext';



export default function ProfileScreen() {
  const { user, logout, isLoading, updateUser } = useAuth();
  // Kullanıcı verilerini context'ten al
  const profileData = {
    name: user?.username || "Misafir Kullanıcı",
    balance:user?.balance || 200,
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    stats: {
      posts: 24,
      followers: 156,
      following: 89,
    },
    bio: "React Native geliştiricisi ve teknoloji meraklısı"
  };


  return (
  <View style={styles.container}>
    {/* Profil Başlık */}
    <View style={styles.profileHeader}>
      <Image 
        source={{ uri: profileData.avatar }} 
        style={styles.avatar}
      />
      <Text style={styles.name}>{profileData.name}</Text>
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

    {/* Kuponlar */}
    <FlatList
      data={Object.entries(user?.coupons || {})} // [key, value] olarak alıyoruz
      keyExtractor={([key]) => key}
      renderItem={({ item }) => {
        const [key, coupon] = item;
        return (
          <View style={styles.couponCard}>
            <Text style={styles.couponTitle}>Kupon #{key}</Text>
            <Text>Bahis: {coupon.betAmount} ₺</Text>
            <Text>Oran: {coupon.odd}</Text>

            {coupon.matches.map((m: any, idx: number) => (
              <Text key={idx} style={styles.matchText}>
                <Text style={styles.matchText}>
                  {m.taraflar.split(" - ")[0]} vs {m.taraflar.split(" - ")[1]} | {m.iddaa} {m.tahmin} | {m.oran}
                </Text>
              </Text>
            ))}
          </View>
        );
      }}
    />

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
  );}


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
  couponCard: {
  backgroundColor: "#fff",
  padding: 12,
  borderRadius: 10,
  marginVertical: 8,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 5,
  elevation: 3,
},
couponTitle: {
  fontWeight: "bold",
  fontSize: 16,
  marginBottom: 6,
},
matchText: {
  fontSize: 14,
  color: "#444",
},

});