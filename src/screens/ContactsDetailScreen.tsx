import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './RootStackParamList';
import { Connection, PublicKey, clusterApiUrl, Transaction, SystemProgram, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

type ContactDetailScreenRouteProp = RouteProp<RootStackParamList, 'ContactsDetail'>;

type ContactDetailProps = {
  route: ContactDetailScreenRouteProp;
  navigation: NavigationProp<RootStackParamList>;
};

const ContactsDetailScreen: React.FC<ContactDetailProps> = ({ route, navigation }) => {
  const { contact } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [newSolanaAddress, setNewSolanaAddress] = useState("");
  const [isAddressSaved, setIsAddressSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState('');
  const [sendModalVisible, setSendModalVisible] = useState(false);

  const handleAddAddress = () => {
    if (!isAddressSaved) {
      setModalVisible(true);
    } else {
      setIsEditing(true);
    }
  };

  const handleSaveAddress = async () => {
    if (newSolanaAddress.trim().length === 0) {
      Alert.alert('Validation', 'Please enter a valid Solana address.');
      return;
    }
    try {
      await AsyncStorage.setItem(`solanaAddress_${contact.recordID}`, newSolanaAddress);
      setIsAddressSaved(true);
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save the Solana address.');
    }
  };

  const handleSendTransaction = async () => {
    try {
      // Solana ağına bağlan
      const connection = new Connection('https://api.devnet.solana.com');
  
      // Gönderici ve alıcı hesaplarını belirle
      const senderPublicKey = new PublicKey('Exp8JQXYirkqRcLuh9JoXunvyp893XTunigQeZ7Qw1se');
      const receiverPublicKey = new PublicKey(newSolanaAddress);
  
      // Gönderici hesapın bakiyesini kontrol et
      const senderAccountInfo = await connection.getAccountInfo(senderPublicKey);
      if (!senderAccountInfo) {
        throw new Error('Gönderici hesap bulunamadı');
      }
  
      // Gönderici hesap için özel anahtar oluştur
      const privateKey = new Uint8Array([26, 6, 112, 138, 66, 108, 175, 95, 47, 83, 175, 223, 234, 160, 5, 161, 122, 86, 0, 24, 112, 109, 156, 160, 6, 243, 111, 118, 231, 112, 205, 216, 93, 105, 27, 59, 25, 59, 189, 122, 249, 129, 71, 218, 151, 150, 181, 123, 166, 25, 236, 30, 42, 246, 213, 163, 46, 135, 232, 211, 11, 112, 149, 29]);
  
      // Gönderilecek miktarı belirle
      const lamportsToSend = Number(amount) * 10 ** 9; // SOL cinsinden miktarı lamport cinsine çevir
  
      // İşlem oluştur
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderPublicKey,
          toPubkey: receiverPublicKey,
          lamports: lamportsToSend,
        })
      );
  
      // İşlemi imzala
      transaction.feePayer = senderPublicKey;
      transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
      transaction.partialSign(new Keypair(privateKey));
  
      // İşlemi ağa gönder ve onayla
      const signature = await sendAndConfirmTransaction(connection, transaction, [new Keypair(privateKey)]);
  
      // Başarılı işlem bildirimi göster
      Alert.alert('Success', `Transaction successful! Amount: ${amount} SOL`);
  
      // Modal'ı kapat
      setSendModalVisible(false);
    } catch (error) {
      // Hata durumunda kullanıcıya bildirim göster
      Alert.alert('Error', `Failed to send transaction: ${error.message}`);
      console.log(error);
    }
  };

  const handleSendSolScreen = async () => {
    setSendModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Image
          style={styles.backgroundImage}
          source={contact.thumbnailPath ? { uri: contact.thumbnailPath } : require('../assets/Phantom.png')} />
      </View>
      <Text style={styles.name}>{`${contact.givenName} ${contact.familyName}`}</Text>
      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.labelText}>Phone</Text>
          <Text style={styles.infoText}>{contact.phoneNumbers[0]?.number}</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.labelText}>Email</Text>
          <Text style={styles.infoText}>{contact.emailAddresses[0]?.email}</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={{ marginBottom: 25, fontSize: 18, color: "black" }}>Wallet</Text>
        <View style={styles.walletContentContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {isAddressSaved && (
              <>
                <Image source={require('../assets/solana.webp')} style={styles.solanaIcon} />
                <Text style={styles.walletAddressText} numberOfLines={1}>
                  {newSolanaAddress}
                </Text>
              </>
            )}
          </View>
          <TouchableOpacity onPress={handleAddAddress} style={styles.addWalletButton}>
            <Text style={styles.addWalletButtonText}>{isAddressSaved ? 'Edit' : '+ Add'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Image source={require('../assets/close.png')} style={styles.closeIcon} />
            </TouchableOpacity>
            <View style={{ alignSelf: 'flex-start', width: '100%' }}>
              <Text style={styles.modalTitle}>Add Wallet Address</Text>
            </View>
            <TextInput
              placeholder="Enter Solana address"
              value={newSolanaAddress}
              onChangeText={setNewSolanaAddress}
              style={styles.input}
              autoCorrect={false}
            />
            <TouchableOpacity onPress={handleSaveAddress} style={styles.saveButtonModal}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            {errorMessage !== "" && <Text style={styles.errorMessage}>{errorMessage}</Text>}
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={sendModalVisible}
        onRequestClose={() => setSendModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setSendModalVisible(false)}>
              <Image source={require('../assets/close.png')} style={styles.closeIcon} />
            </TouchableOpacity>
            <View style={{ alignSelf: 'flex-start', width: '100%' }}>
              <Text style={styles.modalTitle}>Amount (USDC)</Text>
            </View>
            <TextInput
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
              autoCorrect={false}
              keyboardType='numeric'
            />
            <TouchableOpacity onPress={handleSendTransaction} style={styles.saveButtonModal}>
              <Text style={styles.saveButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity
          style={[styles.saveButton, isAddressSaved ? styles.activeButton : styles.inactiveButton]}
          onPress={isAddressSaved ? handleSendSolScreen : null}
          disabled={!isAddressSaved}
        >
          <Text style={styles.saveButtonText}>Pay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButtonMore, isAddressSaved ? styles.activeButton : styles.inactiveButton]}
          onPress={isAddressSaved ? handleSendTransaction : null}
          disabled={!isAddressSaved}
        >
          <Text style={styles.saveButtonText}>...</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  backgroundImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: 24,
    alignSelf: 'center',
  },
  container: {
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    width: '100%',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  labelText: {
    fontSize: 18,
    color: '#333',
  },
  walletContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 10,
  },
  infoText: {
    fontSize: 18,
    color: 'grey',
  },
  emailIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    marginLeft: 10,
  },
  favoriteButton: {
    position: 'absolute',
    flexDirection: "row",
    top: 20,
    right: 20,
  },
  favoriteIcon: {
    width: 30,
    height: 30,
  },
  pointsIcon: {
    width: 30,
    height: 30,
    marginLeft: 3,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: "flex-end",
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '100%',
    height: "35%",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  input: {
    height: 50,
    width: "100%",
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    fontSize: 15,
  },
  saveButton: {
    flex: 4,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 5,
    marginTop: 180,
  },
  saveButtonMore: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 5,
    marginRight: 10,
    marginTop: 180,
  },
  saveButtonModal: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: "#6420AA",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    marginBottom: 12,
    marginLeft: 10, // Başlığı sola yaslamak için sol kenara biraz boşluk ekleyin
  },
  saveButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  walletContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  walletText: {
    fontSize: 12,
    color: '#333',
  },
  walletAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    paddingVertical: 10,
  },
  walletAddressText: {
    fontSize: 12,
    marginTop: 30,
    color: 'grey',
    marginRight: 10,
    flexShrink: 1,
  },
  solanaIcon: {
    width: 18,
    height: 18,
    marginRight: 5,
    marginLeft: 27.5,
    marginTop: 30
  },
  walletAddress: {
    fontSize: 8,
    color: '#333',
    flex: 2,
  },
  addWalletButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  addWalletButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    paddingHorizontal: 12,
    height: 44,
    textAlign: 'center',
    justifyContent: "center" // Metni ortalamak için textAlign özelliğini ekledik
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
  closeIcon: {
    width: 15,
    height: 15,
  },
  activeButton: {
    backgroundColor: '#6420AA',
  },
  inactiveButton: {
    backgroundColor: '#ccc',
    opacity: 0.5,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
});

export default ContactsDetailScreen;
