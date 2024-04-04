import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  TransactionDetailScreen: {
    transactionId: string;
  };
};

type TransactionDetailScreenRouteProp = RouteProp<RootStackParamList, 'TransactionDetailScreen'>;

const TransactionDetailScreen: React.FC = () => {
  const route = useRoute<TransactionDetailScreenRouteProp>();
  const { transactionId } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={require('../assets/check-circle.png')} style={styles.icon} />
        <Text style={styles.title}>Transaction Complete</Text>
      </View>
      <View style={styles.idContainer}>
        <Text style={styles.transactionIdLabel}>Transaction ID</Text>
        <Text style={styles.transactionId}>{transactionId}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => { /* Implement view in explorer */ }}>
        <Text style={styles.buttonText}>View in Explorer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 30,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
  },
  idContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)', // 10% opacity
  },
  transactionIdLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color:"black"
  },
  transactionId: {
    fontSize: 12,
    color: '#333',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#fff',
    padding: 10,
    width: '40%',
    alignItems: 'center',
    borderWidth: 0.6,
    borderRadius: 15,
  },
  buttonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TransactionDetailScreen;
