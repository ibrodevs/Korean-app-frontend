import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '../components/Text';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';

interface PaymentCard {
  id: string;
  cardHolder: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  type: 'VISA' | 'MASTERCARD' | 'AMEX';
}

export default function EditCardScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  
  // Get card data from route params or use default
  const cardData = (route.params as { card?: PaymentCard })?.card || {
    id: '1',
    cardHolder: 'Romina',
    cardNumber: '•••• •••• •••• 1579',
    expiryDate: '12/28',
    cvv: '209',
    type: 'VISA' as const
  };

  const [formData, setFormData] = useState({
    cardHolder: cardData.cardHolder,
    cardNumber: cardData.cardNumber,
    expiryDate: cardData.expiryDate,
    cvv: cardData.cvv,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = 'Card holder name is required';
    }
    
    if (!formData.cardNumber.replace(/\s/g, '').replace(/•/g, '')) {
      newErrors.cardNumber = 'Card number is required';
    }
    
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    }
    
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      Alert.alert('Success', 'Card updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Card deleted successfully!', [
              { text: 'OK', onPress: () => navigation.goBack() }
            ]);
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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

        {/* Wave bottom */}
        <View style={styles.waveContainer}>
          <View style={styles.wave} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Edit Card</Text>
          <Pressable onPress={handleDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </Pressable>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Card Holder</Text>
          <TextInput
            style={[styles.input, errors.cardHolder ? styles.inputError : null]}
            placeholder="Required"
            placeholderTextColor="#9CA3AF"
            value={formData.cardHolder}
            onChangeText={(text) => handleInputChange('cardHolder', text)}
            autoCapitalize="words"
          />
          {errors.cardHolder && (
            <Text style={styles.errorText}>{errors.cardHolder}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Card Number</Text>
          <TextInput
            style={[styles.input, errors.cardNumber ? styles.inputError : null]}
            placeholder="Required"
            placeholderTextColor="#9CA3AF"
            value={formData.cardNumber}
            onChangeText={(text) => handleInputChange('cardNumber', text)}
            keyboardType="numeric"
          />
          {errors.cardNumber && (
            <Text style={styles.errorText}>{errors.cardNumber}</Text>
          )}
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Valid</Text>
            <TextInput
              style={[styles.input, errors.expiryDate ? styles.inputError : null]}
              placeholder="Required"
              placeholderTextColor="#9CA3AF"
              value={formData.expiryDate}
              onChangeText={(text) => handleInputChange('expiryDate', text)}
              keyboardType="numeric"
              maxLength={5}
            />
            {errors.expiryDate && (
              <Text style={styles.errorText}>{errors.expiryDate}</Text>
            )}
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={[styles.input, errors.cvv ? styles.inputError : null]}
              placeholder="Required"
              placeholderTextColor="#9CA3AF"
              value={formData.cvv}
              onChangeText={(text) => {
                if (text.length <= 4) {
                  handleInputChange('cvv', text);
                }
              }}
              keyboardType="numeric"
              maxLength={4}
            />
            {errors.cvv && (
              <Text style={styles.errorText}>{errors.cvv}</Text>
            )}
          </View>
        </View>

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerGradient: {
    paddingTop: StatusBar.currentHeight || 0,
    paddingBottom: 40,
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
  waveContainer: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 40,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  deleteButton: {
    padding: 8,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});