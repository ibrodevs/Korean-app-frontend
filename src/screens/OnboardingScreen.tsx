import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeProvider';
import { Typography, Spacing, BorderRadius } from '@/constants/theme';
import { OnboardingSlide } from '@/constants/types';
import { RootStackScreenProps } from '@/navigation/types';
import Button from '@/components/Button';

type OnboardingScreenProps = RootStackScreenProps<'Onboarding'>;

const { width: screenWidth } = Dimensions.get('window');

export default function OnboardingScreen() {
  const navigation = useNavigation<OnboardingScreenProps['navigation']>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides: OnboardingSlide[] = [
    {
      id: 1,
      title: t('onboarding.slide1.title'),
      description: t('onboarding.slide1.description'),
      image: 'https://via.placeholder.com/300x200/F8E9A1/374785?text=Search+%26+Buy',
    },
    {
      id: 2,
      title: t('onboarding.slide2.title'),
      description: t('onboarding.slide2.description'),
      image: 'https://via.placeholder.com/300x200/A8D0E6/374785?text=Fast+Delivery',
    },
    {
      id: 3,
      title: t('onboarding.slide3.title'),
      description: t('onboarding.slide3.description'),
      image: 'https://via.placeholder.com/300x200/F76C6C/FFFFFF?text=Track+Order',
    },
    {
      id: 4,
      title: t('onboarding.slide4.title'),
      description: t('onboarding.slide4.description'),
      image: 'https://via.placeholder.com/300x200/374785/F8E9A1?text=Secure+Payment',
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    slide: {
      width: screenWidth,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
    },
    imageContainer: {
      width: 300,
      height: 200,
      marginBottom: Spacing.xxl,
      borderRadius: BorderRadius.lg,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    title: {
      ...Typography.h1,
      color: colors.text,
      textAlign: 'center',
      marginBottom: Spacing.lg,
      fontWeight: 'bold',
    },
    description: {
      ...Typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: Spacing.xxl,
      lineHeight: 24,
    },
    bottomContainer: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: colors.primary,
      width: 24,
    },
    inactiveDot: {
      backgroundColor: colors.border,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    skipButton: {
      flex: 1,
      marginRight: Spacing.md,
    },
    nextButton: {
      flex: 1,
      marginLeft: Spacing.md,
    },
  });

  const goToNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      navigation.replace('Auth');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      navigation.replace('Auth');
    }
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );

  const onScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setCurrentIndex(roundIndex);
  };

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />

      <View style={styles.bottomContainer}>
        {renderPagination()}
        
        <View style={styles.buttonContainer}>
          {!isLastSlide && (
            <Button
              title={t('common.skip')}
              onPress={handleSkip}
              variant="outline"
              style={styles.skipButton}
            />
          )}
          
          <Button
            title={isLastSlide ? t('onboarding.getStarted') : t('common.next')}
            onPress={goToNext}
            style={isLastSlide ? { flex: 1 } : styles.nextButton}
          />
        </View>
      </View>
    </View>
  );
}