import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
} from "react-native";
import { UserContext } from "../App";
import { register } from "../api-calls";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { setGestureState } from "react-native-reanimated/lib/reanimated2/NativeMethods";
function RegisterScreen({ navigation }) {
  const { userConnect, setUserConnect } = useContext(UserContext);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
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

  const validateName = (Name) => {
    let nameRegex = /^[A-Za-z]+$/;
    return nameRegex.test(name);
  };

  const validateLastName = (lastname) => {
    let lastnameRegex = /^[A-Za-z]+$/;
    return lastnameRegex.test(lastname);
  };

  const validateAge = (age) => {
    let re = /[0-9]+/;
    return re.test(re);
  };

  const validateGender = (gender) => {
    var validGenders = ["Male", "Female", "male", "female"];
    if (validGenders.includes(gender)) {
      return gender;
    } else {
      return false;
    }
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
    } else if (!validateName(name)) {
      setMessage("Name should include only words");
    } else if (!validateLastName(lastname)) {
      setMessage("Last Name should include only words");
    } else if (!validateAge(age)) {
      setMessage("Age should be 18-99");
    } else if (!validateGender(gender)) {
      setMessage("Gender should be Male or Female");
    } else {
      try {
        const res = await register(
          email,
          password,
          name,
          lastname,
          gender,
          age,
          setUserConnect,
          setUserDetails
        );
        if (res == 200) {
          console.log("test2");
          setGender("");
          setAge("");
          setName("");
          setLastName("");
          setEmail("");
          setPassword("");
          setMessage("");
          setUserConnect(true);
          setUserDetails(email);
          navigation.navigate("Home");
        } else {
          setMessage("Register failed");
        }
      } catch (error) {
        console.log(error);
        setMessage("Register failed, this email already exists");
      }
    }
  };

  return (
    <ImageBackground
      source={require("../assets/background/register.png")}
      resizeMode="cover"
      style={styles.image}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={styles.scroll}>
            <View style={styles.container}>
              <Text style={styles.title}>Register</Text>
              <Text style={styles.errorMessage}>{message}</Text>

              <Text style={styles.box}>Email:</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  value={email}
                  placeholder="Enter Your Email"
                  placeholderTextColor="#003f5c"
                  n
                  onChangeText={setEmail}
                />
              </View>

              <Text style={styles.box}>Name:</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  value={name}
                  placeholder="Enter Your Name"
                  placeholderTextColor="#003f5c"
                  onChangeText={setName}
                />
              </View>

              <Text style={styles.box}>Last Name:</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  value={lastname}
                  placeholder="Enter Your Last Name"
                  placeholderTextColor="#003f5c"
                  onChangeText={setLastName}
                />
              </View>

              <Text style={styles.box}>Age:</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  value={age}
                  placeholder="Enter You Age"
                  placeholderTextColor="#003f5c"
                  onChangeText={setAge}
                />
              </View>

              <Text style={styles.box}>Gender:</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  value={gender}
                  placeholder="Enter Your Gender"
                  placeholderTextColor="#003f5c"
                  onChangeText={setGender}
                />
              </View>

              <Text style={styles.box}>Password:</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  value={password}
                  secureTextEntry={true}
                  placeholder="Enter Your Password"
                  placeholderTextColor="#003f5c"
                  onChangeText={setPassword}
                />
              </View>

              <Button
                style={styles.signupBtn}
                title="Sign up"
                onPress={handleSubmit}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

export default RegisterScreen;

const styles = StyleSheet.create({
  scroll: {
    marginTop: "50%",
  },
  container: {
    paddingTop: "-30%",
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    color: "black",
    textAlign: "center",
    paddingBottom: "5%",
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    paddingBottom: "5%",
  },
  box: {
    start: "15%",
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
});
