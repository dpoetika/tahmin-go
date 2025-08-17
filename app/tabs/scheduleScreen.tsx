import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

export default function ScheduleScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const now = new Date();
  useEffect(() => {
    fetch('https://httpsflaskexample-frei2y7aaa-uc.a.run.app/details')
      .then((res) => res.json())
      .then((json) => {
        // Object'ten array oluştur
        const arr = Object.entries(json).map(([id, item]: [string, any]) => ({
          id,
          ...item
        }));
        setData(arr);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  
  const parseTurkishDate = (dateStr: string, timeStr: string): Date => {
    const [day, month, year] = dateStr.split(".").map(Number);
    const [hour, minute] = timeStr.split(":").map(Number);
    return new Date(year, month - 1, day, hour, minute);
  };
  
  const filteredData = data.filter((item) => {
    const matchDate = parseTurkishDate(item.Tarih, item.Saat);
    return matchDate > now;
  });
  const formatDate = (tarih: string, saat: string): string => {
    const date = parseTurkishDate(tarih, saat);
  
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
  
    const isSameDay = (a: Date, b: Date) =>
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear();
  
    if (isSameDay(date, today)) return `Bugün ${saat}`;
    if (isSameDay(date, tomorrow)) return `Yarın ${saat}`;
    if (isSameDay(date, yesterday)) return `Dün ${saat}`;
  
    return `${tarih} ${saat}`;
  };
  
  

  return (
    <FlatList
      data={filteredData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable
          style={styles.card}
          onPress={() =>
            router.push({ pathname: '/matchDetail/[key]' as any, params: { key: item.id } })
          }
        >
          <View style={styles.cardHeader}>
            <Text style={styles.league}>{item.Lig}</Text>
            <Text style={styles.date}>{formatDate(item.Tarih, item.Saat)}</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.teams}>⚽ {item.Taraflar}</Text>
            <View style={styles.oddContainer}>
              <View style={styles.oddCard}>
                <View style={styles.oddBody}>
                  <Text style={styles.oddValue}>{item["Maç Sonucu"]?.["1"] || "N/A"}</Text>
                </View>
                <View style={styles.oddHeader}>
                  <Text style={styles.oddLabel}>MS 1</Text>
                </View>
              </View>
              <View style={styles.oddCard}>
                <View style={styles.oddBody}>
                  <Text style={styles.oddValue}>{item["Maç Sonucu"]?.["X"] || "N/A"}</Text>
                </View>
                <View style={styles.oddHeader}>
                  <Text style={styles.oddLabel}>MS X</Text>
                </View>
              </View>
              <View style={styles.oddCard}>
                <View style={styles.oddBody}>
                  <Text style={styles.oddValue}>{item["Maç Sonucu"]?.["2"] || "N/A"}</Text>
                </View>
                <View style={styles.oddHeader}>
                  <Text style={styles.oddLabel}>MS 2</Text>
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 0,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#004080',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  league: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  date: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  cardBody: {
    backgroundColor: '#fff',
    padding: 12,
  },
  teams: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'left',
  },
  oddContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  oddCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    marginHorizontal: 20,
  },
  oddHeader: {
    backgroundColor: '#737373',
    padding: 0,
    alignItems: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  oddLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: 'white',
  },
  oddBody: {
    backgroundColor: 'white',
    padding: 2,
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  oddValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
});
