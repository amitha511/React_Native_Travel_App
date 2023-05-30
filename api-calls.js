import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserConnect } from "./App";
import { userDetails } from "./App";
import Tabs from "./navigation/tabs";
import { LoginStack } from "./navigation/LoginStack";
const API_KEY = "AIzaSyDCYasArcOwcALFhIj2szug5aD2PgUQu1E";

export async function authenticate(
  mode,
  email,
  password,
  setUserConnect,
  setUserDetails
) {
  const url = `http://192.168.1.54:4000/auth/${mode}`;

  await axios
    .post(url, {
      email: email,
      password: password,
      returnSecureToken: true,
    })
    .then(async (response) => {
      if (response.status === 200) {
        await AsyncStorage.setItem("success", "true");
        setUserDetails({
          accessToken: response.data.accessToken,
        });

        setUserConnect(true);
      }
    })
    .catch(async (error) => {
      if (error.response && error.response.status === 400) {
        await AsyncStorage.setItem("success", "false");
        if (setUserConnect) setUserConnect(false); // Update context
      }
    });
}

export async function login(email, password, setUserConnect, setUserDetails) {
  await authenticate("login", email, password, setUserConnect, setUserDetails);
}

export async function register(
  email,
  password,
  setUserConnect,
  setUserDetails
) {
  await authenticate(
    "register",
    email,
    password,
    setUserConnect,
    setUserDetails
  );
}
