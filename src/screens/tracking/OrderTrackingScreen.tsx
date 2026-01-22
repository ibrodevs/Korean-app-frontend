import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  RefreshControl,
  StyleSheet,
  Alert,
  Modal,
  Linking,
} from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Компоненты
import OrderHeader from '../../components/tracking/OrderHeader';
import StatusTimeline from '../../components/tracking/StatusTimeline';
import DeliveryInfo from '../../components/tracking/DeliveryInfo';
import MapView from '../../components/tracking/MapView';

// Типы и сервисы
import { RootStackParamList } from '../../types/navigation';
import { OrderTracking } from '../../types/tracking';
import { trackingService } from '../../services/trackingService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProp = { params: { orderId: string } };

const OrderTrackingScreen: React.FC = () => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();

  const [tracking, setTracking] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadTrackingData();
    
    // Автообновление каждые 30 секунд
    let interval: NodeJS.Timeout;
    if (autoRefresh && tracking?.status !== 'delivered') {
      interval = setInterval(() => {
        loadTrackingData(false);
      }, 30000);
    }
    
    return () => clearInterval(interval);
  }, [route.params.orderId, autoRefresh]);

  const loadTrackingData = async (showLoading: boolean = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      
      const data = await trackingService.getOrderTracking(route.params.orderId);
      setTracking(data);
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('tracking.loadError'),
        [
          {
            text: t('common.retry'),
            onPress: loadTrackingData,
          },
          {
            text: t('common.back'),
            onPress: () => navigation.goBack(),
          },
        ]
      );
      console.error('Error loading tracking data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadTrackingData(false);
  };

  const handleViewDetails = () => {
    navigation.navigate('OrderDetails', { orderId: route.params.orderId });
  };

  const handleContactSupport = () => {
    navigation.navigate('Support', { orderId: route.params.orderId });
  };

  const handleTrackCarrier = (carrier: any) => {
    Linking.openURL(carrier.trackingUrl);
  };

  const handleContactDriver = () => {
    if (tracking?.driver?.phone) {
      Linking.openURL(`tel:${tracking.driver.phone}`);
    }
  };

  const handleViewMap = () => {
    setShowMap(true);
  };

  const handleShareTracking = () => {
    // Логика поделиться будет в компоненте OrderHeader
  };

  if (loading || !tracking) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <StatusBar
          barStyle={theme.isDark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.navBackground}
        />
        {/* Здесь можно добавить индикатор загрузки */}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Хедер с информацией о заказе */}
        <OrderHeader
          tracking={tracking}
          onRefresh={handleRefresh}
          onViewDetails={handleViewDetails}
          onContactSupport={handleContactSupport}
          refreshing={refreshing}
        />

        {/* Таймлайн статусов */}
        <StatusTimeline
          timeline={tracking.timeline}
          currentStatus={tracking.status}
        />

        {/* Информация о доставке */}
        <DeliveryInfo
          tracking={tracking}
          onTrackCarrier={handleTrackCarrier}
          onContactDriver={handleContactDriver}
          onViewMap={handleViewMap}
        />
      </ScrollView>

      {/* Модальное окно с картой */}
      <Modal
        visible={showMap}
        animationType="slide"
        onRequestClose={() => setShowMap(false)}
      >
        {tracking.currentLocation && (
          <MapView
            currentLocation={tracking.currentLocation}
            destination={tracking.shippingAddress}
            onClose={() => setShowMap(false)}
          />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
});

export default OrderTrackingScreen;