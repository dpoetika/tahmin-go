import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const tribunScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Maç Bilgisi</Text>
        <Text style={styles.detail}>Takımlar: Rangers - Club Brugge</Text>
        <Text style={styles.detail}>Tarih: 20 Ağustos 2025</Text>
        <Text style={styles.detail}>Oran: 2.38</Text>
      </View>
    </View>
  )
}

export default tribunScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',     // yatayda ortala
    paddingTop: 20,           // üstten boşluk bırak
    backgroundColor: '#f2f2f2',
  },
  card: {
    width: '90%',
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
})
