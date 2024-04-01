import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Text, Image, TextInput, StyleSheet, PermissionsAndroid, Platform, TouchableOpacity } from 'react-native';
import Contacts, { Contact } from 'react-native-contacts';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  ContactsDetailScreen: { contact: Contact };
  SendSolScreen: { solanaAddress: string };
};

interface ExtendedContact extends Contact {
  solanaAddress?: string;
}

type ContactsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ContactsDetailScreen'>;

const ContactsScreen: React.FC = () => {
  const [contacts, setContacts] = useState<ExtendedContact[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigation = useNavigation<ContactsScreenNavigationProp>();

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts Access',
          message: 'This app needs access to your contacts to display them.',
        }
      ).then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          loadContacts();
        }
      }).catch(error => console.error('Error requesting contacts permission:', error));
    } else {
      loadContacts();
    }
  }, []);

  // Use useFocusEffect to reload contacts whenever the screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadContacts();
    }, [])
  );

  const loadContacts = async () => {
    try {
      const contactsData = await Contacts.getAll();
      const contactsWithAddress = await Promise.all(contactsData.map(async (contact) => {
        const solanaAddress = await AsyncStorage.getItem(`solanaAddress_${contact.recordID}`);
        return { ...contact, solanaAddress }; // Include Solana address in the contact object
      }));

      // Code to sort contacts and set state remains unchanged...
      setContacts(contactsWithAddress);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const handleSolanaAddressPress = (solanaAddress: string) => {
    navigation.navigate('SendSolScreen', { solanaAddress });
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]} ${match[4]} ${match[5]}`;
    }
    return phoneNumber;
  };

  const renderItem = ({ item }: { item: ExtendedContact }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ContactsDetailScreen', { contact: item })}>
      <View style={styles.card}>
        <Image
          source={item.thumbnailPath ? { uri: item.thumbnailPath } : require('../assets/Phantom.png')}
          style={styles.contactImage}
        />
        <View style={styles.cardContent}>
          <Text style={styles.name}>{`${item.givenName} ${item.familyName}`}</Text>
          {item.jobTitle && <Text style={styles.jobTitle}>{item.jobTitle}</Text>}
          {item.phoneNumbers && item.phoneNumbers[0]?.number && (
            <Text style={styles.infoText}>{formatPhoneNumber(item.phoneNumbers[0]?.number)}</Text>
          )}
          {item.solanaAddress && (
            <TouchableOpacity style={styles.solanaAddressContainer} onPress={() => handleSolanaAddressPress(item.solanaAddress)}>
              <Image source={require('../assets/solana.webp')} style={styles.solanaIcon} />
              <Text style={styles.solanaAddressText}>{`Solana Address: ${item.solanaAddress.substring(0, 15)}...`}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Burada arama işlemlerini gerçekleştirebilirsiniz
    // Örneğin, filtreleme yapabilir ve yeni bir listeyi state'e atayabilirsiniz
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Image style={styles.menuIcon} source={require('../assets/menu.png')} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for people"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.recordID || ''}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  menuIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFF6F6',
    borderRadius: 20,
    height: 50,
    padding: 10,
    fontSize: 18,
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderBottomWidth: 0.25,
  },
  cardContent: {
    justifyContent: 'center',
    marginLeft: 10,
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  jobTitle: {
    color: 'grey',
  },
  solanaAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  solanaIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  solanaAddressText: {
    color: 'blue',
  },
  infoText: {
    fontSize: 12,
    marginTop: 1,
    color: '#333',
  },
});

export default ContactsScreen;
