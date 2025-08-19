import { FontAwesome } from '@expo/vector-icons'; // Expo kullanıyorsan
import React, { useContext, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from '../hooks/AuthContext';
import { CouponContext } from "../hooks/CouponContext";

const couponScreen = () => {
  const { coupon, removeFromCoupon,resetCoupon } = useContext(CouponContext);
  const [loading, setLoading] = useState(true);
  const [odd, setOdd] = useState(1);
  const [bet, setBet] = useState(1);
  const {updateUser,user} = useAuth()
  
  const postCoupons = (amount:number)=> {
    fetch('https://httpsflaskexample-frei2y7aaa-uc.a.run.app/coupons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: user?.username,
        coupons:coupon,
        betAmount:amount,
      })
    }).then(()=>{
      const userData = {
        balance:String(Number(user?.balance)-amount),
      };
      updateUser(userData)
      resetCoupon()
    })
      .catch(err => console.error(err));
  };
  useEffect(() => {
    changeTotalWin();
  }, [coupon]);
  const changeTotalWin = (): void => {
    let totalOdd = 1;
    for (let index = 0; index < coupon.length; index++) {
      const element = coupon[index];
      totalOdd *= Number(element.Oran);
    }
    setOdd(totalOdd);
  };
  

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Kuponum</Text>

      {coupon.length === 0 ? (
        <Text>Kuponunuz boş</Text>
      ) : (
        
      <FlatList
        data={coupon}
        keyExtractor={(item) => item.id + item.iddaa + item.Tahmin}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.couponCard}>
            {/* Sil Butonu Sağ Üstte */}
            <Pressable
              style={styles.removeIcon}
              onPress={() => removeFromCoupon(item.id)}
            >
              <FontAwesome name="trash" size={20} color="#fff" />
            </Pressable>

            {/* Maç Tarafları */}
            <Text style={styles.teams}>{item.Taraflar}</Text>

            {/* İddaa ve Tahmin */}
            <View style={styles.row}>
              <Text style={styles.iddaa}>{item.iddaa}</Text>
              <Text style={styles.tahmin}>{item.Tahmin}</Text>
            </View>

            {/* Oran */}
            <Text style={styles.odd}>Oran: <Text style={styles.oddValue}>{item.Oran}</Text></Text>
          </View>
        )}
      />


        
        
      )}
      <View style={styles.container}>
      {/* Sol taraf */}
      <View style={styles.left}>
        <Text style={styles.row}>
          <Text style={styles.label}>Kupon Bedeli: </Text>
          <Text style={styles.value}>{bet} TL</Text>
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Toplam Oran: </Text>
          <Text style={styles.value}>{odd.toFixed(2)}</Text>
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Maks. Kazanç: </Text>
          <Text style={styles.value}>{(bet * odd).toFixed(2)} TL</Text>
        </Text>
      </View>

      {/* Sağ taraf */}
      <View style={styles.right}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={bet.toString()}
          onChangeText={(val) => setBet(Number(val) || 0)}
        />
        <Pressable style={styles.button} onPress={()=>postCoupons(bet)}>
          <Text style={styles.buttonText}>HEMEN OYNA</Text>
        </Pressable>
      </View>
    </View>
    </View>
  );
}


export default couponScreen

const styles = StyleSheet.create({
  couponCard: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    position: 'relative', // Sil butonu için
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  removeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 20,
  },
  teams: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  iddaa: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffd700',
  },
  tahmin: {
    marginHorizontal:5,
    fontSize: 14,
    fontWeight: '600',
    color: '#00ff99',
  },
  odd: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  oddValue: {
    fontWeight: '700',
    color: '#ff9900',
  },
  



  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1c1c1c",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flex: 1,
    justifyContent: "space-between",
  },
  right: {
    alignItems: "center",
  },
  /*
  row: {
    marginVertical: 4,
  },
  */
  label: {
    color: "#aaa",
    fontSize: 14,
  },
  value: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    textAlign: "center",
    fontSize: 16,
    width: 80,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#6c63ff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
