import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./screnns/LoginScreen";
import React, { createContext, useState, useEffect } from "react";
import Tabs from "./navigation/tabs";
import { LoginStack } from "./navigation/LoginStack";
const Stack = createStackNavigator();
export const UserContext = createContext();
export const ip = "192.168.1.58";
export default function App() {
  const [userConnect, setUserConnect] = useState(false);
  const [userDetails, setUserDetails] = useState();

  useEffect(() => {
    (async () => {
      const userIsConnected = await AsyncStorage.getItem("success");
      setUserConnect(userIsConnected === "true" ? true : false);
    })();
  }, []);

  return (
    <UserContext.Provider
      value={{ userConnect, setUserConnect, userDetails, setUserDetails }}
    >
      <NavigationContainer>
        {userConnect ? <Tabs /> : <LoginStack name="Login" />}
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
