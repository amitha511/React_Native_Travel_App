import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screnns/LoginScreen";
import React, { createContext, useState } from "react";
import HomeScreen from "./screnns/HomeScreen";
import DefaultPage from "./screnns/DefaultPage";

const Stack = createStackNavigator();
export const UserContext = createContext();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <View style={{ flexDirection: "row" }}>
                <Button
                  title="Go to Login"
                  onPress={() => navigation.navigate("Login")}
                />
                <Button
                  title="Go to DefaultPage"
                  onPress={() => navigation.navigate("Default")}
                />
              </View>
            ),
          })}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Default" component={DefaultPage} />
        {/* Add the DefaultPage screen */}
      </Stack.Navigator>
    </NavigationContainer>
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
