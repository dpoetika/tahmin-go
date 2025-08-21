import FontAwesome from '@expo/vector-icons/build/FontAwesome'
import React, { useContext, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { useAuth } from '../hooks/AuthContext'

import { BASE_URL } from '@env'
import { CouponContext } from '../hooks/CouponContext'

const myCoupons = () => {
    const { user } = useAuth();
  const { coupon } = useContext(CouponContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [sharingId, setSharingId] = useState<string | null>(null); // Hangi kuponun paylaşıldığını takip etmek için

  const shareCoupon = (id: any) => {
    console.log(user?.coupons?.[id]);
    setError("");
    setSuccessMessage("");
    setSharingId(id);
    setLoading(true);
    
    const newKey = `-${Date.now().toString(36)}`;
    
    fetch(`${BASE_URL}/forum/blog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({
        username: user?.username,
        coupons: user?.coupons?.[id],
        id: newKey,
      }),
    })
    .then(async (res) => {
      if (!res.ok) {
        const errData = await res.json();
        console.log(errData);
        throw new Error(errData.error || "Paylaşım sırasında bir hata oluştu");
      }
      return res.json();
    })
    .then((data) => {
      // Başarılı bildirim göster
      setSuccessMessage("Kupon başarıyla tribünde paylaşıldı!");
      
      // 3 saniye sonra başarı mesajını gizle
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      
      // Alert ile de bildirim göster (opsiyonel)
      Alert.alert("Başarılı", "Kuponunuz tribünde paylaşıldı!", [
        { text: "Tamam", onPress: () => console.log("OK Pressed") }
      ]);
    })
    .catch((err) => {
      console.error(err);
      setError(err.message);
      
      // Hata alert'i göster
      Alert.alert("Hata", err.message, [
        { text: "Tamam", onPress: () => console.log("OK Pressed") }
      ]);
    })
    .finally(() => {
      setLoading(false);
      setSharingId(null);
    });
  };

  return (
    <View style={styles.container}>
      {/* Başarı Mesajı */}
      {successMessage ? (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      ) : null}
      
      {/* Hata Mesajı */}
      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => setError("")}>
            <Text style={styles.dismissText}>Kapat</Text>
          </Pressable>
        </View>
      ) : null}

      <FlatList
        data={Object.entries(user?.coupons || {})}
        keyExtractor={([key]) => key}
        renderItem={({ item }) => {
          const [key, couponData] = item;
          const isSharing = sharingId === key;
          
          return (
            <View style={styles.couponCard}>
              {/* Paylaşım Butonu ve Durum Göstergesi */}
              <View style={styles.cardHeader}>
                <Text style={styles.couponTitle}>Kupon #{key}</Text>
                
                <Pressable
                  style={[styles.shareButton, isSharing && styles.shareButtonDisabled]}
                  onPress={() => shareCoupon(key)}
                  disabled={isSharing || loading}
                >
                  {isSharing ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <FontAwesome name="share-alt" size={18} color="#fff" />
                  )}
                </Pressable>
              </View>
              
              <Text>Bahis: {couponData.betAmount} ₺</Text>
              <Text>Oran: {couponData.odd}</Text>
              <Text>Toplam Kazanç: {(couponData.betAmount * couponData.odd).toFixed(2)} ₺</Text>

              {couponData.matches.map((m: any, idx: number) => (
                <View key={idx} style={styles.matchItem}>
                  <Text style={styles.matchTeams}>{m.taraflar}</Text>
                  <Text style={styles.matchDetails}>
                    {m.iddaa} | {m.tahmin} @ {m.oran}
                  </Text>
                </View>
              ))}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="ticket" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Henüz kuponunuz bulunmamaktadır</Text>
          </View>
        }
      />
    </View>
  );
};

export default myCoupons

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  successBanner: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  successText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    fontWeight: 'bold',
    flex: 1,
  },
  dismissText: {
    color: 'white',
    fontWeight: 'bold',
    padding: 5,
  },
  couponCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  couponTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  shareButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonDisabled: {
    backgroundColor: '#ccc',
  },
  matchItem: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  matchTeams: {
    fontWeight: '600',
    color: '#333',
  },
  matchDetails: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

})