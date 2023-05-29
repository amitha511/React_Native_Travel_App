import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "./App";
import { useContext } from "react";
import Tabs from "./navigation/tabs";
import { LoginStack } from "./navigation/LoginStack";
const API_KEY = "AIzaSyDCYasArcOwcALFhIj2szug5aD2PgUQu1E";

export async function authenticate(mode, email, password, setUserConnect) {
  const url = `http://192.168.1.70:4000/auth/${mode}`;

  await axios
    .post(url, {
      email: email,
      password: password,
      returnSecureToken: true,
    })
    .then(async (response) => {
      if (response.status === 200) {
        await AsyncStorage.setItem("success", "true");
        if (setUserConnect) setUserConnect(true); // Update context
      }
    })
    .catch(async (error) => {
      if (error.response && error.response.status === 400) {
        await AsyncStorage.setItem("success", "false");
        if (setUserConnect) setUserConnect(false); // Update context
      }
    });
}

export async function login(email, password, setUserConnect) {
  await authenticate("login", email, password, setUserConnect);
}

export async function register(email, password, setUserConnect) {
  await authenticate("register", email, password, setUserConnect);
}
