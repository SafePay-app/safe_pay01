import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './RootStackParamList'; // Assuming you have a RootStackParamList type

type ContactDetailScreenRouteProp = RouteProp<RootStackParamList, 'ContactsDetail'>;

type ContactDetailProps = {
  route: ContactDetailScreenRouteProp;
  navigation: NavigationProp<RootStackParamList>;
};

const ContactsDetailScreen: React.FC<ContactDetailProps> = ({ route, navigation }) => {
  const { contact } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [newSolanaAddress, setNewSolanaAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSaveAddress = async () => {
    if (newSolanaAddress.length > 0) {
      try {
        await AsyncStorage.setItem(`solanaAddress_${contact.recordID}`, newSolanaAddress);
        // Adresi kaydettikten sonra modalı kapat
        setModalVisible(false);
      } catch (error) {
        console.error('Error saving Solana address:', error);
      }
    } else {
      setErrorMessage('Please enter a valid Solana address.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Image
          style={styles.backgroundImage}
          source={contact.thumbnailPath ? { uri: contact.thumbnailPath } : require('../assets/Phantom.png')}
        />
      </View>
      <Text style={styles.name}>{`${contact.givenName} ${contact.familyName}`}</Text>
      <TouchableOpacity style={styles.favoriteButton}>
        <Image source={require('../assets/favoritee.png')} style={styles.favoriteIcon} />
        <Image source={require('../assets/points.png')} style={styles.pointsIcon} />
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <TouchableOpacity>
          <Image source={require('../assets/phone.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.infoText}>{contact.phoneNumbers[0]?.number}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Image source={require('../assets/email.png')} style={styles.emailIcon} />
        <Text style={styles.infoText}>{contact.emailAddresses[0]?.email}</Text>
      </View>

      <View style={styles.walletContainer}>
        <Text style={styles.walletText}>Wallet</Text>
        <Text style={styles.walletAddress}>
          {newSolanaAddress ? newSolanaAddress : ''}
        </Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addWalletButton}>
          <Text style={styles.addWalletButtonText}>+Add</Text>
        </TouchableOpacity>
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
            <TextInput
              placeholder="Enter Solana address"
              value={newSolanaAddress}
              onChangeText={setNewSolanaAddress}
              style={styles.input}
              autoCorrect={false}
            />
            <TouchableOpacity onPress={handleSaveAddress} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            {errorMessage !== "" && <Text style={styles.errorMessage}>{errorMessage}</Text>}
          </View>
        </View>
      </Modal>
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
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 10,
  },
  infoText: {
    fontSize: 18,
    color: '#333',
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
    marginLeft: 3
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent:"flex-end",
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '100%',
    height:"25%",
    alignItems:"center",
    justifyContent:"center",
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
  },
  input: {
    height: 40,
    width:"100%",
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#6200ee',
    borderRadius: 5,
    paddingVertical: 10,
    width:"100%",
  },
  saveButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
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
  },
  walletText: {
    fontSize: 18,
    color: '#333',
    flex: 1,
  },
  walletAddress: {
    fontSize: 16,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  addWalletButton: {
    backgroundColor: '#6200ee', // Buton rengi
    width: 66, // Düğme genişliği
    height: 44, // Düğme yüksekliği
    borderRadius: 10, // Yarıçap, düğmeyi yuvarlak yapar
    justifyContent: 'center', // İçerik ortalanır
    alignItems: 'center', // İçerik ortalanır
  },
  addWalletButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 28, // "+" işaretinin ortalanması için
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
  closeIcon: {
    width: 12,
    height: 12,
  },
});

export default ContactsDetailScreen;
