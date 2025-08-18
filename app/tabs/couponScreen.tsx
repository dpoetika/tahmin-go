import React, { useContext, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { CouponContext } from "../context/CouponContext";


const couponScreen = () => {
  const { coupon, removeFromCoupon } = useContext(CouponContext);
  const [loading, setLoading] = useState(true);
  
  const postCoupons = ()=> {
    console.log(coupon)
    fetch('https://httpsflaskexample-frei2y7aaa-uc.a.run.app/coupons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Ahmet',
        coupons:coupon
      })
    })
      .then(res => res.json())
      .then(json => {
        console.log('POST cevabı:', json);
      })
      .catch(err => console.error(err));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Kuponum</Text>

      {coupon.length === 0 ? (
        <Text>Kuponunuz boş</Text>
      ) : (
        <FlatList
          data={coupon}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.couponCard}>
              <Text style={styles.teams}>{item.Taraflar}</Text>
              <Text style={styles.odd}>{item.iddaa}</Text>
              <Text style={styles.odd}>Oran: {item.Oran}</Text>

              <Pressable
                style={styles.removeButton}
                onPress={() => removeFromCoupon(item.id)}
              >
                <Text style={{ color: "white" }}>Sil</Text>
              </Pressable>
            </View>
          )}
        />
        
      )}
      <Pressable
        style={[styles.removeButton,{backgroundColor:"green"}]}
        onPress={() => postCoupons()}
      >
        <Text>OYNA</Text>
      </Pressable>
    </View>
  );
}


export default couponScreen

const styles = StyleSheet.create({
  couponCard: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#cce5ff",
    borderRadius: 8,
  },
  teams: { fontSize: 16, fontWeight: "bold" },
  odd: { fontSize: 14, marginTop: 5 },
  removeButton: {
    marginTop: 10,
    backgroundColor: "#ff4d4d",
    padding: 8,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
});
