import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
  TouchableOpacity,
} from "react-native";
import { UserContext } from "../UserContext";
import { register } from "../api-calls";
import { TextInput } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Picker } from "@react-native-picker/picker";
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
      source={require("../assets/BackgroundScreens/register.png")}
      resizeMode="cover"
      style={styles.image}
    >
      <Text style={styles.TitleOut}>Register</Text>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={styles.scroll}>
            <View style={styles.container}>
              <Text style={styles.errorMessage}>{message}</Text>

              <View style={styles.rowInput}>
                <Text style={styles.box}>First Name:</Text>
                <Text style={{ marginStart: 130 }}>Last Name:</Text>
              </View>
              <View style={styles.rowInput}>
                <View style={styles.inputViewName}>
                  <TextInput
                    style={styles.TextInput}
                    value={name}
                    variant="outlined"
                    placeholder="First Name"
                    placeholderTextColor="#003f5c"
                    onChangeText={setName}
                  />
                </View>

                <View style={styles.inputViewName}>
                  <TextInput
                    style={styles.TextInput}
                    value={lastname}
                    variant="outlined"
                    placeholder="Last Name"
                    placeholderTextColor="#003f5c"
                    onChangeText={setLastName}
                  />
                </View>
              </View>

              <Text style={styles.box}>Email:</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  value={email}
                  variant="outlined"
                  placeholder="Email"
                  placeholderTextColor="#003f5c"
                  n
                  onChangeText={setEmail}
                />
              </View>
              <View style={styles.rowInput}>
                <Text style={styles.box}>Password:</Text>
                <Text style={{ marginStart: 140 }}>Age:</Text>
              </View>
              <View style={styles.rowInput}>
                <View style={styles.inputViewName}>
                  <TextInput
                    style={styles.TextInput}
                    value={password}
                    variant="outlined"
                    secureTextEntry={true}
                    placeholder="Password"
                    placeholderTextColor="#003f5c"
                    onChangeText={setPassword}
                  />
                </View>
                <View
                  style={{
                    borderRadius: 30,
                    width: "20%",
                    height: 55,
                    marginBottom: 20,
                  }}
                >
                  <TextInput
                    keyboardType="numeric"
                    style={styles.TextInput}
                    value={age}
                    variant="outlined"
                    placeholder="-"
                    placeholderTextColor="#003f5c"
                    onChangeText={setAge}
                  />
                </View>

                <Picker
                  placeholder="dd"
                  numberOfLines={1}
                  style={styles.selector}
                  selectedValue={gender}
                  onValueChange={(itemValue) => setGender(itemValue)}
                >
                  <Picker.Item label="Gender" value="Gender" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Male" value="Male" />
                </Picker>
              </View>
              <View style={styles.signupBtn}>
                <Button title="Sign up" onPress={handleSubmit} />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

export default RegisterScreen;

const styles = StyleSheet.create({
  signupBtn: {
    fontSize: 40,
    marginTop: 70,
  },
  selector: {
    justifyContent: "space-evenly",
    width: 150,
    height: 50,
    marginRight: 20,
  },
  rowInput: {
    flexDirection: "row",
  },
  TitleOut: {
    textAlign: "center",
    marginTop: 170,
    fontSize: 50,
    marginStart: 10,
    fontWeight: "bold",
    color: "#ffff",
    borderRadius: 10,
    borderColor: "black",
    textShadowRadius: 10,
    textShadowColor: "black",
  },
  scroll: {
    marginTop: "2.5%",
  },
  container: {
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
    start: 5,
  },
  inputView: {
    marginStart: 2,
    borderRadius: 30,
    width: "70%",
    height: 55,
    marginBottom: 20,
  },
  inputViewName: {
    marginStart: 2,
    marginEnd: 2,
    borderRadius: 30,
    width: "48%",
    height: 55,
    marginBottom: 20,
  },
  TextInput: {
    fontSize: 12,
    flex: 1,
    padding: 5,
    marginLeft: 2,
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
