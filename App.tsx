import 'react-native-get-random-values';
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import HomeScreen from "./src/screens/HomeScreen";
import ContactsScreen from "./src/screens/ConctactsScreen";
// import SafePay from "./src/screens/SafePay.Screen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
// import SendScreen from "./src/screens/SendScreen";
import ContactsDetailScreen from "./src/screens/ContactsDetailScreen";
import SendSolScreen from "./src/screens/SendSolScreen";
import TransactionDetailScreen from './src/screens/TransactionDetailScreen';
import SafePayScreen from './src/screens/SafePayScreen';

const homeIcon = require('./src/assets/home_icon.png');
const contactsIcon = require('./src/assets/user.png');
const safePayIcon = require('./src/assets/safe_pay.png');
const favoritesIcon = require('./src/assets/starr.png');


const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />
        {/* <Stack.Screen name="SendScreen" component={SendScreen} /> */}
        <Stack.Screen name="ContactsDetailScreen" component={ContactsDetailScreen} options={{ headerTitle: 'Detail' }} />
        <Stack.Screen name="SendSolScreen" component={SendSolScreen} options={{ headerTitleAlign: 'center' }} />
        <Stack.Screen name="TransactionDetailScreen" component={TransactionDetailScreen} options={{ headerTitleAlign: 'center' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;

          if (route.name === 'Home') {
            iconSource = homeIcon;
          } else if (route.name === 'Contacts') {
            iconSource = contactsIcon;
          } else if (route.name === 'SafePay') {
            iconSource = safePayIcon;
          } else if (route.name === 'Favorites') {
            iconSource = favoritesIcon;
          }


          return <Image source={iconSource} style={{ width: 24, height: 24, tintColor: focused ? 'blue' : 'gray' }} />;
        },
        tabBarLabel: ({ focused, color }) => {
          let label;

          if (route.name === 'Home') {
            label = 'Home';
          } else if (route.name === 'Contacts') {
            label = 'Contacts';
          } else if (route.name === 'SafePay') {
            label = 'SafePay';
          } else if (route.name === 'Favorites') {
            label = "Favorites";
          }
          return <Text style={{ fontSize: 15, fontWeight: "bold", color: focused ? 'blue' : 'gray' }}>{label}</Text>;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'blue', // Aktif sekme rengi
        inactiveTintColor: 'gray', // Pasif sekme rengi
        showLabel: true, // Metin etiketlerini göster
        style: {
          backgroundColor: '#fff', // Tab bar rengini değiştirin
          borderTopWidth: 1,
          borderTopColor: '#ccc', // Kenarlığın rengini ayarlayın
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="SafePay" component={SafePayScreen} />
    </Tab.Navigator>
  );
};

export default App;
