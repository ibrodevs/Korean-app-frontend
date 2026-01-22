import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  Alert,
  Share,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Компоненты
import ImageGallery from '../../components/product/ImageGallery';
import ProductHeader from '../../components/product/ProductHeader';
import ProductDescription from '../../components/product/ProductDescription';
import ProductActions from '../../components/product/ProductActions';
import RelatedProducts from '../../components/product/RelatedProducts';

// Типы и сервисы
import { RootStackParamList } from '../../types/navigation';
import { ProductDetail } from '../../types/product';
import { productService } from '../../services/productService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProductDetailScreen: React.FC = () => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<any>();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (route.params?.product) {
      setProduct(route.params.product);
      setLoading(false);
    } else if (route.params?.productId) {
      loadProduct();
    }
  }, [route.params?.productId, route.params?.product]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await productService.getProductDetail(route.params.productId);
      setProduct(productData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load product details');
      console.error('Error loading product:', error);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? t('product.removeFavorite') : t('product.addedToFavorites'),
      `${product?.name} ${isFavorite ? 'removed from' : 'added to'} favorites`
    );
  };

  const handleSharePress = async () => {
    try {
      await Share.share({
        message: `Check out ${product?.name} on KoreanStore!\nPrice: ${product?.currency}${product?.price}\n${product?.description.substring(0, 100)}...`,
        url: `https://koreanstore.com/product/${product?.id}`,
        title: product?.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleAddToCart = (
    quantity: number,
    selectedColor?: any,
    selectedSize?: any
  ) => {
    console.log('Add to cart:', {
      product: product?.name,
      quantity,
      color: selectedColor?.name,
      size: selectedSize?.name,
    });
    // Здесь будет логика добавления в корзину
  };

  const handleBuyNow = (
    quantity: number,
    selectedColor?: any,
    selectedSize?: any
  ) => {
    console.log('Buy now:', {
      product: product?.name,
      quantity,
      color: selectedColor?.name,
      size: selectedSize?.name,
    });
    // Здесь будет логика покупки
    navigation.navigate('Checkout');
  };

  const handleImagePress = (index: number) => {
    // Можно открыть полноэкранный просмотр изображений
    console.log('Image pressed:', index);
  };

  if (loading || !product) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={theme.background}
        />
        {/* Здесь можно добавить индикатор загрузки */}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Галерея изображений */}
      <ImageGallery
        images={product.images}
        onImagePress={handleImagePress}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Заголовок продукта */}
        <ProductHeader
          product={product}
          isFavorite={isFavorite}
          onBackPress={handleBackPress}
          onFavoritePress={handleFavoritePress}
          onSharePress={handleSharePress}
        />

        {/* Описание и детали */}
        <ProductDescription product={product} />

        {/* Похожие товары */}
        <RelatedProducts
          productId={product.id}
          category={product.category}
          onProductPress={(product: ProductDetail) =>
            navigation.push('ProductDetail', { product })
          }
        />
      </ScrollView>

      {/* Кнопки действий */}
      <ProductActions
        product={product}
        colors={product.colors || []}
        sizes={product.sizes || []}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
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
    paddingBottom: 120, // Пространство для фиксированных кнопок
  },
});

export default ProductDetailScreen;