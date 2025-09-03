import { BASE_URL } from "@env";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
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
import { useAuth } from "../hooks/AuthContext";
import { CouponContext } from "../hooks/CouponContext";
import formatTimeAgo from "../utils/timeStamp";

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
  const { id, author, coupons } = useLocalSearchParams<{
    id: string;
    author: string;
    coupons: string;
  }>();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [couponData, setCouponData] = useState<Coupon | null>(null);
  const { addToCoupon, coupon } = useContext(CouponContext);
  const router = useRouter();
  
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
  const fetchComments = async (id:string) => {
    try {
      setError(null);
      setLoading(true);
      const commentsResponse = await fetch(`${BASE_URL}/forum/comment?post_id=${id}`, {
        method: "GET", // yorumları çekiyoruz
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`, 
        },
      });

      if (!commentsResponse.ok) {
        throw new Error("Yorumlar yüklenemedi");
      }

      const commentsData = await commentsResponse.json();
      console.log("-------------------------------------------------------\n-----------------------------------\n---------------")
      console.log(commentsData.comments)
      const formattedComments: Comment[] = []
      Object.entries(commentsData.comments).forEach(([comment_id, value]:[any,any])=> {
          formattedComments.push({
            id: comment_id,
            username: value.username,
            text: value.comment,
            time: value.created_at,
          });
      })
      

      setComments(formattedComments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      console.error("Yorumlar çekilirken hata:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  // Sayfa yüklendiğinde yorumları çek
  useEffect(() => {
    fetchComments(id);
  }, [id]);

  // Yenileme fonksiyonu
  const onRefresh = () => {
    setRefreshing(true);
    fetchComments(id);
  };

  const handleAddComment = () => {
    setError("");
    setLoading(true);
    
    fetch(`${BASE_URL}/forum/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({
        username: user?.username,
        comment: newComment,
        post_id:id,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json();
          console.log(errData);
          throw new Error(errData.error || "Bir hata oluştu");
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => {
        onRefresh()
        setLoading(false);
      });
  };


  

  // Yorum render item
  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={styles.avatar}>
        <Image 
          source={{ uri: `https://ui-avatars.com/api/?name=${item.username}&background=random` }}
          style={{width: 36,height: 36,borderRadius: 18,marginRight: 8,}}
        />
      </View>
      <View style={styles.commentContent}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.commentText}>{item.text}</Text>
        <Text style={styles.timeText}>{formatTimeAgo(item.time)}</Text>
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
        <Text style={styles.retryText} onPress={()=>fetchComments(id)}>
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
       <View style={{marginTop:"15%",marginLeft:"5%"}}>
        <Image 
            source={{ uri: `https://ui-avatars.com/api/?name=${author}&background=random` }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              marginRight: 8,
            }}
          />
          <Text style={styles.blogAuthor}>@{author}</Text>
        </View>
        {/* Kupon Bilgileri */}
        {couponData && (
          <View style={styles.couponSection}>
            {/*-------------------------------------------------*/}

            <Text style={styles.sectionTitle}>Kupon Detayları</Text>
                      
              <View style={styles.couponInfo}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Bahis:</Text>
                  <Text style={styles.infoValue}>{couponData.betAmount} ₺</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Oran:</Text>
                  <Text style={styles.infoValue}>{couponData.odd.toFixed(2)}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Kazanç:</Text>
                  <Text style={[styles.infoValue, {color: '#34C759'}]}>
                    {(couponData.betAmount * couponData.odd).toFixed(2)} ₺
                  </Text>
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
  blogAuthor: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
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
    flexDirection: 'row',
    alignItems: 'center',
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






  couponSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 16,
    margin: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },

  couponInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

