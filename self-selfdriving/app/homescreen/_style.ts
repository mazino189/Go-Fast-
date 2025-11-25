// app/homescreen/styles.ts
import { StyleSheet } from 'react-native';

export const BRAND_COLOR = '#00A86B';

export const localStyles = StyleSheet.create({
  iconWrapper: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#E0FFF0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  iconLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333333',
    marginTop: 5,
  },
  // [START] THÊM CÁC STYLE MỚI CHO MAP VÀ PLACEHOLDER
  mapView: { // Style cho Map View (dùng cho View bọc MapView)
    height: 250, // Chiều cao của map, bạn có thể điều chỉnh
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden', // Quan trọng để bo góc hoạt động
  },
  bottomPanel: { // Style cho phần nội dung dưới Map
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapViewPlaceholder: { // Style cho Placeholder trên Web
    flex: 1,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: { // Style cho Text lớn trên Placeholder
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  mapPlaceholderTextSmall: { // Style cho Text nhỏ trên Placeholder
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  // [END] THÊM CÁC STYLE MỚI
});

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLOR,
  },
  headerBackground: {
    height: 150,
    backgroundColor: BRAND_COLOR,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  greetingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.95)',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  userEmail: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 18,
    marginRight: 8,
  },
  weatherText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 13,
  },
  appLogoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 18,
  },
  goFastText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  searchBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: -25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    padding: 5,
    zIndex: 10, // Đảm bảo thanh tìm kiếm nổi lên trên Map
  },
  searchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  searchText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#888888',
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F0FFF0',
    borderRadius: 8,
    marginLeft: 5,
  },
  scheduleText: {
    marginLeft: 5,
    color: BRAND_COLOR,
    fontWeight: 'bold',
  },
  coreServicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    marginTop: 20,
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});