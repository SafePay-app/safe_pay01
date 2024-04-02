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
    <View style={styles.title_container}>
      <View style={styles.border}>
        <Image source={require('../assets/check-circle.png')} style={styles.icon} />
        <Text style={styles.title}>Transaction Complete</Text>
      </View>
      <View style={styles.id_container}>
        <Text style={{fontSize:15,fontWeight:"bold",marginTop:12}}>Transaction ID:</Text>
      <Text style={styles.transactionId}>{transactionId}</Text>
      </View>
      <View style={styles.button_container}>
      <TouchableOpacity style={styles.button} onPress={() => { /* Implement view in explorer */ }}>
          <Text style={styles.buttonText}>View in Explorer</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title_container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  id_container:{
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal:10
  },
  border: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  icon: {
    width: 125, // Ekran görüntüsüne göre ayarla
    height: 125, // Ekran görüntüsüne göre ayarla
    marginBottom: 8, // Ekran görüntüsüne göre ayarla
  },
  title: {
    fontSize: 24, 
    color:"black",
    fontWeight: 'bold',
    marginBottom: 20,
  },
  transactionId: {
    fontSize: 12,
    color: '#333',
    marginBottom: 20,
  },
  button_container:{
    flex:1,
    alignItems:"center",
    justifyContent:"center",
    marginBottom:100,
    padding:10,
  },
  button: {
    backgroundColor: '#fff',
    padding: 8,
    marginBottom:270,
    width:'50%',
    height:50,
    alignItems:"center",
    justifyContent:"center",
    borderWidth:0.6,
    borderRadius:18
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TransactionDetailScreen;
