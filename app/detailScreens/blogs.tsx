import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { CouponContext } from "../hooks/CouponContext";

type Match = {
    id: string;
    taraflar: string;
    iddaa: string;
    oran: string;
    tahmin: string;
}

// Coupon tipi
type Coupon = {
  betAmount: number;
  matches: Match[];
  odd: number;
}

// Yorum veri yapısı
interface Comment {
  id: string;
  username: string;
  text: string;
  time: string;
}

export default function BlogComments(){
  const { id, username, title, coupons } = useLocalSearchParams<{
    id: string;
    username: string;
    title: string;
    coupons: string;
  }>();
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [couponData, setCouponData] = useState<Coupon | null>(null);
  const { addToCoupon, coupon } = useContext(CouponContext);
  const router = useRouter();
  // coupon verisini işle
  useEffect(() => {
    if (coupons && typeof coupons === 'string') {
      try {
        const parsedCoupon: Coupon = JSON.parse(coupons);
        setCouponData(parsedCoupon);
        console.log('Parsed coupon:', parsedCoupon);
      } catch (err) {
        console.error('Coupon parse hatası:', err);
      }
    }
  }, [coupons]);

  // API'den yorum verilerini çek
  const fetchComments = async () => {
    try {
      setError(null);
      
      // Yorumları çek
      const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
      if (!commentsResponse.ok) throw new Error('Yorumlar yüklenemedi');
      
      const commentsData = await commentsResponse.json();
      const formattedComments: Comment[] = commentsData.map((comment: any, index: number) => ({
        id: comment.id.toString(),
        username: comment.email.split('@')[0],
        text: comment.body,
        time: index === 0 ? '2sa' : index === 1 ? '1sa' : `${30 + index}dk`
      }));
      
      setComments(formattedComments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      console.error('Yorumlar çekilirken hata:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Sayfa yüklendiğinde yorumları çek
  useEffect(() => {
    fetchComments();
  }, [id]);

  // Yenileme fonksiyonu
  const onRefresh = () => {
    setRefreshing(true);
    fetchComments();
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    // Burada API'ye gönderme veya state'e ekleme işlemi yapılabilir
    console.log("Yeni yorum:", newComment);
    setNewComment("");
  };

  // Yorum render item
  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.username[0].toUpperCase()}</Text>
      </View>
      <View style={styles.commentContent}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.commentText}>{item.text}</Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    </View>
  );

  // Maç render item
  const renderMatch = ({ item }: { item: Match }) => (
    <TouchableOpacity
    style={styles.pressableCard}
      onPress={() =>
        router.push({ pathname: '/detailScreens/[key]' as any, params: { key: item.id } })
      }
    >
            <Text style={styles.cardTitle}>{item.taraflar.replace("_","/")}</Text>
        <View style={styles.oddsContainer}>
            <Text style={{fontWeight:400}}>{item.iddaa.replace("_","/")}</Text>
            <View style={styles.oddItem}>
              <TouchableOpacity
                onPress={() => {
                  // Kupona ekleme
                  const selectedOdd = {
                    id: item.id,
                    taraflar: item.taraflar,
                    iddaa:item.iddaa.replace("_","/"),
                    oran: item.oran || "-",
                    tahmin:item.tahmin.replace("_","/"),
                  };
                  addToCoupon(selectedOdd);
                }}
              >
                <View
                  style={[
                    styles.oddBody,
                    {
                      backgroundColor: coupon.find(
                        (c) => c.id === item.id && c.iddaa === item.iddaa.replace("_","/") && c.tahmin === item.tahmin.replace("_","/")
                      )
                        ? "green"
                        : "white",
                    },
                  ]}
                >
                  <Text style={styles.oddValue}>{item.oran === '-' ? '-' : item.oran}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.oddHeader}>
                <Text style={styles.oddLabel}>{item.tahmin.replace("_","/")}</Text>
              </View>
            </View>
        </View>
    </TouchableOpacity>
  );

  // Loading durumu
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#405de6" />
        <Text style={styles.loadingText}>Yorumlar yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Hata: {error}</Text>
        <Text style={styles.retryText} onPress={fetchComments}>
          Tekrar Dene
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Blog Başlık */}
        <View style={styles.blogHeader}>
          <Text style={styles.blogTitle}>{title}</Text>
          <Text style={styles.blogAuthor}>@{username}</Text>
        </View>

        {/* Kupon Bilgileri */}
        {couponData && (
          <View style={styles.couponSection}>
            <Text style={styles.sectionTitle}>Kupon Detayları</Text>
            
            {/* Kupon Özeti */}
            <View style={styles.couponSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Toplam Oran:</Text>
                <Text style={styles.summaryValue}>{couponData.odd.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Bahis Miktarı:</Text>
                <Text style={styles.summaryValue}>{couponData.betAmount} ₺</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Potansiyel Kazanç:</Text>
                <Text style={styles.summaryValue}>{(couponData.betAmount * couponData.odd).toFixed(2)} ₺</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Maç Sayısı:</Text>
                <Text style={styles.summaryValue}>{couponData.matches.length}</Text>
              </View>
            </View>

            {/* Maç Listesi */}
            <Text style={styles.matchesTitle}>Maçlar</Text>
            <FlatList
              data={couponData.matches}
              keyExtractor={(item) => item.id} // Burada unique key kullanıyoruz
              renderItem={renderMatch}
              scrollEnabled={false}
              contentContainerStyle={styles.matchesList}
            />
          </View>
        )}

        {/* Yorumlar Listesi */}
        
          <View style={styles.commentsHeader}>
            <Text style={styles.commentsTitle}>Yorumlar</Text>
            <Text style={styles.commentCount}>{comments.length} yorum</Text>

            {/* Input ve buton */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Yorum yaz..."
                value={newComment}
                onChangeText={setNewComment}
              />
              <Button title="Gönder" onPress={handleAddComment} />
            </View>
          </View>
        
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id} // Burada da unique key kullanıyoruz
          renderItem={renderComment}
          scrollEnabled={false}
          contentContainerStyle={styles.commentsList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Henüz yorum yok</Text>
          }
        />
      </ScrollView>
    </SafeAreaView>
      </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#ff4757',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryText: {
    fontSize: 16,
    color: '#405de6',
    textDecorationLine: 'underline',
  },
  blogHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  blogTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  blogAuthor: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  couponSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f9fa',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  couponSummary: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryKey: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#405de6',
  },
  matchesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  matchesList: {
    paddingBottom: 10,
  },
  commentsHeader: {
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  commentCount: {
    color: "gray",
    marginBottom: 10,
  },
  commentsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#405de6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentContent: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  oddsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  oddItem: {
    width: '26%',
    marginBottom: 0,
    paddingBottom:10,
  },
  
  pressableCard:{
    backgroundColor: 'white',
    margin: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333333',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fff",
  },
});

