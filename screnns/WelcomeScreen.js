import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Image,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { UserContext } from "../UserContext";
import { useNavigation } from "@react-navigation/native";
import { login } from "../api-calls";

function WelcomeScreen() {
  const navigation = useNavigation();

  function start() {
    navigation.navigate("Login");
  }

  return (
    <ImageBackground
      source={require("../assets/BackgroundScreens/welcom.png")}
      resizeMode="cover"
      style={styles.image}
    >
      <TouchableOpacity style={styles.button} onPress={start}>
        <Text>Get Started</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 50,
    marginStart: "25%",
    alignItems: "center",
    borderRadius: 20,
    justifyContent: "center",
    marginTop: "140%",
    fontSize: 90,
    color: "#ffff",
    backgroundColor: "#E1E0FB",
  },
  container: {
    paddingTop: "15%",
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    color: "black",
    textAlign: "center",
    paddingBottom: "5%",
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    paddingBottom: "5%",
  },
  inputView: {
    alignItems: "center",
    marginStart: "15%",
    backgroundColor: "#F0EDED",
    borderRadius: 30,
    width: "70%",
    height: 55,
    marginBottom: 20,
  },
  TextInput: {
    height: "50%",
    width: "70%",
    flex: 1,
    padding: "2%",
    marginLeft: 20,
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FF1493",
  },
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 30,
    margin: 30,
  },
  text: {
    textAlign: "center",
    color: "#858282",
  },
  end: {
    paddingBottom: "35%",
  },
});
