import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import Text from '../components/Text';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import { Product, Category } from '../types/product';
import { BorderRadius, Spacing, Typography } from '../constants/theme';
import { MainTabScreenProps } from '../types/navigation';
import ProductCard from '../components/ProductCard';
import Input from '../components/Input';

type HomeScreenProps = MainTabScreenProps<'Home'>;

// Mock data
const mockCategories: Category[] = [
  { id: '1', name: 'K-Beauty', icon: '✨', color: '#F8E9A1', productCount: 150 },
  { id: '2', name: 'K-Food', icon: '🍜', color: '#A8D0E6', productCount: 89 },
  { id: '3', name: 'K-Fashion', icon: '👗', color: '#F76C6C', productCount: 200 },
  { id: '4', name: 'Electronics', icon: '📱', color: '#24305E', productCount: 75 },
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Korean Skincare Set',
    description: 'Complete 10-step Korean skincare routine with premium ingredients',
    price: 69000,
    originalPrice: 89000,
    discount: 22,
    currency: 'KRW',
    category: 'K-Beauty',
    images: ['https://picsum.photos/300/300?random=1'],
    rating: 4.8,
    reviewCount: 245,
    stock: 50,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    tags: ['skincare', 'korean', 'beauty'],
    seller: {
      id: 'seller1',
      name: 'K-Beauty Store'
    },
    inStock: true,
  },
  {
    id: '2',
    name: 'Korean BBQ Sauce Collection',
    description: 'Authentic Korean BBQ sauces and marinades pack',
    price: 25000,
    currency: 'KRW',
    category: 'K-Food',
    images: ['https://picsum.photos/300/300?random=2'],
    rating: 4.6,
    reviewCount: 89,
    stock: 100,
    isNew: true,
    isFeatured: true,
    isBestSeller: false,
    tags: ['food', 'korean', 'bbq'],
    seller: {
      id: 'seller2',
      name: 'Seoul Foods'
    },
    inStock: true,
  },
  {
    id: '3',
    name: 'Hanbok Modern Style Dress',
    description: 'Modern interpretation of traditional Korean hanbok',
    price: 120000,
    originalPrice: 150000,
    discount: 20,
    currency: 'KRW',
    category: 'K-Fashion',
    images: ['https://picsum.photos/300/300?random=3'],
    rating: 4.9,
    reviewCount: 156,
    stock: 0,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    tags: ['fashion', 'korean', 'traditional'],
    seller: {
      id: 'seller3',
      name: 'Korean Traditional'
    },
    inStock: false,
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProps['navigation']>();
  const { t } = useTranslation();
  const { colors, theme } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(mockProducts);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.heading,
      paddingTop: StatusBar.currentHeight || 0,
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.lg + 10,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      elevation: 8,
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    logo: {
      ...Typography.h2,
      color: '#FFFFFF',
      fontWeight: '800',
      fontSize: 24,
      letterSpacing: 0.5,
    },
    headerIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 0,
    },
    searchContainer: {
      marginTop: Spacing.sm,
    },
    scrollView: {
      flex: 1,
    },
    section: {
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.xl,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    sectionTitle: {
      ...Typography.h3,
      color: colors.text,
      fontWeight: 'bold',
    },
    seeAllButton: {
      ...Typography.body,
      color: colors.primary,
      fontWeight: '600',
    },
    bannerContainer: {
      height: 150,
      marginBottom: Spacing.lg,
    },
    banner: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: Spacing.lg,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    bannerText: {
      ...Typography.h2,
      color: colors.heading,
      fontWeight: '700',
      textAlign: 'center',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
    },
    categoriesContainer: {
      paddingLeft: Spacing.lg,
    },
    categoryCard: {
      width: 100,
      height: 100,
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    categoryIcon: {
      fontSize: 24,
      marginBottom: Spacing.xs,
    },
    categoryName: {
      ...Typography.caption,
      color: colors.text,
      fontWeight: '600',
      textAlign: 'center',
    },
    categoryCount: {
      ...Typography.caption,
      color: colors.textSecondary,
      fontSize: 10,
    },
    productsGrid: {
      paddingHorizontal: Spacing.lg,
    },
    productColumn: {
      flex: 1,
      marginHorizontal: Spacing.xs,
    },
  });

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    // Simulate API call
    setFeaturedProducts(mockProducts);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFeaturedProducts();
    setRefreshing(false);
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const handleSearch = () => {
    // Search is in MainTabNavigator
  };
  
  const handleCartPress = () => {
    navigation.navigate('CartTab');
  };

  const handleCategoryPress = (category: Category) => {
    // Search is in MainTabNavigator
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.categoryCount}>
        {item.productCount} items
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <View style={styles.productColumn}>
      <ProductCard
        product={item}
        onPress={handleProductPress}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={[styles.logo, { color: theme.white }]}>{t('home.title')}</Text>
          <View style={styles.headerIcons}>
            <LanguageSwitcher />
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]} 
              onPress={handleCartPress}
            >
              <Ionicons name="cart-outline" size={24} color={theme.white} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.searchContainer, { backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 25, marginHorizontal: 20, marginTop: 15 }]}>
          <Input
            placeholder={t('home.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon="search-outline"
            onSubmitEditing={handleSearch}
            style={{ backgroundColor: 'transparent' }}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Banner */}
        <View style={[styles.bannerContainer, { paddingHorizontal: 20, paddingTop: 10 }]}>
          <View style={[styles.banner, { 
            backgroundColor: theme.primary, 
            borderRadius: 20,
            padding: 25,
            boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.2)',
            elevation: 10,
          }]}>
            <Text style={[styles.bannerText, { 
              color: theme.heading, 
              fontSize: 22, 
              fontWeight: '700',
              textAlign: 'center',
              lineHeight: 28
            }]}>{t('home.welcomeBanner')}</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={[styles.section, { paddingHorizontal: 20 }]}>
          <View style={[styles.sectionHeader, { marginBottom: 15 }]}>
            <Text style={[styles.sectionTitle, { color: theme.heading, fontSize: 20, fontWeight: '700' }]}>{t('home.categories')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={[styles.seeAllButton, { color: theme.primary, fontSize: 14, fontWeight: '600' }]}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={mockCategories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        </View>

        {/* Featured Products */}
        <View style={[styles.section, { paddingHorizontal: 20 }]}>
          <View style={[styles.sectionHeader, { marginBottom: 15 }]}>
            <Text style={[styles.sectionTitle, { color: theme.heading, fontSize: 20, fontWeight: '700' }]}>{t('home.featured')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={[styles.seeAllButton, { color: theme.primary, fontSize: 14, fontWeight: '600' }]}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featuredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productsGrid}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
          />
        </View>
      </ScrollView>
    </View>
  );
}