import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Modal,
} from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Компоненты
import PaymentMethodSelector from '../../components/payment/PaymentMethodSelector';
import CreditCardForm from '../../components/payment/CreditCardForm';
import PaymentStatus from '../../components/payment/PaymentStatus';
import OrderSummary from '../../components/checkout/OrderSummary';
import SavedCards from '../../components/payment/SavedCards';

// Типы и сервисы
import { RootStackParamList } from '../../types/navigation';
import { PaymentMethod, PaymentCard, PaymentRequest, PaymentStatus as PaymentStatusType } from '../../types/payment';
import { paymentService } from '../../services/paymentService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProp = {
  params: {
    orderId: string;
    amount: number;
    currency: string;
    items: any[];
    shippingAddress: any;
  };
};

const PaymentScreen: React.FC = () => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();

  const { orderId, amount, currency, items, shippingAddress } = route.params;

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [selectedCard, setSelectedCard] = useState<PaymentCard | null>(null);
  const [savedCards, setSavedCards] = useState<PaymentCard[]>([]);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showPaymentStatus, setShowPaymentStatus] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusType>({
    id: 'initial',
    status: 'pending',
    progress: 0,
    message: t('payment.processing'),
  });
  const [loading, setLoading] = useState(false);

  // Загружаем сохраненные карты и методы оплаты
  useEffect(() => {
    loadSavedCards();
  }, []);

  const loadSavedCards = async () => {
    try {
      const cards = await paymentService.getSavedCards();
      setSavedCards(cards);
      
      // Автоматически выбираем карту по умолчанию
      const defaultCard = cards.find(card => card.isDefault);
      if (defaultCard) {
        setSelectedCard(defaultCard);
      }
    } catch (error) {
      console.error('Error loading saved cards:', error);
    }
  };

  const handleCardSubmit = async (cardData: any) => {
    try {
      setLoading(true);
      
      // Если нужно сохранить карту
      if (cardData.saveCard) {
        const savedCard = await paymentService.saveCard(cardData);
        setSavedCards(prev => [...prev, savedCard]);
        setSelectedCard(savedCard);
      }

      setShowCardForm(false);
      Alert.alert('Success', 'Card details saved securely');
    } catch (error) {
      Alert.alert('Error', 'Failed to save card');
      console.error('Error saving card:', error);
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async () => {
    if (!selectedMethod) {
      Alert.alert(t('payment.title'), t('payment.selectMethod'));
      return;
    }

    if (selectedMethod.type === 'card' && !selectedCard && !showCardForm) {
      Alert.alert(t('payment.title'), t('payment.addNewCard'));
      setShowCardForm(true);
      return;
    }

    setShowPaymentStatus(true);
    
    // Обновляем статус
    setPaymentStatus({
      id: 'processing',
      status: 'processing',
      progress: 10,
      message: t('payment.verification'),
    });

    // Создаем запрос на оплату
    const paymentRequest: PaymentRequest = {
      orderId,
      amount,
      currency,
      method: selectedMethod,
      card: selectedCard || undefined,
      billingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        country: shippingAddress.country,
        zipCode: shippingAddress.zipCode,
      },
      saveCard: false,
    };

    try {
      // Симуляция процесса оплаты
      const steps = [
        { progress: 30, message: 'Validating payment details' },
        { progress: 50, message: 'Processing transaction' },
        { progress: 80, message: 'Authorizing payment' },
        { progress: 100, message: 'Payment completed' },
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPaymentStatus(prev => ({
          ...prev,
          progress: step.progress,
          message: step.message,
        }));
      }

      // Финальный статус
      await new Promise(resolve => setTimeout(resolve, 500));
      setPaymentStatus({
        id: 'completed',
        status: 'completed',
        progress: 100,
        message: t('payment.success'),
      });

      // Сохраняем транзакцию
      const transaction = await paymentService.processPayment(paymentRequest);

      // Обновляем статус заказа
      await paymentService.updateOrderStatus(orderId, 'paid', transaction.id);

    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus({
        id: 'failed',
        status: 'failed',
        progress: 0,
        message: t('payment.failed'),
      });
    }
  };

  const handlePaymentComplete = () => {
    setShowPaymentStatus(false);
    navigation.navigate('OrderConfirmation', {
      orderId,
      transactionId: paymentStatus.id,
    });
  };

  const handleRetry = () => {
    setShowPaymentStatus(false);
    setPaymentStatus({
      id: 'initial',
      status: 'pending',
      progress: 0,
      message: t('payment.processing'),
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.navBackground}
      />

      {/* Хедер */}
      <View style={[styles.header, { backgroundColor: theme.navBackground }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={[styles.backText, { color: theme.primary }]}>
            {t('common.back')}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.primary }]}>
          {t('payment.title')}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Итоговая сумма */}
        <View style={[styles.amountCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.amountLabel, { color: theme.textSecondary }]}>
            {t('payment.totalAmount')}
          </Text>
          <Text style={[styles.amount, { color: theme.heading }]}>
            {currency} {amount.toFixed(2)}
          </Text>
          <Text style={[styles.orderId, { color: theme.textSecondary }]}>
            {t('payment.orderTotal')} • {orderId}
          </Text>
        </View>

        {/* Выбор способа оплаты */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.heading }]}>
            {t('payment.selectMethod')}
          </Text>
          <PaymentMethodSelector
            selectedMethod={selectedMethod}
            onSelect={setSelectedMethod}
          />
        </View>

        {/* Форма карты (если выбран card) */}
        {selectedMethod?.type === 'card' && !showCardForm && (
          <View style={styles.section}>
            <View style={styles.cardHeader}>
              <Text style={[styles.sectionTitle, { color: theme.heading }]}>
                {t('payment.creditCard')}
              </Text>
              <TouchableOpacity
                onPress={() => setShowCardForm(true)}
                style={styles.addCardButton}
              >
                <Text style={[styles.addCardText, { color: theme.primary }]}>
                  {t('payment.addNewCard')}
                </Text>
              </TouchableOpacity>
            </View>
            
            {savedCards.length > 0 && (
              <SavedCards
                cards={savedCards}
                selectedCard={selectedCard}
                onSelect={setSelectedCard}
              />
            )}
          </View>
        )}

        {/* Итоговая информация */}
        <OrderSummary
          subtotal={amount * 0.9} // Примерная сумма товаров
          shipping={0}
          tax={amount * 0.1}
          total={amount}
        />

        {/* Кнопка оплаты */}
        <TouchableOpacity
          style={[
            styles.payButton,
            { backgroundColor: theme.primary },
            (!selectedMethod || loading) && styles.payButtonDisabled,
          ]}
          onPress={processPayment}
          disabled={!selectedMethod || loading}
        >
          <Text style={[styles.payButtonText, { color: theme.heading }]}>
            {loading ? t('payment.processing') : t('payment.pay')}
          </Text>
          <Text style={[styles.payAmount, { color: theme.heading }]}>
            {currency} {amount.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Модальное окно формы карты */}
      <Modal
        visible={showCardForm}
        animationType="slide"
        onRequestClose={() => setShowCardForm(false)}
      >
        <CreditCardForm
          onCardSubmit={handleCardSubmit}
          loading={loading}
        />
      </Modal>

      {/* Модальное окно статуса оплаты */}
      <Modal
        visible={showPaymentStatus}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPaymentStatus(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <PaymentStatus
              status={paymentStatus}
              onComplete={handlePaymentComplete}
            />
            
            {paymentStatus.status === 'failed' && (
              <TouchableOpacity
                style={[styles.retryButton, { backgroundColor: theme.primary }]}
                onPress={handleRetry}
              >
                <Text style={[styles.retryButtonText, { color: theme.heading }]}>
                  {t('payment.retry')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  amountCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  amountLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  amount: {
    fontSize: 40,
    fontWeight: '800',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addCardButton: {
    padding: 8,
  },
  addCardText: {
    fontSize: 14,
    fontWeight: '600',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginTop: 24,
  },
  payButtonDisabled: {
    opacity: 0.5,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  payAmount: {
    fontSize: 20,
    fontWeight: '800',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  retryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default PaymentScreen;