import { BASE_URL } from '@env';
import { useLocalSearchParams } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { CouponContext } from '../hooks/CouponContext';

export default function MatchDetailScreen() {
  const params = useLocalSearchParams<{ key: string }>();
  const matchKey = Array.isArray(params.key) ? params.key[0] : params.key;

  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const { addToCoupon, coupon } = useContext(CouponContext);
  
  const routes = [
    { key: 'taraf', title: 'Taraf' },
    { key: 'korner', title: 'Korner/Kart' },
    { key: 'goller', title: 'Goller' },
    { key: 'altust', title: 'Alt/Üst' },
  ];

  useEffect(() => {
    fetch(`${BASE_URL}/matches/details/${matchKey}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [matchKey]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }




  // Taraf verilerini hazırla
  const tarafData = data.Taraf ? Object.entries(data.Taraf).map(([key, value]: [string, any]) => ({
    title: key,
    odds: value
  })) : [];

  // Korner/Kart verilerini hazırla
  const kornerData = data.Korner_Kart ? Object.entries(data.Korner_Kart).map(([key, value]: [string, any]) => ({
    title: key,
    odds: value
  })) : [];

  // Goller verilerini hazırla
  const gollerData = data.Goller ? Object.entries(data.Goller).map(([key, value]: [string, any]) => ({
    title: key,
    odds: value
  })) : [];

  // Alt/Üst verilerini hazırla
  const altustData = data.Alt_Üst ? Object.entries(data.Alt_Üst).map(([key, value]: [string, any]) => ({
    title: key,
    odds: value
  })) : [];
  

  // Dinamik renderScene fonksiyonu
  const renderScene = ({ route }: { route: { key: string } }) => {
    let currentData: any[] = [];
    
    switch (route.key) {
      case 'taraf':
        currentData = tarafData;
        break;
      case 'korner':
        currentData = kornerData;
        break;
      case 'goller':
        currentData = gollerData;
        break;
      case 'altust':
        currentData = altustData;
        break;
      default:
        currentData = [];
    }

    return (
      <FlatList
        data={currentData}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title.replace("_","/")}</Text>
            <View style={styles.oddsContainer}>
              {Object.entries(item.odds).map(([oddKey, oddValue]: [string, any]) => (
                <View key={oddKey} style={styles.oddItem}>
                  <Pressable
                    onPress={() => {
                      
                      const selectedOdd = {
                        id: matchKey,
                        taraflar: data.Taraflar,
                        iddaa:item.title.replace("_","/"),
                        oran: oddValue || "-",
                        tahmin:oddKey.replace("_","/"),
                      };
                      addToCoupon(selectedOdd);
                    }}
                  >
                    <View
                      style={[
                        styles.oddBody,
                        {
                          backgroundColor: coupon.find(
                            (c) => c.id === matchKey && c.iddaa === item.title.replace("_","/") && c.tahmin === oddKey.replace("_","/")
                          )
                            ? "green"
                            : "white",
                        },
                      ]}
                    >
                      <Text style={styles.oddValue}>{oddValue === '-' ? '-' : oddValue}</Text>
                    </View>
                  </Pressable>
                  <View style={styles.oddHeader}>
                    <Text style={styles.oddLabel}>{oddKey.replace("_","/")}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeader}>
        <Text style={styles.headerTitle}>{data.Lig}</Text>
        <Text style={styles.headerTeams}>{data.Taraflar}</Text>
        <View style={{flexDirection:"row",justifyContent:"space-between",}}>
          <Image 
            source={{ uri: data.Logolar.Evsahibi.replace("https","https:") }}
            style={{ width: 50, height: 50 }}
          />
          <Text style={styles.headerDate}>{data.Tarih}</Text>
          <Image 
            source={{ uri: data.Logolar.Deplasman.replace("https","https:") }}
            style={{ width: 50, height: 50 }}
          />
        </View>
        <Text style={styles.headerTeams}>{data.Saat}</Text>
        
      </View>
      
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'white' }}
            style={{ backgroundColor: 'red' }}
            tabStyle={{ backgroundColor: 'orange',padding:0}}
            activeColor="black"
            inactiveColor="white"
            pressColor="yellow"
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedHeader: {
    backgroundColor: '#004080',
    padding: 16,
    zIndex: 1000,
    elevation: 5,
  },
  headerCard: {
    backgroundColor: '#004080',
    padding: 16,
    borderRadius: 8,
    zIndex: 1000,
    elevation: 5,
  },
  headerTitle: {
    marginTop:"10%",
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerTeams: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerDate: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333333',
  },
  oddsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  oddItem: {
    width: '26%',
    marginBottom: 0,
    paddingBottom:10,
  },

  oddHeader: {
    backgroundColor: '#737373',
    padding: 2,
    alignItems: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginBottom: 0,
  },
  oddLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  oddBody: {
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
