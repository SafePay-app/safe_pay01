import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Linking, Image } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import base58 from 'bs58';
import nacl from 'tweetnacl';
import 'react-native-get-random-values';

// Örnek olarak assets klasöründen phantom.png'yi import ediyoruz
const phantomIcon = require('../assets/Phantom.png');
// Safe Pay logosunu ekliyoruz
const safePayLogo = require('../assets/safe_pay_logo.png');

interface HomeScreenProps {
  route: {
    params: {
      transactionSignature?: string; // Opsiyonel olarak alınan parametre
    };
  };
}

const HomeScreen: React.FC<HomeScreenProps> = ({ route }) => {
  const [dappKeyPair, setDappKeyPair] = useState<nacl.BoxKeyPair | null>(null);
  const transactionSignature = route.params?.transactionSignature;

  useEffect(() => {
    const generateRandomKeyPair = () => {
      try {
        const newKeyPair = nacl.box.keyPair();
        setDappKeyPair(newKeyPair);
      } catch (error) {
        console.error('Error generating random key pair:', error);
      }
    };
  
    generateRandomKeyPair();
  }, []);

  const handleConnectPhantom = async () => {
    if (dappKeyPair) {
      const params = new URLSearchParams({
        dapp_encryption_public_key: base58.encode(dappKeyPair.publicKey),
        cluster: 'mainnet-beta',
        app_url: 'https://phantom.app',
        redirect_link: 'myapp://onConnect',
      });

      const connectUrl = `phantom://v1/connect?${params.toString()}`;

      try {
        await Linking.openURL(connectUrl);
      } catch (error) {
        console.error('Error connecting to Phantom:', error);
      }
    }
  };

  return (
    <LinearGradient colors={['#E1AFD1', '#FFE6E6']} style={styles.container}>
      <View style={styles.content}>
        {/* Safe Pay logosunu butonun üstünde gösterin */}
        <Image source={safePayLogo} style={styles.safePayLogo} />
        <TouchableOpacity style={styles.button} onPress={handleConnectPhantom}>
          {/* Phantom ikonunu metnin başına ekleyin */}
          <Image source={phantomIcon} style={styles.icon} />
          <Text style={styles.buttonText}>Connect Your Phantom Wallet</Text>
        </TouchableOpacity>
      </View>
      {transactionSignature && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Last Transaction Confirmed</Text>
          <Text style={styles.cardContent}>Signature: {transactionSignature}</Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // Set background to transparent to allow gradient to show
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8A2BE2', // Adjust the color to be more vibrant
    paddingHorizontal: 25, // Sağdan ve soldan boşlukları artırın
    paddingVertical: 15, // Düğme boyutunu biraz küçültün
    borderRadius: 30, // Make the corners rounder
    shadowColor: '#5D3FD3', // Add a shadow to the button as well
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10, // This adds a shadow on Android
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20, // Make the font slightly smaller
    fontWeight: 'bold',
    marginLeft: 10, // Adjust the spacing
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  safePayLogo: {
    width: 250, // Increase the width to make the logo more prominent
    height: 250, // Increase the height proportionally
    resizeMode: 'contain', // Ensure the logo scales nicely
    marginBottom: 32, // Increase spacing between the logo and the button
    shadowColor: '#fff', // Add a shadow to make the logo pop
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
  },
  icon: {
    width: 30, // Make the icon larger
    height: 30, // Keep the aspect ratio
    shadowColor: '#fff',
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  card: {
    marginTop: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    margin:10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 16,
  },
});


export default HomeScreen;
