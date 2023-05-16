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
function RegisterScreen({ navigation }) {
  const { userConnect, setUserConnect } = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // const handleLogin = () => {
  //   setUserConnect(email);
  // };

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
      // setMessage("");
      // setPassword("");
      // setEmail("");
      // setUserConnect(email);
      // await register(email, password)
      await register(email, password);
      try {
        const success = await AsyncStorage.getItem("success");
        console.log(success);
        if (success == "true") {
          console.log("test2");
          navigation.navigate("Home");
        } else {
          //navigation.navigate("Login");
          console.log("test3");
          setMessage("Register failed");
        }
      } catch (error) {
        console.log(error);
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
              {/*   
              <Text style={styles.box}>Full name:</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  value={name}
                  placeholderTextColor="#003f5c"
                  onChangeText={setName}
                />
              </View> */}

              <Text style={styles.box}>Email:</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  value={email}
                  placeholderTextColor="#003f5c"
                  onChangeText={setEmail}
                />
              </View>

              <Text style={styles.box}>Password:</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  value={password}
                  secureTextEntry={true}
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

//-----------------------------------------
// import React, { useState, useContext } from "react";
// import { StyleSheet, Text, View, TextInput, Button, Image } from "react-native";
// import { UserContext } from "../App";
// import { register } from "../api-calls";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// function SignupScreen({ navigation }) {
//   // const { userConnect, setUserConnect } = useContext(UserContext);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   // const handleLogin = () => {
//   //   setUserConnect(email);
//   // };

//   const validateEmail = (email) => {
//     var re =
//       /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(email);
//   };

//   const validatePassword = (password) => {
//     let re = /[0-9]+/;
//     return re.test(password);
//   };

//   const handleSubmit = async () => {
//     if (email === "" || password === "") {
//       setMessage("Fill in all fields");
//     } else if (!validateEmail(email)) {
//       setMessage("Only valid email addresses are accepted");
//     } else if (password.length <= 5) {
//       setMessage("Password should have more than 5 characters");
//     } else if (!validatePassword(password)) {
//       setMessage("Password should include numbers");
//     } else {
//       // setMessage("");
//       // setPassword("");
//       // setEmail("");
//       // setUserConnect(email);
//       // await register(email, password)
//       await register(email, password);
//       try {
//         const success = await AsyncStorage.getItem("success");
//         console.log(success);
//         if (success == "true") {
//           console.log("test2");
//           navigation.navigate("Home");
//         } else {
//           //navigation.navigate("Login");
//           console.log("test3");
//           setMessage("Register failed");
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Image style={styles.image} source={require("../assets/favicon.png")} />
//       {/* <Text style={form.message}>{message}</Text> */}
//       <View style={styles.inputView}>
//         <TextInput
//           style={styles.TextInput}
//           value={email}
//           placeholder="Enter your email"
//           placeholderTextColor="#003f5c"
//           onChangeText={setEmail}
//         />
//       </View>
//       <View style={styles.inputView}>
//         <TextInput
//           style={styles.TextInput}
//           placeholder="Enter your password"
//           placeholderTextColor="#003f5c"
//           secureTextEntry={true}
//           value={password}
//           onChangeText={setPassword}
//         />
//       </View>
//       <View style={styles.inputView}>
//         <TextInput
//           style={styles.TextInput}
//           placeholder="msg test"
//           placeholderTextColor="#003f5c"
//           value={message}
//           onChangeText={setMessage}
//         />
//       </View>

//       <Button style={styles.signupBtn} title="Sign up" onPress={handleSubmit} />
//     </View>
//   );
// }

// export default SignupScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   image: {
//     marginBottom: 40,
//     width: 300,
//     height: 210,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: "bold",
//     color: "black",
//     textAlign: "center",
//     // margin: 100,
//   },
//   inputView: {
//     alignItems: "center",
//     backgroundColor: "#F0EDED",
//     borderRadius: 30,
//     width: "70%",
//     height: 45,
//     marginBottom: 20,
//     alignItems: "center",
//   },
//   TextInput: {
//     height: 50,
//     flex: 1,
//     padding: 10,
//     marginLeft: 20,
//   },
//   signupBtn: {
//     width: "80%",
//     borderRadius: 25,
//     height: 50,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 40,
//     backgroundColor: "#FF1493",
//   },
// });
