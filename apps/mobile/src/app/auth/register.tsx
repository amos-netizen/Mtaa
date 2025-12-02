import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { authApi } from '@/lib/api/auth';
import { SecureStore } from '@/lib/storage';

export default function RegisterScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [neighborhoodId, setNeighborhoodId] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!phoneNumber || !fullName || !username || !neighborhoodId) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await authApi.register({
        phoneNumber,
        fullName,
        username,
        neighborhoodId,
      });
      setOtpSent(true);
      Alert.alert('Success', 'OTP sent to your phone number');
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.verifyOtp(phoneNumber, otpCode);
      await SecureStore.setItem('accessToken', response.accessToken);
      await SecureStore.setItem('refreshToken', response.refreshToken);
      router.replace('/dashboard');
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (otpSent) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>Enter the 6-digit code sent to {phoneNumber}</Text>
        <TextInput
          style={styles.input}
          value={otpCode}
          onChangeText={setOtpCode}
          placeholder="000000"
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleVerifyOtp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify OTP'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>Join your neighborhood on Mtaa</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Phone Number (+254712345678)"
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Full Name"
      />
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={neighborhoodId}
        onChangeText={setNeighborhoodId}
        placeholder="Neighborhood ID (UUID)"
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: '#0ea5e9',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#0ea5e9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});



