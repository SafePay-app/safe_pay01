import React, { useState } from 'react';
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
  const [isAddressSaved, setIsAddressSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddAddress = () => {
    setModalVisible(true);
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

  const handleSendSolScreen = async () => {
    // Get the saved Solana address from AsyncStorage
    const savedAddress = await AsyncStorage.getItem(`solanaAddress_${contact.recordID}`);
    if (savedAddress) {
      // Navigate to SendSolScreen and pass the saved address as a parameter
      navigation.navigate('SendSolScreen', { solanaAddress: savedAddress });
    } else {
      // Handle case where no address is saved
      console.error('No Solana address saved for contact:', contact.recordID);
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
          {/* <Image source={require('../assets/phone.png')} style={styles.icon} /> */}
        </TouchableOpacity>
        <Text>Phone</Text>
        <Text style={styles.infoText}>{contact.phoneNumbers[0]?.number}</Text>
      </View>
      <View style={styles.infoContainer}>
        {/* <Image source={require('../assets/email.png')} style={styles.emailIcon} /> */}
        <Text>Email</Text>
        <Text style={styles.infoText}>{contact.emailAddresses[0]?.email}</Text>
      </View>

      <View style={styles.walletContainer}>
        <Text style={styles.walletText}>Wallet</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addWalletButton}>
          <Text style={styles.addWalletButtonText}>+Add</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.walletAddressContainer} onPress={handleSendSolScreen}>
        {newSolanaAddress && (
          <>
            <Image
              source={require('../assets/solana.webp')}
              style={styles.solanaIcon}
            />
            <Text style={styles.walletAddressText}>
              {newSolanaAddress}
            </Text>
          </>
        )}
      </TouchableOpacity>
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
            <Text style={{ fontSize: 25, fontWeight: "bold", color: "black", marginBottom: 12, }}>Add Wallet Address</Text>
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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  <TouchableOpacity 
    style={[styles.saveButton, isAddressSaved ? styles.activeButton : styles.inactiveButton]}
    onPress={isAddressSaved ? () => {/* handle the press action */} : null}
    disabled={!isAddressSaved}
  >
    <Text style={styles.saveButtonText}>Pay</Text>
  </TouchableOpacity>
  <TouchableOpacity 
    style={styles.moreButton}
    onPress={() => {/* handle the press action */}}
  >
    {/* <Image source={require('../assets/more.png')} style={styles.moreIcon} /> */}
    <Text style={{color:"#fff",fontSize:30,flex:1,justifyContent:"center",alignItems:"center",textAlign:"center"}}>...</Text>
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
    fontSize: 15
  },
  saveButton: {
    flex:1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '75%',
    marginTop:200,
    marginLeft:10,
    marginRight:8,
    borderRadius:10
  },
  saveButtonModal: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor:"purple",
    borderRadius:10
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
  },
  walletAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    marginTop: 1,
  },
  walletAddressText: {
    fontSize: 10,
    color: '#333',
    marginTop: -16
    // marginLeft: 2,
  },
  solanaIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
    marginBottom: 12,
  },
  walletText: {
    fontSize: 18,
    color: '#333',
    flex: 1,
  },
  walletAddress: {
    fontSize: 8,
    color: '#333',
    flex: 2,
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
    width: 15,
    height: 15,
  },
  activeButton: {
    backgroundColor: '#6200ee',
  },
  inactiveButton: {
    backgroundColor: '#ccc',
    opacity: 0.5,
  },
  moreButton: {
    width: '25%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    marginRight:5,
    borderRadius: 10,
    marginTop:200,
  },
  moreIcon: {
    width: 20,
    height: 20,
  },
});

export default ContactsDetailScreen;
