import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Contact } from 'react-native-contacts'; // Eğer 'Contact' tipini kullanıyorsanız

// Props interface'i (Eğer TypeScript kullanıyorsanız)
interface FavoritesScreenProps {
  contacts: Contact[];
  favorites: { [key: string]: boolean };
  toggleFavorite: (contactId: string) => void; // Favori durumunu değiştiren fonksiyon
}

// renderItem fonksiyonu (Bir kişi kartını nasıl render edeceğinizi gösterir)
const renderItem = ({ item, toggleFavorite }: { item: Contact; toggleFavorite: (contactId: string) => void }) => (
  <TouchableOpacity style={styles.card} onPress={() => toggleFavorite(item.recordID)}>
    <Image
      source={item.thumbnailPath ? { uri: item.thumbnailPath } : require('../assets/Phantom.png')}
      style={styles.contactImage}
    />
    <View style={styles.cardContent}>
      <Text style={styles.name}>{`${item.givenName} ${item.familyName}`}</Text>
      <TouchableOpacity onPress={() => toggleFavorite(item.recordID)}>
        <Image
          source={require('../assets/favorite_filled.png')} // Burada dolu favori simgesi gösterilir
          style={styles.favoriteIcon}
        />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

// FavoritesScreen bileşeni (Favorileri gösterir)
const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ contacts, favorites, toggleFavorite }) => {
  // Yalnızca favori olan kişileri filtreleyerek listeyi al
  const favoriteContacts = contacts.filter((contact) => favorites[contact.recordID]);

  return (
    <FlatList
      data={favoriteContacts}
      keyExtractor={(item) => item.recordID}
      renderItem={({ item }) => renderItem({ item, toggleFavorite })}
      // ...diğer gerekli props
    />
  );
};

const styles = StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#fff',
      borderRadius: 10,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    contactImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    cardContent: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginLeft: 10,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    favoriteIcon: {
      width: 24,
      height: 24,
      tintColor: 'red', // Favori simgesinin rengi
    },
  });
  
  export default FavoritesScreen;
  