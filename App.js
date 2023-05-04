import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screnns/LoginScreen";
import React, { createContext, useState } from "react";
import HomeScreen from "./screnns/HomeScreen";

const Stack = createStackNavigator();
export const UserContext = createContext();

export default function App() {
  const [userConnect, setUserConnect] = useState(null);

  let content = <Stack.Screen name="home" component={HomeScreen} />;
  if (userConnect != null) {
    content = <Stack.Screen name="home" component={HomeScreen} />;
  } else {
    content = <Stack.Screen name="Login" component={LoginScreen} />;
  }

  return (
    <UserContext.Provider value={{ userConnect, setUserConnect }}>
      <NavigationContainer>
        <Stack.Navigator>{content}</Stack.Navigator>
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
