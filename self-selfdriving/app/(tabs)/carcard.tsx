// app/homescreen/carcard.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image'; // Thư viện ảnh tối ưu
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router'; // Dùng để điều hướng

// Import Interface và Màu sắc (Nhớ kiểm tra đường dẫn file constants của bạn)
import { CarListing, BRAND_COLOR, ACCENT_COLOR, DISCOUNT_COLOR } from '../../constants/_data'; 

// Ảnh dự phòng nếu link ảnh bị lỗi
const DEFAULT_IMAGE = 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800';

interface CarCardProps {
  item: CarListing;
}

// Hàm format tiền tệ (1200000 -> 1.200.000 ₫)
const formatCurrency = (value: number | string) => {
  if (!value) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value));
};

// Hàm chọn icon theo thông số
const getDetailIcon = (detail: string) => {
  const d = detail.toLowerCase();
  if (d.includes('tự động') || d.includes('sàn')) return 'car-shift-pattern';
  if (d.includes('chỗ')) return 'car-seat';
  if (d.includes('điện')) return 'lightning-bolt';
  if (d.includes('xăng')) return 'gas-station';
  if (d.includes('dầu')) return 'fuel';
  return 'information-outline';
};

const CarListingCard = React.memo<CarCardProps>(({ item }) => {
  // Xử lý chuỗi details: "Số tự động | 4 chỗ" -> ["Số tự động", "4 chỗ"]
  const detailsArray = item.details ? item.details.split('|').map((d) => d.trim()) : [];
  
  // State lưu nguồn ảnh (để xử lý khi ảnh lỗi)
  const [imageSource, setImageSource] = useState(item.imageUri ? { uri: item.imageUri } : { uri: DEFAULT_IMAGE });

  // === HÀM XỬ LÝ KHI BẤM VÀO XE ===
  const handlePress = () => {
    // Chuyển sang màn hình Schedule và mang theo thông tin xe
    router.push({
      pathname: '/(tabs)/schedule',
      params: { 
        carId: item._id,          // ID xe (Quan trọng để gửi API)
        carName: item.name,       // Tên xe để hiển thị
        pricePerDay: item.pricePerDay // Giá tiền
      }
    });
  };

  return (
    <TouchableOpacity 
      style={cardStyles.cardContainer} 
      activeOpacity={0.9}
      onPress={handlePress} // <--- Gắn sự kiện bấm vào đây
    >
      
      {/* === PHẦN 1: HÌNH ẢNH === */}
      <View style={cardStyles.imageWrapper}>
        <Image 
          source={imageSource} 
          style={cardStyles.carImage} 
          contentFit="cover"
          transition={500}
          cachePolicy="memory-disk"
          onError={() => setImageSource({ uri: DEFAULT_IMAGE })} // Tự động thay ảnh nếu lỗi
        />
        
        {/* Avatar chủ xe */}
        <View style={cardStyles.avatarContainer}>
            <Image 
              source={item.avatarUri || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
              style={cardStyles.avatar} 
              contentFit="cover"
            />
        </View>

        <TouchableOpacity style={cardStyles.favoriteIcon}>
          <Ionicons name="heart-outline" size={20} color="white" />
        </TouchableOpacity>

        {item.discount ? (
          <View style={cardStyles.discountBadge}>
            <Text style={cardStyles.discountText}>{item.discount}</Text>
          </View>
        ) : null}
      </View>

      {/* === PHẦN 2: THÔNG TIN === */}
      <View style={cardStyles.infoContainer}>
        <View style={cardStyles.topRow}>
          <View style={cardStyles.servicePill}>
            <Ionicons name="checkmark-circle" size={14} color={BRAND_COLOR} />
            <Text style={cardStyles.serviceText}>Miễn chấp</Text>
          </View>
          <View style={cardStyles.servicePill}>
            <Ionicons name="location" size={14} color={DISCOUNT_COLOR} />
            <Text style={cardStyles.serviceText}>Giao xe tận nơi</Text>
          </View>
        </View>

        <Text style={cardStyles.carName} numberOfLines={1}>{item.name}</Text>

        <View style={cardStyles.detailsRow}>
          {detailsArray.map((detail, index) => (
            <View key={index} style={cardStyles.detailItem}>
              <MaterialCommunityIcons name={getDetailIcon(detail) as any} size={16} color="#6B7280" />
              <Text style={cardStyles.detailText}>{detail}</Text>
            </View>
          ))}
        </View>

        <View style={cardStyles.locationRow}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={cardStyles.locationText} numberOfLines={1}>{item.location}</Text>
        </View>

        <View style={cardStyles.bottomRow}>
          <View style={cardStyles.ratingRow}>
            <Ionicons name="star" size={16} color={ACCENT_COLOR} />
            <Text style={cardStyles.ratingText}>{item.rating}</Text>
            <Text style={cardStyles.tripsText}>• {item.trips} chuyến</Text>
          </View>
          
          <View style={cardStyles.priceColumn}>
            <Text style={cardStyles.pricePerDayText}>
              {formatCurrency(item.pricePerDay)}/ngày
            </Text>
            <Text style={cardStyles.pricePerHourText}>
              {formatCurrency(item.pricePerHour)}/4 giờ
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default CarListingCard;

// === STYLES ===
const cardStyles = StyleSheet.create({
  cardContainer: { backgroundColor: '#FFFFFF', borderRadius: 16, marginVertical: 10, marginHorizontal: 2, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3, borderWidth: 1, borderColor: '#F3F4F6' },
  imageWrapper: { height: 190, position: 'relative', backgroundColor: '#F3F4F6' },
  carImage: { width: '100%', height: '100%' },
  avatarContainer: { position: 'absolute', bottom: -18, left: 12, padding: 2, backgroundColor: 'white', borderRadius: 25, zIndex: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  favoriteIcon: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 20, padding: 6 },
  discountBadge: { position: 'absolute', bottom: 12, right: 12, backgroundColor: DISCOUNT_COLOR, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  discountText: { color: 'white', fontSize: 11, fontWeight: '700' },
  infoContainer: { padding: 14, paddingTop: 24 },
  topRow: { flexDirection: 'row', marginBottom: 10 },
  servicePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3, marginRight: 8 },
  serviceText: { fontSize: 11, color: '#166534', marginLeft: 4, fontWeight: '500' },
  carName: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 8, letterSpacing: 0.3 },
  detailsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16, marginBottom: 4 },
  detailText: { fontSize: 13, color: '#4B5563', marginLeft: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  locationText: { fontSize: 13, color: '#6B7280', marginLeft: 6 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  ratingText: { fontSize: 15, fontWeight: '700', color: '#111827', marginLeft: 4 },
  tripsText: { fontSize: 13, color: '#6B7280', marginLeft: 4 },
  priceColumn: { alignItems: 'flex-end' },
  pricePerDayText: { fontSize: 17, fontWeight: '800', color: BRAND_COLOR },
  pricePerHourText: { fontSize: 12, fontWeight: '500', color: '#3B82F6', marginTop: 2 }
});