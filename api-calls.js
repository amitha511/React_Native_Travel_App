import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { UserContext } from "./App";
import { useContext } from "react";
import { useState, useEffect } from "react";

const API_KEY = "AIzaSyDCYasArcOwcALFhIj2szug5aD2PgUQu1E";

async function authenticate(mode, email, password) {
  //const [userIsConnected, setUserIsConnected] = useState(false);
  const url = `http://192.168.1.56:4000/auth/${mode}`;
  const response = await axios
    .post(url, {
      email: email,
      password: password,
      returnSecureToken: true,
    })
    .then(async (response) => {
      // handle success response
      console.log(response);
      // console.log(response.data.newUser.email)
      if (response.status === 200) {
        console.log("test1");
        await AsyncStorage.setItem("success", "true");
      }
    })
    .catch(async (error) => {
      if (error.response && error.response.status === 400) {
        await AsyncStorage.setItem("success", "false");
      }
    });
}

export async function login(email, password) {
  await authenticate("login", email, password);
}

export async function register(email, password) {
  await authenticate("register", email, password);
}
