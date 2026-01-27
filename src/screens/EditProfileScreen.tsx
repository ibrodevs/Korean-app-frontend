import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../components/Text';
import DateOfBirthPicker from '../components/DateOfBirthPicker';

interface EditProfileScreenProps {
  route: {
    params: {
      profile: {
        id: string;
        avatar?: string;
        fullName: string;
        email: string;
        phone?: string;
        birthDate?: string;
        gender?: string;
      };
      onSave: (updatedProfile: any) => void;
    };
  };
}

const EditProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme, isDark } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  
  // Мок-данные, если нет параметров
  const mockProfile = {
    id: '1',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
    fullName: 'Albert Flores',
    email: 'albertflores@mail.com',
    phone: '+1 (555) 123-4567',
    birthDate: '01/01/1988',
    gender: 'Male'
  };

  const initialProfile = (route as any)?.params?.profile || mockProfile;
  const onSave = (route as any)?.params?.onSave || (() => {});

  const [profile, setProfile] = useState(initialProfile);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(profile);
    navigation.goBack();
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const formatDisplayDate = (dateString: string) => {
    // Преобразуем формат даты для отображения
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      return `${day} ${monthNames[parseInt(month) - 1]} ${year}`;
    }
    return dateString;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Image */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: profile.avatar }}
              style={styles.avatar}
            />
            <TouchableOpacity style={[styles.editImageButton, { backgroundColor: theme.primary }]}>
              <Ionicons name="pencil" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          {/* Name Field */}
          <View style={[styles.fieldContainer, { borderBottomColor: theme.border }]}>
            <View style={styles.fieldContent}>
              <Ionicons name="person-outline" size={20} color={theme.textSecondary} />
              <Text style={[styles.fieldValue, { color: theme.text }]}>
                {profile.fullName}
              </Text>
            </View>
          </View>

          {/* Date of Birth Field */}
          <TouchableOpacity
            style={[styles.fieldContainer, { borderBottomColor: theme.border }]}
            onPress={() => setShowDatePicker(true)}
          >
            <View style={styles.fieldContent}>
              <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
              <Text style={[styles.fieldValue, { color: theme.text }]}>
                {formatDisplayDate(profile.birthDate)}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Email Field */}
          <View style={[styles.fieldContainer, { borderBottomColor: theme.border }]}>
            <View style={styles.fieldContent}>
              <Ionicons name="mail-outline" size={20} color={theme.textSecondary} />
              <Text style={[styles.fieldValue, { color: theme.text }]}>
                {profile.email}
              </Text>
            </View>
          </View>

          {/* Gender Field */}
          <TouchableOpacity style={[styles.fieldContainer, { borderBottomColor: theme.border }]}>
            <View style={[styles.fieldContent, { justifyContent: 'space-between' }]}>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                Gender
              </Text>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Date of Birth Picker */}
      <DateOfBirthPicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={(date) => handleInputChange('birthDate', date)}
        initialDate={formatDisplayDate(profile.birthDate)}
      />
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  formSection: {
    paddingHorizontal: 20,
  },
  fieldContainer: {
    paddingVertical: 20,
    borderBottomWidth: 0.5,
  },
  fieldContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 17,
    fontWeight: '400',
  },
  fieldValue: {
    fontSize: 17,
    fontWeight: '400',
    marginLeft: 15,
  },
});

export default EditProfileScreen;