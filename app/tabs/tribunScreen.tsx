import { BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const TribunScreen = () => {
  const [error, setError] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation:any = useNavigation()
  const router:any = useRouter()  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch(`${BASE_URL}/forum/blog`)
      .then((res) => res.json())
      .then((json) => {
        console.log('API Response:', json);
        
        if (json.blogs && typeof json.blogs === 'object') {
          // Tüm blogları düz bir array'e dönüştür
          const blogsArray:any[] = [];
          
          // Her kullanıcının bloglarını işle
          Object.entries(json.blogs).forEach(([post_id, post]) => {
            if (post_id && typeof post === 'object') {
              
              blogsArray.push({
                id:post_id,
                ...post,
              });
            }
          });
          
          // Tarihe göre sırala (yeniden eskiye)
          blogsArray.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          
          setData(blogsArray);
          console.log('Processed data:', blogsArray);
        } else {
          setError('Blog verileri alınamadı');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Veriler yüklenirken hata oluştu');
        setLoading(false);
      });
  };

  const formatDate = (dateString:any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculatePotentialWin = (coupon:any) => {
    if (!coupon) return 0;
    return (coupon.betAmount * coupon.odd).toFixed(2);
  };

  const renderMatchItem = (match:any, index:any) => (
    <View key={index} style={styles.matchItem}>
      <Text style={styles.matchTeams}>{match.taraflar}</Text>
      <Text style={styles.matchPrediction}>
        {match.oran}
      </Text>
      <Text style={styles.matchType}>{match.iddaa} {match.tahmin}</Text>
    </View>
  );

  const renderBlogCard = (blog:any) => (
    <TouchableOpacity 
      key={blog.id} 
      style={styles.blogCard}
      onPress={() => {
        console.log(`Gonderildi ${blog.id} ${blog.author} ${blog.coupon}`)
        router.push({
          pathname: "detailScreens/blogs",
          params: {
            id: blog.id,
            author: blog.author,
            coupons:JSON.stringify(blog.coupon)
          },
        });
      }}
    >
      <View style={styles.blogHeader}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: `https://ui-avatars.com/api/?name=${blog.author}&background=random` }}
            style={styles.avatar}
          />
          <Text style={styles.username}>@{blog.author}</Text>
        </View>
        <Text style={styles.date}>{timeStamp(blog.created_at)}</Text>
      </View>

      <Text style={styles.blogTitle}>{blog.title}</Text>
      
      {blog.coupon && (
        <View style={styles.couponSection}>
          <Text style={styles.sectionTitle}>Kupon Detayları</Text>
          
          <View style={styles.couponInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Bahis:</Text>
              <Text style={styles.infoValue}>{blog.coupon.betAmount} ₺</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Oran:</Text>
              <Text style={styles.infoValue}>{(blog.coupon.odd).toFixed(2)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Kazanç:</Text>
              <Text style={[styles.infoValue, styles.winAmount]}>
                {calculatePotentialWin(blog.coupon)} ₺
              </Text>
            </View>
          </View>

          <Text style={styles.matchesTitle}>Maçlar:</Text>
          {blog.coupon.matches && blog.coupon.matches.map(renderMatchItem)}
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Bloglar yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Henüz blog paylaşılmamış</Text>
          <Text style={styles.emptySubtext}>İlk blogu paylaşan siz olun!</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchData}
              colors={['#007AFF']}
            />
          }
        >
          {data.map(renderBlogCard)}
        </ScrollView>
      )}
    </View>
  );
};

export default TribunScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  scrollView: {
    flex: 1,
  },
  blogCard: {
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
  blogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  username: {
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  couponSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
    marginBottom: 16,
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
  winAmount: {
    color: '#34C759',
  },
  matchesTitle: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  matchItem: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  matchTeams: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  matchPrediction: {
    color: '#007AFF',
    fontWeight: '500',
  },
  matchType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

// RefreshControl için import eklemeyi unutmayın
import { RefreshControl } from 'react-native';
import timeStamp from '../utils/timeStamp';

