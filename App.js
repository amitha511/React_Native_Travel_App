import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { createContext, useState, useEffect } from "react";
import Tabs from "./navigation/tabs";
import { LoginStack } from "./navigation/LoginStack";

export const UserContext = createContext();
export const ip = "10.0.0.16";

export default function App() {
  const [userConnect, setUserConnect] = useState(false);
  const [userDetails, setUserDetails] = useState();

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
