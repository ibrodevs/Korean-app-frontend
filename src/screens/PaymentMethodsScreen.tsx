import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '../components/Text';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';

interface PaymentCard {
  id: string;
  cardHolder: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  type: 'VISA' | 'MASTERCARD' | 'AMEX';
}

export default function PaymentMethodsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { theme } = useTheme();
  
  const [cards, setCards] = useState<PaymentCard[]>([
    {
      id: '1',
      cardHolder: 'AMANDA MORGAN',
      cardNumber: '•••• •••• •••• 1579',
      expiryDate: '12/28',
      cvv: '209',
      type: 'VISA'
    }
  ]);

  const handleAddCard = () => {
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.navigate('AddCard');
    }
  };

  const handleEditCard = (card: PaymentCard) => {
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.navigate('EditCard', { card });
    }
  };

  const handleDeleteCard = (cardId: string) => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCards(prev => prev.filter(card => card.id !== cardId));
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />
      
      {/* Header with gradient background */}
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Payment methods</Text>
          <View style={styles.placeholder} />
        </View>
        
        {/* Cards Display */}
        <View style={styles.cardsContainer}>
          {cards.map((card) => (
            <Pressable 
              key={card.id} 
              style={styles.creditCard}
              onPress={() => handleEditCard(card)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardType}>{card.type}</Text>
                <Ionicons name="settings-outline" size={20} color="#6B7280" />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardNumber}>{card.cardNumber}</Text>
                <Text style={styles.cardHolder}>{card.cardHolder}</Text>
                <Text style={styles.cardExpiry}>{card.expiryDate}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Wave bottom */}
        <View style={styles.waveContainer}>
          <View style={[styles.wave, { backgroundColor: theme.background }]} />
        </View>
      </LinearGradient>

      {/* Add Card Button */}
      <View style={[styles.bottomSection, { backgroundColor: theme.background }]}>
        <Pressable style={[styles.addCardButton, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={handleAddCard}>
          <Ionicons name="add" size={24} color="#4A90E2" />
          <Text style={styles.addCardText}>Add New Card</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerGradient: {
    paddingTop: StatusBar.currentHeight || 0,
    paddingBottom: 80,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  cardsContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  creditCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E40AF',
  },
  cardBody: {
    gap: 8,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  cardHolder: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  cardExpiry: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  waveContainer: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 60,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  bottomSection: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  addCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
    marginLeft: 8,
  },
});