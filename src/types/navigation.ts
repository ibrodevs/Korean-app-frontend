import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Product } from './product';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: undefined;
  ProductDetail: { product: Product };
  AdvancedSearch: { initialQuery?: string };
  Checkout: { items: any[] };
  Payment: {
    orderId: string;
    amount: number;
    currency: string;
    items: any[];
    shippingAddress: any;
  };
  OrderConfirmation: {
    orderId: string;
    transactionId: string;
  };
  OrderTracking: { orderId: string };
  OrderDetails: { orderId: string };
  Orders: undefined;
  Support: { orderId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Categories: undefined;
  Cart: undefined;
  Profile: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type MainTabScreenProps<Screen extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;