import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

type ScheduleItem = { id: string; title: string };

export default function ScheduleScreen() {
  const [data, setData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('https://httpsflaskexample-frei2y7aaa-uc.a.run.app/details')
      .then((res) => res.json())
      .then((json) => {
        // Object'ten array oluştur
        const arr: ScheduleItem[] = Object.entries(json).map(([id, title]) => ({
          id,
          title: String(title),
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

  return (
    <FlatList<ScheduleItem>
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        
        
        <Pressable
            style={styles.card}
            onPress={() =>
                router.push({ pathname: '/matchDetail/[key]' as any, params: { key: item.id } })
        }
        >
            <View style={styles.cardHeader}>
                <Text style={styles.league}>{item.title.split("Maç Detayı - ")[1]}</Text>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.title}>{item.title.split("Maç Detayı -")[0]}</Text>
                <View style={styles.oddContainer}>
                <View style={styles.oddCard}>
                        <View style={styles.oddBody}>
                            <Text style={styles.title}>1.56</Text>
                        </View>
                        <View style={styles.oddHeader}>
                            <Text style={{fontSize: 14,fontWeight: '500',color:"white"}}>MS 0</Text>
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
  title: {
    fontSize: 14,
    fontWeight: '500',
  },
  cardHeader:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    backgroundColor: '#004080', // header üst kısmının arkaplan rengi
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  league: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#004080',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardBody: {
    
    backgroundColor: '#fff', // card içeriği beyaz
    padding: 12,
  },
  oddContainer: {
    flexDirection: 'row', // kartları yan yana diz
  },
  oddCard: {
    flex: 1, // kartlar eşit genişlikte
    flexDirection: 'column', // header ve body alt alta
    alignItems: 'stretch', // child genişlikleri kart genişliğine eşit
    marginHorizontal: 5, // isteğe bağlı küçük boşluk
  },
  oddHeader: {
    backgroundColor: '#737373',
    padding: 10,
    alignItems: 'center', // yazıyı ortala
    borderWidth:0,
    borderBottomLeftRadius:15,
    borderBottomRightRadius:15,
  },
  oddBody: {
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center', // yazıyı ortala
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
    borderWidth:1,
  },

});
