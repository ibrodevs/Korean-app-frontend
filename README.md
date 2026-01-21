# Korean E-commerce Mobile App

A modern React Native Expo e-commerce application for Korean products with complete theming, internationalization, and navigation structure.

## 🚀 Features

- **Complete E-commerce Flow**: Browse products, add to cart, checkout, and track orders
- **Multi-language Support**: Korean, English, and Russian translations
- **Dark/Light Themes**: System-aware theming with manual override
- **Modern UI/UX**: Clean, minimalist design with smooth animations
- **TypeScript Support**: Full TypeScript implementation for type safety
- **Navigation**: Stack and bottom tab navigation with React Navigation v6
- **State Management**: Context API for theme and user state
- **Responsive Design**: Adaptive layouts for different screen sizes

## 🎨 Design System

### Color Palette
- **Primary**: #F8E9A1 (accent/brand color)
- **Error/Sale**: #F76C6C (error states, sale badges)
- **Secondary**: #A8D0E6 (secondary actions)
- **Headers**: #374785 (header backgrounds)
- **Navigation**: #24305E (bottom tabs, primary buttons)

### Typography
- Modern font hierarchy with weight variations
- Responsive text sizing
- Accessibility-compliant contrast ratios

## 📱 Screen Structure

### Authentication Flow
1. **Splash Screen** - App loading and route determination
2. **Onboarding** - 4-slide introduction (first-time users)
3. **Login/Register** - User authentication
4. **Forgot Password** - Password recovery

### Main App Flow
1. **Home Screen** - Featured products, categories, search
2. **Search Screen** - Product search with filters
3. **Product Detail** - Detailed product view
4. **Shopping Cart** - Cart management
5. **Checkout** - Order placement
6. **Orders History** - Order tracking and history
7. **Profile** - User account management
8. **Settings** - App preferences

## 🛠 Tech Stack

- **React Native** (0.72.6)
- **Expo** (~49.0.15)
- **TypeScript** (^5.1.3)
- **React Navigation** (v6) - Stack & Bottom Tabs
- **React-i18next** (^13.5.0) - Internationalization
- **AsyncStorage** (^1.19.5) - Local storage
- **Vector Icons** (@expo/vector-icons)
- **React Native SVG** (13.9.0)

## 📂 Project Structure

```
src/
├── screens/           # All screen components
│   ├── SplashScreen.tsx
│   ├── OnboardingScreen.tsx
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── HomeScreen.tsx
│   ├── SearchScreen.tsx
│   ├── OrdersScreen.tsx
│   ├── ProfileScreen.tsx
│   └── ...
├── components/        # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── ProductCard.tsx
│   └── ...
├── navigation/        # Navigation configuration
│   ├── RootNavigator.tsx
│   ├── MainTabNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── types.ts
├── theme/            # Theme and styling
│   └── ThemeProvider.tsx
├── utils/            # Utility functions
│   ├── i18n.ts
│   └── locales/
│       ├── en.json
│       ├── ko.json
│       └── ru.json
├── services/         # API and external services
├── constants/        # App constants
│   ├── theme.ts
│   └── types.ts
└── ...
```

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 16.x)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd korean-app
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start the development server**
```bash
npm start
# or
yarn start
```

4. **Run on device/simulator**
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 🌐 Internationalization

The app supports multiple languages with react-i18next:

- **English** (en) - Default
- **Korean** (ko) - Primary target market
- **Russian** (ru) - Additional market

### Adding New Languages

1. Create a new JSON file in `src/utils/locales/`
2. Add translations following the existing structure
3. Import and register in `src/utils/i18n.ts`

## 🎨 Theming

The app supports light, dark, and system themes:

```tsx
import { useTheme } from '@/theme/ThemeProvider';

const { colors, theme, setTheme } = useTheme();
```

### Theme Options
- `light` - Light theme
- `dark` - Dark theme  
- `system` - Follow system preference

## 🧩 Component Usage

### Button Component
```tsx
import Button from '@/components/Button';

<Button
  title="Click Me"
  onPress={handlePress}
  variant="primary" // primary, secondary, outline
  size="medium" // small, medium, large
  loading={false}
  disabled={false}
/>
```

### Input Component
```tsx
import Input from '@/components/Input';

<Input
  label="Email"
  placeholder="Enter email"
  value={email}
  onChangeText={setEmail}
  leftIcon="mail-outline"
  error={emailError}
/>
```

### Product Card
```tsx
import ProductCard from '@/components/ProductCard';

<ProductCard
  product={product}
  onPress={handleProductPress}
  onAddToCart={handleAddToCart}
  onToggleWishlist={handleWishlistToggle}
/>
```

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all files
- Follow ESLint configuration
- Use Prettier for code formatting
- Follow React Native best practices

### Component Structure
- Functional components with hooks
- Props interfaces defined with TypeScript
- Responsive styling with theme system
- Accessibility-compliant implementations

### State Management
- Context API for global state (theme, user)
- Local state with useState for component state
- AsyncStorage for persistent data

## 🔧 Configuration

### App Configuration
Configuration is managed in `app.json`:
- App name and version
- Icon and splash screen
- Platform-specific settings
- Asset bundle patterns

### Navigation Configuration
Navigation structure is defined in `src/navigation/`:
- Root stack navigator
- Bottom tab navigator
- Authentication stack
- Type-safe navigation params

## 📱 Platform Support

- **iOS**: iOS 11+
- **Android**: API level 21+ (Android 5.0+)
- **Web**: Modern browsers with React Native Web

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

Made with ❤️ for the Korean e-commerce market