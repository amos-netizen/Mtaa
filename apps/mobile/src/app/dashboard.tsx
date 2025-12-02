import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { authApi } from '@/lib/api/auth';
import { SecureStore } from '@/lib/storage';

export default function DashboardScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authApi.getMe();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.replace('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      await SecureStore.removeItem('accessToken');
      await SecureStore.removeItem('refreshToken');
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      {user && (
        <View style={styles.profileCard}>
          <Text style={styles.cardTitle}>Profile</Text>
          <Text style={styles.profileText}>Name: {user.fullName}</Text>
          <Text style={styles.profileText}>Username: {user.username}</Text>
          <Text style={styles.profileText}>Phone: {user.phoneNumber}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    padding: 10,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: '#f3f4f6',
    padding: 20,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  profileText: {
    fontSize: 16,
    marginBottom: 10,
  },
});



