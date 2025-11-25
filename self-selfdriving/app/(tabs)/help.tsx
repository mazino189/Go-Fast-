// app/homescreen/help.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const BRAND_COLOR = '#00A86B';

export default function HelpScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
        <Text style={styles.title}>Trợ giúp & Hỗ trợ</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionHeader}>Câu hỏi thường gặp</Text>
        
        <View style={styles.card}>
            <Text style={styles.question}>Làm sao để đặt xe?</Text>
            {/* --- ĐÃ SỬA LỖI Ở DÒNG DƯỚI ĐÂY --- */}
            <Text style={styles.answer}>{'Chọn xe -> Chọn ngày giờ -> Chọn thanh toán -> Xác nhận.'}</Text>
        </View>

        <View style={styles.card}>
            <Text style={styles.question}>Tôi có thể hủy chuyến không?</Text>
            <Text style={styles.answer}>Có, bạn có thể hủy trước 24h miễn phí.</Text>
        </View>

        <Text style={styles.sectionHeader}>Liên hệ</Text>
        <TouchableOpacity style={styles.contactBtn}>
            <Ionicons name="call" size={20} color="white" />
            <Text style={styles.contactText}>Gọi tổng đài 0961354224</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: 'white', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginTop: 10, color: '#00A86B' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10 },
  question: { fontWeight: 'bold', marginBottom: 5 },
  answer: { color: 'gray', fontSize: 13 },
  contactBtn: { flexDirection: 'row', backgroundColor: '#00A86B', padding: 15, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  contactText: { color: 'white', fontWeight: 'bold', marginLeft: 10 }
});