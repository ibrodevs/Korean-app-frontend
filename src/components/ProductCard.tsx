import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeProvider';
import { BorderRadius, Spacing, Typography } from '@/constants/theme';
import { Product } from '@/constants/types';
import Button from './Button';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
}

export default function ProductCard({
  product,
  onPress,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}: ProductCardProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      marginBottom: Spacing.md,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    imageContainer: {
      position: 'relative',
      marginBottom: Spacing.sm,
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: BorderRadius.md,
      backgroundColor: colors.border,
    },
    wishlistButton: {
      position: 'absolute',
      top: Spacing.sm,
      right: Spacing.sm,
      backgroundColor: colors.background,
      borderRadius: BorderRadius.round,
      padding: Spacing.xs,
    },
    discountBadge: {
      position: 'absolute',
      top: Spacing.sm,
      left: Spacing.sm,
      backgroundColor: colors.error,
      borderRadius: BorderRadius.sm,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
    },
    discountText: {
      ...Typography.caption,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    content: {
      flex: 1,
    },
    name: {
      ...Typography.h3,
      color: colors.text,
      marginBottom: Spacing.xs,
    },
    seller: {
      ...Typography.caption,
      color: colors.textSecondary,
      marginBottom: Spacing.sm,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    ratingText: {
      ...Typography.caption,
      color: colors.textSecondary,
      marginLeft: Spacing.xs,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.sm,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    price: {
      ...Typography.h3,
      color: colors.text,
      fontWeight: 'bold',
    },
    originalPrice: {
      ...Typography.body,
      color: colors.textSecondary,
      textDecorationLine: 'line-through',
      marginLeft: Spacing.sm,
    },
    stockStatus: {
      ...Typography.caption,
      color: product.inStock ? colors.text : colors.error,
      fontStyle: product.inStock ? 'normal' : 'italic',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    addToCartButton: {
      flex: 1,
    },
  });

  const getDiscountPercentage = () => {
    if (product.discountPrice) {
      const discount = ((product.price - product.discountPrice) / product.price) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const formatPrice = (price: number) => {
    return `₩${price.toLocaleString()}`;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={14}
          color={i <= rating ? '#FFD700' : colors.textSecondary}
        />
      );
    }
    return stars;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(product)}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {getDiscountPercentage() > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{getDiscountPercentage()}%</Text>
          </View>
        )}

        {onToggleWishlist && (
          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={() => onToggleWishlist(product)}
          >
            <Ionicons
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={20}
              color={isWishlisted ? colors.error : colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <Text style={styles.seller}>
          {t('common.seller')}: {product.seller.name}
        </Text>

        <View style={styles.ratingContainer}>
          {renderStars(product.rating)}
          <Text style={styles.ratingText}>
            ({product.reviewCount})
          </Text>
        </View>

        <View style={styles.priceContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              {formatPrice(product.discountPrice || product.price)}
            </Text>
            {product.discountPrice && (
              <Text style={styles.originalPrice}>
                {formatPrice(product.price)}
              </Text>
            )}
          </View>
          <Text style={styles.stockStatus}>
            {product.inStock ? t('product.inStock') : t('product.outOfStock')}
          </Text>
        </View>

        {onAddToCart && (
          <View style={styles.buttonContainer}>
            <Button
              title={t('product.addToCart')}
              onPress={() => onAddToCart(product)}
              disabled={!product.inStock}
              size="small"
              style={styles.addToCartButton}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}