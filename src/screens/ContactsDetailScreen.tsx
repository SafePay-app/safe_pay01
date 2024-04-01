import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
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
  const [solanaAddress, setSolanaAddress] = useState<string>('');
  const [isAddressSaved, setIsAddressSaved] = useState<boolean>(false);

  useEffect(() => {
    // Kaydedilmiş Solana adresini al
    const getSavedAddress = async () => {
      try {
        const savedAddress = await AsyncStorage.getItem(`solanaAddress_${contact.recordID}`);
        if (savedAddress !== null) {
          setSolanaAddress(savedAddress);
          setIsAddressSaved(true);
        }
      } catch (error) {
        console.error('Error retrieving saved Solana address:', error);
      }
    };

    getSavedAddress();
  }, []);

  const handleSaveAddress = async () => {
    // Try to save the Solana address to AsyncStorage
    try {
      await AsyncStorage.setItem(`solanaAddress_${contact.recordID}`, solanaAddress);
      console.log('Saved Solana address:', solanaAddress);
      // Immediately after saving, update the state to reflect the change
      setIsAddressSaved(true); // This line makes the address appear without delay
    } catch (error) {
      console.error('Error saving Solana address:', error);
    }
  };
  
  const handleSolanaAddressPress = () => {
    // Eğer adres kaydedilmişse, gönderme ekranına yönlendi
    if (isAddressSaved) {
      navigation.navigate('SendSolScreen', { solanaAddress });
    }
  };

  const displayPartialAddress = (address: string) => {
    const maxLength = 15; // Maksimum karakter sayısı
    return address.length > maxLength ? `${address.substring(0, maxLength)}...` : address;
  };

  const formatPhoneNumber = (rawNumber: string) => {
    const cleaned = ('' + rawNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return rawNumber; // Return the original number if it doesn't match the expected format
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
      <Image source={require('../assets/points.png')} style={styles.pointsIcon}/>
    </TouchableOpacity>
    


      {/* Geri kalan detaylar */}
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

      <View style={styles.solanaContainer}>
        <Image source={require('../assets/solana.webp')} style={styles.solanaIcon} />
        <TextInput
          style={styles.solanaInput}
          placeholder='Enter Solana address'
          placeholderTextColor='#7f8c8d'
          onChangeText={setSolanaAddress}
          value={solanaAddress}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Kaydedilmiş Solana adresinin kısmen gösterildiği bölüm */}
      {isAddressSaved && solanaAddress ? (
        <View style={styles.solanaSavedContainer}>
          <TouchableOpacity onPress={handleSolanaAddressPress} style={styles.solanaAddressButton}>
            <Text style={styles.solanaAddressButtonText}>
              {`Solana Address: ${displayPartialAddress(solanaAddress)}`}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: 120, // Set the width to the desired size
    height: 120, // Set the height to the desired size (same as width for a circle)
    borderRadius: 60, // Make the image round (half of width or height)
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Ensure the rounded corners are applied
    marginTop: 24, // Adjust the top margin to align with your design
    alignSelf: 'center', // Center the image horizontally
  },
  // Other styles remain unchanged
  container: {
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  solanaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    margin: 10,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width:0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
    },
    solanaIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    },
    solanaInput: {
    flex: 1,
    height: 40,
    borderColor: '#3d58d1',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#2c3e50',
    },
    saveButton: {
    backgroundColor: '#3d58d1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
    },
    saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    },
    solanaSavedContainer: {
    backgroundColor: '#3d58d1',
    margin: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
    },
    solanaAddressButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    },
    solanaAddressButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    },
    favoriteButton: {
    position: 'absolute',
    flexDirection:"row",
    top: 20,
    right: 20,
    },
    favoriteIcon: {
    width: 30,
    height: 30,
    },
    pointsIcon:{
      width:30,
      height:30,
      marginLeft:3
    }
    });
    
    export default ContactsDetailScreen;
