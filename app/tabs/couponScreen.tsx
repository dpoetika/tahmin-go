import { BASE_URL } from '@env';
import { FontAwesome } from '@expo/vector-icons'; // Expo kullanıyorsan
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from '../hooks/AuthContext';
import { CouponContext } from "../hooks/CouponContext";

const couponScreen = () => {
  const { coupon, removeFromCoupon,resetCoupon } = useContext(CouponContext);
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState("")
  const [odd, setOdd] = useState(1);
  const [bet, setBet] = useState(1);
  const {updateUser,user} = useAuth()
  
  const postCoupons = (amount: number) => {
    seterror("");
    setLoading(true);

    fetch(`${BASE_URL}/coupons/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({
        username: user?.username,
        coupons: coupon,
        betAmount: amount,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json();
          console.log(errData);
          throw new Error(errData.error || "Bir hata oluştu");
        }
        return res.json();
      })
      .then(() => {
        const newKey = `-${Date.now().toString(36)}`;

        // 👇 coupon'u düzgün obje haline getiriyoruz
        const newCoupon = {
          betAmount: amount,
          matches: coupon, // senin CouponContext’ten gelen array
          odd: odd,
        };

        const userData:any = {
          balance: String(Number(user?.balance) - amount),
          coupons: {
            ...user?.coupons,
            [newKey]: newCoupon, // ✅ object ekleniyor
          },
        };

        console.log("-----");
        console.log(userData);
        console.log("-----");

        updateUser(userData);
        resetCoupon();
      })
      .catch((err) => {
        console.error(err);
        seterror(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    changeTotalWin();
  }, [coupon]);
  const changeTotalWin = (): void => {
    let totalOdd = 1;
    for (let index = 0; index < coupon.length; index++) {
      const element = coupon[index];
      totalOdd *= Number(element.oran);
    }
    setOdd(totalOdd);
  };


  if (loading) {
        return (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      }
  

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Kuponum</Text>

      {coupon.length === 0 ? (
        <Text>Kuponunuz boş</Text>
      ) : (
        
      <FlatList
        data={coupon}
        keyExtractor={(item) => item.id + item.iddaa + item.tahmin}
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
            <Text style={styles.teams}>{item.taraflar}</Text>

            {/* İddaa ve Tahmin */}
            <View style={styles.row}>
              <Text style={styles.iddaa}>{item.iddaa}</Text>
              <Text style={styles.tahmin}>{item.tahmin}</Text>
            </View>

            {/* Oran */}
            <Text style={styles.odd}>Oran: <Text style={styles.oddValue}>{item.oran}</Text></Text>
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
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}


export default couponScreen

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: { marginTop: 10, color: "red", fontSize: 16 },

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
