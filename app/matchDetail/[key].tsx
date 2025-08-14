import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';

interface MatchDetailItem {
  key: string;
  value: string | number;
}

export default function MatchDetailScreen() {
  const params = useLocalSearchParams<{ key: string }>();
  const matchKey = Array.isArray(params.key) ? params.key[0] : params.key;

  const [data, setData] = useState<MatchDetailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const routes = [
    { key: 'match', title: 'Maç Sonucu' },
    { key: 'corner', title: 'Korner' },
  ];

  useEffect(() => {
    fetch(`https://httpsflaskexample-frei2y7aaa-uc.a.run.app/details/${matchKey}`)
      .then((res) => res.json())
      .then((json: Record<string, string | number>) => {
        const arr: MatchDetailItem[] = Object.entries(json).map(([key, value]) => ({
          key,
          value,
        }));
        setData(arr);
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

  // Verileri filtrele
  const matchResults = data.filter(item => item.key.includes("Maç Sonucu"));
  const corners = data.filter(item => item.key.includes("Korner"));

  

  // Dinamik renderScene fonksiyonu
  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'match':
        return (
          <FlatList
            data={matchResults}
            keyExtractor={(item) => item.key}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.title}>{item.key}</Text>
                <Text style={styles.subtitle}>{item.value}</Text>
              </View>
            )}
          />
        );
      case 'corner':
        return (
          <FlatList
            data={corners}
            keyExtractor={(item) => item.key}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.title}>{item.key}</Text>
                <Text style={styles.subtitle}>{item.value}</Text>
              </View>
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={props => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: 'blue' }}
          style={{ backgroundColor: 'green' }}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
