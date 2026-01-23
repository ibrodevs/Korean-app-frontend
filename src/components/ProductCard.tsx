import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Text from './Text';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { BorderRadius, Spacing } from '../constants/theme';
import { Product } from '../types/product';
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
      boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.15)',
      elevation: 8,
      borderWidth: 0.5,
      borderColor: colors.border,
    },
    imageContainer: {
      position: 'relative',
      marginBottom: Spacing.sm,
    },
    image: {
      width: '100%',
      height: 180,
      borderRadius: BorderRadius.md,
      backgroundColor: colors.background,
    },
    wishlistButton: {
      position: 'absolute',
      top: Spacing.sm,
      right: Spacing.sm,
      backgroundColor: colors.background,
      borderRadius: BorderRadius.round,
      padding: Spacing.xs,
      boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.15)',
      elevation: 3,
    },
    discountBadge: {
      position: 'absolute',
      top: Spacing.sm,
      left: Spacing.sm,
      backgroundColor: colors.error,
      borderRadius: BorderRadius.sm,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.25)',
      elevation: 4,
    },
    discountText: {
      fontSize: 12,
      color: '#FFFFFF',
      fontWeight: '700',
    },
    content: {
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
      lineHeight: 20,
      color: colors.text,
    },
    seller: {
      fontSize: 12,
      fontWeight: '400',
      color: colors.textSecondary,
      marginBottom: Spacing.sm,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    ratingText: {
      fontSize: 12,
      fontWeight: '400',
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
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    originalPrice: {
      fontSize: 16,
      fontWeight: '400',
      color: colors.textSecondary,
      textDecorationLine: 'line-through',
      marginLeft: Spacing.sm,
    },
    stockStatus: {
      fontSize: 12,
      fontWeight: '400',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    addToCartButton: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.sm,
      boxShadow: `0px 2px 4px ${colors.primary}40`,
      elevation: 3,
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
          <Text style={[
            styles.stockStatus,
            {
              color: product.inStock ? colors.text : colors.error,
              fontStyle: product.inStock ? 'normal' : 'italic',
            }
          ]}>
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