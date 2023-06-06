import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserConnect } from "./App";
import { userDetails } from "./App";
import { setUserDetails } from "./App";
import Tabs from "./navigation/tabs";
import { LoginStack } from "./navigation/LoginStack";
const API_KEY = "AIzaSyDOI5owICVszKfksbNqLRRwHFh-RFQbeV0";

export async function authenticateLogin(
  mode,
  email,
  password,
  setUserConnect,
  setUserDetails
) {
  const url = `http://10.0.0.16:4000/auth/${mode}`;

  await axios
    .post(url, {
      email: email,
      password: password,
      returnSecureToken: true,
    })
    .then(async (response) => {
      if (response.status === 200) {
        console.log("test200");
        setUserConnect(true);
        setUserDetails(email);
      }
    })
    .catch(async (error) => {
      if (error.response && error.response.status === 400) {
        console.log("test400");
        if (setUserConnect) setUserConnect(false); // Update context
      }
    });
}

export async function authenticateRegister(
  mode,
  email,
  password,
  name,
  lastname,
  gender,
  age,
  setUserConnect,
  setUserDetails
) {
  const url = `http://10.0.0.16:4000/auth/${mode}`;

  await axios
    .post(url, {
      email: email,
      password: password,
      name: name,
      lastname: lastname,
      gender: gender,
      age: age,
      returnSecureToken: true,
    })
    .then(async (response) => {
      if (response.status === 200) {
        await AsyncStorage.setItem("successRegister", "true");
        setUserConnect(true);
        setUserDetails(email);
      }
    })
    .catch(async (error) => {
      if (error.response && error.response.status === 400) {
        await AsyncStorage.setItem("successRegister", "false");
        if (setUserConnect) setUserConnect(false); // Update context
      }
    });
}

export async function login(email, password, setUserConnect, setUserDetails) {
  await authenticateLogin(
    "login",
    email,
    password,
    setUserConnect,
    setUserDetails
  );
}

export async function register(
  email,
  password,
  name,
  lastname,
  gender,
  age,
  setUserConnect,
  setUserDetails
) {
  await authenticateRegister(
    "register",
    email,
    password,
    name,
    lastname,
    gender,
    age,
    setUserConnect,
    setUserDetails
  );
}
