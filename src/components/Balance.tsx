import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Connection, PublicKey } from '@solana/web3.js';

interface BalanceScreenProps {
  route: {
    params: {
      publicKey: string;
    };
  };
}

const BalanceScreen: React.FC<BalanceScreenProps> = ({ route }) => {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const { publicKey } = route.params;

    const getBalance = async () => {
      try {
        const connection = new Connection('https://api.testnet.solana.com');
        const balanceInLamports = await connection.getBalance(new PublicKey(publicKey));
        const balanceInSOL = balanceInLamports / 1000000000;
        setBalance(balanceInSOL);
      } catch (error) {
        console.error(error);
      }
    };

    if (publicKey) {
      getBalance();
    }
  }, [route.params]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cüzdan Bakiyesi</Text>
      {balance !== null ? (
        <Text style={styles.balance}>{`${balance} SOL`}</Text>
      ) : (
        <Text>Bakiye yükleniyor...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  balance: {
    fontSize: 18,
  },
});

export default BalanceScreen;
