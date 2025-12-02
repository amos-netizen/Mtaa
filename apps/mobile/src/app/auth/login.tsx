import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { authApi } from '@/lib/api/auth';
import { SecureStore } from '@/lib/storage';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setLoading(true);
    try {
      await authApi.login(phoneNumber);
      setOtpSent(true);
      Alert.alert('Success', 'OTP sent to your phone number');
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
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
    <View style={styles.container}>
      <Text style={styles.title}>Sign in to Mtaa</Text>
      <Text style={styles.subtitle}>Enter your phone number to receive an OTP</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="+254712345678"
        keyboardType="phone-pad"
        autoFocus
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSendOtp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Sending OTP...' : 'Send OTP'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
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
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0ea5e9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
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



