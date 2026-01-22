import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Компоненты
import Header from '../../components/home/Header';
import BannerCarousel from '../../components/home/BannerCarousel';
import CategoryList from '../../components/home/CategoryList';
import FilterSortBar from '../../components/home/FilterSortBar';
import ProductCard from '../../components/home/ProductCard';

// Типы и данные
import { RootStackParamList } from '../../types/navigation';
import { Product, Category, Banner, SortOption, FilterOptions } from '../../types/product';
import { productService } from '../../services/productService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NUM_COLUMNS = 2;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Состояния
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSort, setSelectedSort] = useState('default');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    priceRange: { min: 0, max: 1000 },
    minRating: 0,
    inStockOnly: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Опции сортировки
  const sortOptions: SortOption[] = [
    { id: 'default', label: t('home.sort.default'), value: 'default' },
    { id: 'priceLowHigh', label: t('home.sort.priceLowHigh'), value: 'price-asc' },
    { id: 'priceHighLow', label: t('home.sort.priceHighLow'), value: 'price-desc' },
    { id: 'newest', label: t('home.sort.newest'), value: 'newest' },
    { id: 'popularity', label: t('home.sort.popularity'), value: 'popularity' },
    { id: 'rating', label: t('home.sort.rating'), value: 'rating' },
  ];

  const handleSearchPress = (query: string) => {
    if (query.trim()) {
      navigation.navigate('AdvancedSearch', { initialQuery: query });
    } else {
      navigation.navigate('AdvancedSearch');
    }
  };
  
  // Добавляем обработчик поиска при фокусе на поисковой строке
  const handleSearchFocus = () => {
    navigation.navigate('AdvancedSearch');
  };

  // Загрузка данных
  const loadData = async () => {
    try {
      const [productsData, categoriesData, bannersData] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
        productService.getBanners(),
      ]);

      setProducts(productsData);
      setFilteredProducts(productsData);
      setCategories(categoriesData);
      setBanners(bannersData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Фильтрация и сортировка продуктов
  useEffect(() => {
    let result = [...products];

    // Фильтрация по категории
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Применение фильтров
    if (filterOptions.categories.length > 0) {
      result = result.filter(product =>
        filterOptions.categories.includes(product.category)
      );
    }

    if (filterOptions.minRating > 0) {
      result = result.filter(product => product.rating >= filterOptions.minRating);
    }

    if (filterOptions.inStockOnly) {
      result = result.filter(product => product.stock > 0);
    }

    result = result.filter(product =>
      product.price <= filterOptions.priceRange.max
    );

    // Сортировка
    switch (selectedSort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'popularity':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Дефолтная сортировка
        result.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        });
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, selectedSort, filterOptions]);

  // Обработчики
  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleMenuPress = () => {
    // Profile is in MainTabNavigator, navigate to Main first
  };
  const handleCartPress = () => {
    // Cart is in MainTabNavigator
  };

  const handleBannerPress = (banner: Banner) => {
    Alert.alert('Banner', `Banner clicked: ${banner.title}`);
  };

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(selectedCategory === category.id ? null : category.id);
  };

  const handleSeeAllPress = () => {
    setSelectedCategory(null);
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleAddToCart = (product: Product) => {
    Alert.alert('Added to Cart', `${product.name} added to cart`);
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    if (viewMode === 'list') {
      return (
        <ProductCard
          product={item}
          onPress={handleProductPress}
          onAddToCart={handleAddToCart}
          type="list"
        />
      );
    }

    return (
      <View style={{ flex: 1, paddingHorizontal: 8 }}>
        <ProductCard
          product={item}
          onPress={handleProductPress}
          onAddToCart={handleAddToCart}
          type="grid"
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.navBackground}
      />

      {/* Header */}
      <Header
        onMenuPress={handleMenuPress}
        onSearchPress={handleSearchPress}
        onCartPress={handleCartPress}
      />

      {/* Основной контент */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? NUM_COLUMNS : 1}
        key={viewMode}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        ListHeaderComponent={
          <>
            {/* Баннеры */}
            <BannerCarousel
              banners={banners}
              onBannerPress={handleBannerPress}
            />

            {/* Категории */}
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryPress={handleCategoryPress}
              onSeeAllPress={handleSeeAllPress}
            />

            {/* Панель фильтров и сортировки */}
            <FilterSortBar
              sortOptions={sortOptions}
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
              filterOptions={filterOptions}
              onFilterChange={setFilterOptions}
              categories={categories}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </>
        }
        ListEmptyComponent={
          <View style={{ paddingVertical: 80, alignItems: 'center' }}>
            <Text style={[{ color: theme.textSecondary, fontSize: 18 }]}>
              No products found
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 96 }}
        columnWrapperStyle={viewMode === 'grid' ? { paddingHorizontal: 16 } : undefined}
      />
    </View>
  );
};

export default HomeScreen;