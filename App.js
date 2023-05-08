import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screnns/LoginScreen";
import React, { createContext, useState } from "react";
import HomeScreen from "./screnns/HomeScreen";
import Tabs from "./navigation/tabs";

const Stack = createStackNavigator();
export const UserContext = createContext();

export default function App() {
  const [userConnect, setUserConnect] = useState(null);

  return (
    <UserContext.Provider value={{ userConnect, setUserConnect }}>
      <NavigationContainer>
        <Tabs />
      </NavigationContainer>
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
