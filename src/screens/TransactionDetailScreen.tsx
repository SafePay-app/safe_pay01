import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './RootStackParamList'; // Assuming you have a RootStackParamList type

type TransactionDetailScreenRouteProp = RouteProp<RootStackParamList, 'TransactionDetail'>;

type TransactionDetailScreenProps = {
  route: TransactionDetailScreenRouteProp;
};

const TransactionDetailScreen: React.FC<TransactionDetailScreenProps> = ({ route }) => {
  const { transactionSignature, amount, date } = route.params;

  return (
    <LinearGradient colors={['#E1AFD1', '#FFE6E6']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
          <Text style={styles.title}>Transaction Detail</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Amount:</Text>
            <Text style={styles.detailValue}>{amount} SOL</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Date:</Text>
            <Text style={styles.detailValue}>{new Date(date).toLocaleString()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Signature:</Text>
            <Text style={[styles.detailValue, styles.signature]}>{transactionSignature}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Status:</Text>
            <Text style={styles.detailValue}>Completed</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '90%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  detailTitle: {
    fontSize: 18,
    color: 'black',
    fontWeight:"bold"
  },
  detailValue: {
    fontSize: 18,
    color: 'gray',
  },
  signature: {
    flex: 1,
    maxWidth: 200,
    overflow: 'hidden',
    // textOverflow: 'ellipsis',
  },
});

export default TransactionDetailScreen;
