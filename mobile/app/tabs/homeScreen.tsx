import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function HomeScreen() {
  const [dailyChallenge, setDailyChallenge] = useState("Bugün 3 tahmin yap, 50 puan kazan!");
  const [userPoints, setUserPoints] = useState(1250);

  // Örnek eğlenceli içerikler
  const funContents = [
    {
      id: 1,
      title: "Şanslı Tahmin Oyunu",
      description: "Rastgele bir tahmin yap ve puan kazan!",
      icon: "🎯",
      color: "#FF6B6B"
    },
    {
      id: 2,
      title: "Günün İstatistiği",
      description: "Bugün en çok tahmin edilen sonuçlar",
      icon: "📊",
      color: "#4ECDC4"
    },
    {
      id: 3,
      title: "Tahmin Ligi",
      description: "Arkadaşlarınla yarış, lider ol!",
      icon: "🏆",
      color: "#FFD166"
    },
    {
      id: 4,
      title: "Şans Çarkı",
      description: "Çevir ve bonus puanlar kazan!",
      icon: "🎡",
      color: "#6A0572"
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Üst Bilgi */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Hoş Geldin, Tahminci! 👋</Text>
        </View>

        {/* Günlük Mücadele */}
        <View style={styles.dailyChallenge}>
          <Text style={styles.challengeTitle}>Günlük Mücadele 🎯</Text>
          <Text style={styles.challengeText}>{dailyChallenge}</Text>
          <TouchableOpacity style={styles.challengeButton}>
            <Text style={styles.challengeButtonText}>Başla</Text>
          </TouchableOpacity>
        </View>

        {/* Eğlenceli İçerikler Grid */}
        <Text style={styles.sectionTitle}>Eğlence Köşesi 🎪</Text>
        <View style={styles.gridContainer}>
          {funContents.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.gridItem, { backgroundColor: item.color }]}
            >
              <Text style={styles.gridIcon}>{item.icon}</Text>
              <Text style={styles.gridTitle}>{item.title}</Text>
              <Text style={styles.gridDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Hızlı Tahmin Önerileri */}
        <View style={styles.quickSuggestions}>
          <Text style={styles.sectionTitle}>Hızlı Tahminler ⚡</Text>
          <View style={styles.suggestionList}>
            <View style={styles.suggestionItem}>
              <Text style={styles.suggestionText}>⚽ En çok gol atacak takım?</Text>
              <TouchableOpacity style={styles.suggestionButton}>
                <Text style={styles.suggestionButtonText}>Tahmin Et</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.suggestionItem}>
              <Text style={styles.suggestionText}>🏀 Bugün kaç basket olur?</Text>
              <TouchableOpacity style={styles.suggestionButton}>
                <Text style={styles.suggestionButtonText}>Tahmin Et</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  dailyChallenge: {
    backgroundColor: '#667eea',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  challengeTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  challengeText: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  challengeButton: {
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
  },
  challengeButtonText: {
    color: '#667eea',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginVertical: 15,
    color: '#333',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#4ECDC4',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  gridIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  gridTitle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  gridDescription: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  quickSuggestions: {
    margin: 20,
  },
  suggestionList: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
  },
  suggestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
  suggestionButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  suggestionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});