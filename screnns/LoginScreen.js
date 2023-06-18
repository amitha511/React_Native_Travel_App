import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { UserContext } from "../UserContext";
import { useNavigation } from "@react-navigation/native";
import { login } from "../api-calls";
import { TextInput, IconButton } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

function LoginScreen() {
  const navigation = useNavigation();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { userConnect, setUserConnect } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const validateEmail = (email) => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    let re = /[0-9]+/;
    return re.test(password);
  };

  const handleSubmit = async () => {
    if (email === "" || password === "") {
      setMessage("Fill in all fields");
    } else if (!validateEmail(email)) {
      setMessage("Only valid email addresses are accepted");
    } else if (password.length <= 5) {
      setMessage("Password should have more than 5 characters");
    } else if (!validatePassword(password)) {
      setMessage("Password should include numbers");
    } else {
      try {
        const response = await login(
          email,
          password,
          setUserConnect,
          setUserDetails
        );
        if (response === 200) {
          setEmail("");
          setPassword("");
          setMessage("");
          console.log(userDetails);
          console.log("login success user");
        }
      } catch (error) {
        console.log(error);
        setMessage("Login failed");
      }
    }
  };

  function clickRegisterHandler() {
    navigation.navigate("Register");
  }

  return (
    <ImageBackground
      source={require("../assets/BackgroundScreens/login.png")}
      resizeMode="cover"
      style={styles.image}
    >
      <Text style={styles.TitleOut}>Travel & Go </Text>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={styles.scroll}>
            <View style={styles.container}>
              <Text style={styles.title}>Welcome!</Text>

              <Text style={styles.errorMessage}>{message}</Text>
              <Text style={styles.nameInput}>Email</Text>

              <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  value={email}
                  variant="outlined"
                  leading={(props) => <Icon name="account" {...props} />}
                  placeholder="Enter your email"
                  placeholderTextColor="#003f5c"
                  onChangeText={setEmail}
                />
              </View>
              <Text style={styles.nameInput}>Password</Text>

              <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  variant="outlined"
                  placeholder="Enter your password"
                  placeholderTextColor="#003f5c"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <Button
                style={styles.loginBtn}
                title="Login"
                onPress={handleSubmit}
              />

              <View style={styles.separator} />
              <Text style={styles.text}>Need an account?</Text>

              <Button
                style={styles.loginBtn}
                title="Register now"
                onPress={clickRegisterHandler}
              />
              <Text style={styles.end}></Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  nameInput: {
    marginStart: 65,
    marginBottom: 7,
  },
  TitleOut: {
    marginTop: 130,
    fontSize: 50,
    textAlign: "center",
    fontWeight: "bold",
    color: "#ffff",
    borderRadius: 10,
    borderColor: "black",
    textShadowRadius: 10,
    textShadowColor: "black",
  },
  scroll: {
    marginTop: "7%",
  },

  image: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    color: "#ffff",
    borderRadius: 10,
    borderColor: "black",
    textShadowRadius: 5,
    textShadowColor: "black",

    // fontSize: 32,
    // color: "black",
    // textAlign: "center",
    // paddingBottom: "2%",
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    paddingBottom: "5%",
  },
  inputView: {
    marginStart: "15%",
    borderRadius: 30,
    height: 55,
    marginBottom: 20,
  },
  TextInput: {
    height: "50%",
    width: "80%",
    justifyContent: "center",
    flex: 1,
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
