import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import React, { createContext, useState, useEffect } from "react";
import Tabs from "./navigation/tabs";
import { LoginStack } from "./navigation/LoginStack";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();
export const ip = "10.0.0.16";

export default function App() {
  const [userConnect, setUserConnect] = useState(false);
  const [userDetails, setUserDetails] = useState();

  useEffect(async () => {
    try {
      const value = await AsyncStorage.getItem("email");
      console.log(value !== null);
      if (value !== null) {
        setUserConnect(true);
        setUserDetails(value);
        console.log("user connect");
        console.log(value);
      } else console.log(`user not connect`);
    } catch (error) {
      console.log("error with AsyncStorage", error);
    }
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
