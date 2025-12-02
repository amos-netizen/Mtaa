import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Mtaa</Text>
      <Text style={styles.subtitle}>Hyperlocal Kenyan Neighborhood Social Network</Text>
      <View style={styles.buttonContainer}>
        <Link href="/auth/login" asChild>
          <TouchableOpacity style={[styles.button, styles.primaryButton]}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/auth/register" asChild>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0ea5e9',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 15,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#0ea5e9',
  },
  secondaryButton: {
    backgroundColor: '#0284c7',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});



