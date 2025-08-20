import FontAwesome from '@expo/vector-icons/build/FontAwesome'
import React from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { useAuth } from '../hooks/AuthContext'

const myCoupons = () => {
    const {user} = useAuth()
    const shareCoupon=(id:any)=>{
        console.log(id)
    }
  return (
    <View>
      <FlatList
            data={Object.entries(user?.coupons || {})} // [key, value] olarak alıyoruz
            keyExtractor={([key]) => key}
            renderItem={({ item }) => {
              const [key, coupon] = item;
              return (
                <View style={styles.couponCard}>
                   
                    <Pressable
                    style={styles.shareButton}
                    onPress={() => shareCoupon(key)}
                    >
                    <FontAwesome name="share-alt" size={18} color="#fff" />
                    </Pressable>
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
    </View>
  )
}

export default myCoupons

const styles = StyleSheet.create({
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
shareButton: {
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: '#6c63ff',
  padding: 8,
  borderRadius: 20,
  zIndex: 1, // card üzerindeki diğer elemanların üstünde
},
})