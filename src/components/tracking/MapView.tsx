import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import MapView, { Marker, Polyline } from 'react-native-maps';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MapViewProps {
  currentLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  destination: {
    city: string;
    address: string;
  };
  onClose: () => void;
}

const TrackingMapView: React.FC<MapViewProps> = ({
  currentLocation,
  destination,
  onClose,
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Моковые координаты для демонстрации
  const mockDestination = {
    latitude: currentLocation.latitude + 0.02,
    longitude: currentLocation.longitude + 0.01,
  };

  const region = {
    latitude: (currentLocation.latitude + mockDestination.latitude) / 2,
    longitude: (currentLocation.longitude + mockDestination.longitude) / 2,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const coordinates = [
    {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    },
    {
      latitude: mockDestination.latitude,
      longitude: mockDestination.longitude,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Хедер карты */}
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: theme.heading }]}>
            {t('delivery.liveTracking')}
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            {currentLocation.address}
          </Text>
        </View>
      </View>

      {/* Карта */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
        >
          {/* Маркер текущего местоположения */}
          <Marker
            coordinate={coordinates[0]}
            title={t('tracking.currentLocation')}
            description={currentLocation.address}
          >
            <View style={[styles.currentMarker, { backgroundColor: theme.primary }]}>
              <Ionicons name="navigate" size={20} color={theme.heading} />
            </View>
          </Marker>

          {/* Маркер назначения */}
          <Marker
            coordinate={coordinates[1]}
            title={t('tracking.deliveryAddress')}
            description={destination.address}
          >
            <View style={[styles.destinationMarker, { backgroundColor: theme.secondary }]}>
              <Ionicons name="home" size={20} color={theme.heading} />
            </View>
          </Marker>

          {/* Линия маршрута */}
          <Polyline
            coordinates={coordinates}
            strokeColor={theme.primary}
            strokeWidth={4}
            lineDashPattern={[10, 10]}
          />
        </MapView>
      </View>

      {/* Информационная панель */}
      <View style={[styles.infoPanel, { backgroundColor: theme.card }]}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={20} color={theme.primary} />
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
              {t('delivery.eta')}
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              45 min
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="speedometer-outline" size={20} color={theme.primary} />
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
              Distance
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              8.5 km
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="car-outline" size={20} color={theme.primary} />
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
              Speed
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              32 km/h
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.refreshButton, { backgroundColor: theme.primary }]}
          onPress={() => console.log('Refresh location')}
        >
          <Ionicons name="refresh" size={20} color={theme.heading} />
          <Text style={[styles.refreshText, { color: theme.heading }]}>
            {t('tracking.refresh')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  currentMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  destinationMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  infoPanel: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  refreshText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TrackingMapView;