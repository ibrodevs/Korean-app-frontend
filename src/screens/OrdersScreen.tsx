import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeProvider';
import { Typography, Spacing, BorderRadius } from '@/constants/theme';
import { Order, OrderStatus } from '@/constants/types';
import { MainTabScreenProps } from '@/navigation/types';

type OrdersScreenProps = MainTabScreenProps<'Orders'>;

const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    items: [],
    totalAmount: 89000,
    shippingCost: 5000,
    status: 'delivered',
    shippingAddress: {
      recipientName: 'John Doe',
      phone: '+82 10-1234-5678',
      address: 'Seoul, Gangnam-gu, 123 Street',
    },
    paymentMethod: 'Credit Card',
    createdAt: '2024-01-15T10:30:00Z',
    estimatedDelivery: '2024-01-18T18:00:00Z',
    trackingNumber: 'KR123456789',
  },
  {
    id: 'ORD-2024-002',
    items: [],
    totalAmount: 125000,
    shippingCost: 5000,
    status: 'shipped',
    shippingAddress: {
      recipientName: 'John Doe',
      phone: '+82 10-1234-5678',
      address: 'Seoul, Gangnam-gu, 123 Street',
    },
    paymentMethod: 'Credit Card',
    createdAt: '2024-01-20T14:15:00Z',
    estimatedDelivery: '2024-01-23T18:00:00Z',
    trackingNumber: 'KR987654321',
  },
];

export default function OrdersScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [refreshing, setRefreshing] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.header,
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.lg,
      paddingTop: (StatusBar.currentHeight || 0) + Spacing.lg,
    },
    headerTitle: {
      ...Typography.h2,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    content: {
      flex: 1,
      paddingHorizontal: Spacing.lg,
    },
    orderCard: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginVertical: Spacing.sm,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    orderHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: Spacing.md,
    },
    orderNumber: {
      ...Typography.h3,
      color: colors.text,
      fontWeight: 'bold',
    },
    orderDate: {
      ...Typography.caption,
      color: colors.textSecondary,
      marginTop: Spacing.xs,
    },
    statusContainer: {
      alignItems: 'flex-end',
    },
    statusBadge: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
    },
    statusText: {
      ...Typography.caption,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    orderDetails: {
      marginBottom: Spacing.md,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    detailLabel: {
      ...Typography.body,
      color: colors.textSecondary,
    },
    detailValue: {
      ...Typography.body,
      color: colors.text,
      fontWeight: '500',
    },
    totalAmount: {
      ...Typography.h3,
      color: colors.text,
      fontWeight: 'bold',
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.sm,
      marginHorizontal: Spacing.xs,
    },
    trackButton: {
      backgroundColor: colors.primary,
    },
    reorderButton: {
      borderWidth: 1,
      borderColor: colors.primary,
    },
    actionButtonText: {
      ...Typography.body,
      fontWeight: '600',
      marginLeft: Spacing.xs,
    },
    trackButtonText: {
      color: colors.navigation,
    },
    reorderButtonText: {
      color: colors.primary,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
    },
    emptyText: {
      ...Typography.h3,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: Spacing.sm,
    },
    emptySubtext: {
      ...Typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'processing':
        return '#2196F3';
      case 'shipped':
        return '#FF9800';
      case 'delivered':
        return '#4CAF50';
      case 'cancelled':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price: number): string => {
    return `₩${price.toLocaleString()}`;
  };

  const handleTrackOrder = (order: Order) => {
    console.log('Track order:', order.id);
    // Navigate to order tracking screen
  };

  const handleReorder = (order: Order) => {
    console.log('Reorder:', order.id);
    // Add items to cart and navigate to checkout
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>{item.id}</Text>
          <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>
              {t(`orders.statuses.${item.status}`)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('orders.total')}</Text>
          <Text style={styles.totalAmount}>
            {formatPrice(item.totalAmount + item.shippingCost)}
          </Text>
        </View>
        {item.trackingNumber && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('orders.trackingNumber')}</Text>
            <Text style={styles.detailValue}>{item.trackingNumber}</Text>
          </View>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.trackButton]}
          onPress={() => handleTrackOrder(item)}
        >
          <Ionicons name="location-outline" size={16} color={colors.navigation} />
          <Text style={[styles.actionButtonText, styles.trackButtonText]}>
            {t('orders.track')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.reorderButton]}
          onPress={() => handleReorder(item)}
        >
          <Ionicons name="refresh-outline" size={16} color={colors.primary} />
          <Text style={[styles.actionButtonText, styles.reorderButtonText]}>
            {t('orders.reorder')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{t('orders.empty')}</Text>
      <Text style={styles.emptySubtext}>{t('orders.emptyDescription')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.header} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('orders.title')}</Text>
      </View>

      <View style={styles.content}>
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={
            orders.length === 0 ? { flex: 1 } : { paddingTop: Spacing.md }
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      </View>
    </View>
  );
}