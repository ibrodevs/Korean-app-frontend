import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeProvider';
import { Typography, Spacing, BorderRadius } from '@/constants/theme';
import { Product, Category } from '@/constants/types';
import { MainTabScreenProps } from '@/navigation/types';
import ProductCard from '@/components/ProductCard';
import Input from '@/components/Input';

type HomeScreenProps = MainTabScreenProps<'Home'>;

// Mock data
const mockCategories: Category[] = [
  { id: '1', name: 'K-Beauty', icon: '✨', productsCount: 150 },
  { id: '2', name: 'K-Food', icon: '🍜', productsCount: 89 },
  { id: '3', name: 'K-Fashion', icon: '👗', productsCount: 200 },
  { id: '4', name: 'Electronics', icon: '📱', productsCount: 75 },
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Korean Skincare Set',
    description: 'Complete 10-step Korean skincare routine with premium ingredients',
    price: 89000,
    discountPrice: 69000,
    images: ['https://via.placeholder.com/300x300/F8E9A1/374785?text=Skincare'],
    category: 'K-Beauty',
    inStock: true,
    rating: 4.8,
    reviewCount: 245,
    seller: { id: '1', name: 'Beauty Korea', rating: 4.9 },
  },
  {
    id: '2',
    name: 'Korean BBQ Sauce Collection',
    description: 'Authentic Korean BBQ sauces and marinades pack',
    price: 25000,
    images: ['https://via.placeholder.com/300x300/A8D0E6/374785?text=BBQ+Sauce'],
    category: 'K-Food',
    inStock: true,
    rating: 4.6,
    reviewCount: 89,
    seller: { id: '2', name: 'Korean Taste', rating: 4.7 },
  },
  {
    id: '3',
    name: 'Hanbok Modern Style Dress',
    description: 'Modern interpretation of traditional Korean hanbok',
    price: 150000,
    discountPrice: 120000,
    images: ['https://via.placeholder.com/300x300/F76C6C/FFFFFF?text=Hanbok'],
    category: 'K-Fashion',
    inStock: false,
    rating: 4.9,
    reviewCount: 156,
    seller: { id: '3', name: 'Seoul Fashion', rating: 4.8 },
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProps['navigation']>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(mockProducts);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.header,
      paddingTop: StatusBar.currentHeight || 0,
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.lg,
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
      fontWeight: 'bold',
    },
    headerIcons: {
      flexDirection: 'row',
    },
    iconButton: {
      marginLeft: Spacing.md,
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
    },
    bannerText: {
      ...Typography.h2,
      color: colors.navigation,
      fontWeight: 'bold',
      textAlign: 'center',
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

  const handleSearch = () => {
    navigation.navigate('Search', { query: searchQuery });
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('Search', { category: category.id });
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
        {item.productsCount} items
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
          <Text style={styles.logo}>{t('home.title')}</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={handleCartPress}>
              <Ionicons name="cart-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.searchContainer}>
          <Input
            placeholder={t('home.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon="search-outline"
            onSubmitEditing={handleSearch}
            style={{ backgroundColor: '#FFFFFF' }}
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
        <View style={styles.bannerContainer}>
          <View style={styles.banner}>
            <Text style={styles.bannerText}>{t('home.welcomeBanner')}</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.categories')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={styles.seeAllButton}>{t('common.seeAll')}</Text>
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
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.featured')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={styles.seeAllButton}>{t('common.seeAll')}</Text>
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