// app/homescreen/term-of-service.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BRAND_COLOR = '#00A86B';

export default function TermOfServiceScreen() {

  const handleBack = async () => {
    Alert.alert(
      "Thông báo",
      "Bạn cần đồng ý điều khoản để sử dụng ứng dụng. Bạn có muốn quay lại màn hình đăng nhập không?",
      [
        { text: "Ở lại", style: "cancel" },
        { 
          text: "Quay lại", 
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem('userInfo');
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const handleAgree = () => {
    router.replace('/homescreen/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Điều khoản sử dụng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.lastUpdated}>Cập nhật lần cuối: 24/11/2025</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Giới thiệu chung</Text>
          <Text style={styles.paragraph}>
            Chào mừng bạn đến với ứng dụng GoFast. Để đảm bảo an toàn và quyền lợi cho cả hai bên, vui lòng đọc kỹ và đồng ý với các điều khoản dưới đây trước khi bắt đầu sử dụng dịch vụ.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Tài khoản người dùng</Text>
          <Text style={styles.paragraph}>
            • Bạn phải đủ 18 tuổi và có Giấy phép lái xe hợp lệ để thuê xe tự lái.
            {'\n'}• Bạn chịu trách nhiệm bảo mật thông tin đăng nhập (Email, Mật khẩu).
            {'\n'}• Mọi hoạt động diễn ra dưới tài khoản của bạn là trách nhiệm của bạn.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Quy định đặt xe & Thanh toán</Text>
          <Text style={styles.paragraph}>
            • Giá thuê xe được niêm yết công khai và có thể thay đổi tùy thời điểm (lễ, tết).
            {'\n'}• Bạn cần thanh toán hoặc đặt cọc trước để giữ xe.
            {'\n'}• Các phương thức thanh toán chấp nhận: Tiền mặt, Thẻ Visa/Mastercard, Ví điện tử (Momo, ZaloPay).
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Chính sách hủy chuyến</Text>
          <Text style={styles.paragraph}>
            • <Text style={{fontWeight: 'bold'}}>Hủy trước 24 giờ</Text> so với giờ nhận xe: Hoàn tiền 100% hoặc không mất phí.
            {'\n'}• <Text style={{fontWeight: 'bold'}}>Hủy trong vòng 24 giờ</Text>: Phí phạt 30% giá trị đơn hàng.
            {'\n'}• <Text style={{fontWeight: 'bold'}}>Không đến nhận xe</Text>: Không hoàn tiền cọc.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Trách nhiệm của khách hàng</Text>
          <Text style={styles.paragraph}>
            • Sử dụng xe đúng mục đích, không chở hàng cấm, chất cháy nổ.
            {'\n'}• Tuyệt đối không sử dụng rượu bia, chất kích thích khi lái xe.
            {'\n'}• Chịu trách nhiệm hoàn toàn về các khoản phạt nguội, vi phạm giao thông trong thời gian thuê.
            {'\n'}• Giữ gìn vệ sinh xe, trả xe đúng hiện trạng ban đầu.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Bảo hiểm & Sự cố</Text>
          <Text style={styles.paragraph}>
            • Các xe của GoFast đều có bảo hiểm trách nhiệm dân sự bắt buộc.
            {'\n'}• Trong trường hợp xảy ra va chạm, hỏng hóc do lỗi người thuê, người thuê phải chịu chi phí sửa chữa và đền bù ngày xe nằm gara (nếu có).
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Liên hệ</Text>
          <Text style={styles.paragraph}>
            Mọi thắc mắc về điều khoản, vui lòng liên hệ:
            {'\n'}Hotline: 1900 1234
            {'\n'}Email: support@gofast.vn
          </Text>
        </View>

        <TouchableOpacity style={styles.agreeButton} onPress={handleAgree}>
            <Text style={styles.agreeText}>Tôi đã hiểu và đồng ý</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- PHẦN STYLES QUAN TRỌNG (ĐÃ BỔ SUNG ĐẦY ĐỦ) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  content: { padding: 20 },
  lastUpdated: { fontSize: 12, color: '#6B7280', fontStyle: 'italic', marginBottom: 20, textAlign: 'right' },
  
  // Các style bị thiếu trước đó:
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: BRAND_COLOR, marginBottom: 8 },
  paragraph: { fontSize: 14, color: '#374151', lineHeight: 22, textAlign: 'justify' },
  
  agreeButton: { backgroundColor: BRAND_COLOR, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10, marginBottom: 30 },
  agreeText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});