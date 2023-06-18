import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  // TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../UserContext";
import { TextInput, IconButton } from "@react-native-material/core";
import axios from "axios";
import { ip } from "@env";

//const ip = process.env.REACT_APP_IP;
const Profile = () => {
  const { userConnect, setUserConnect } = useContext(UserContext);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [name, setName] = useState("Name");
  const [lastName, setLastName] = useState("Last Name");
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState("@example1.com");
  const [id, setId] = useState(null);
  const [onEdit, setonEdit] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (userDetails !== undefined) {
        try {
          const response = await axios.get(
            `http://${ip}:4000/user/Details/${userDetails}`
          );
          setId(response.data[0]._id);
          setEmail(response.data[0].email);
          setName(response.data[0].name);
          setLastName(response.data[0].lastname);
          setAge(response.data[0].age);
        } catch (error) {
          console.error(`Error${error} !`);
        }
      }
    }

    fetchData();
  }, [userDetails, onEdit]);

  async function logout() {
    try {
      await AsyncStorage.removeItem("email");
      console.log("local Data removed successfully.");
    } catch (error) {
      console.log("Error removing data:", error);
    }
    setUserConnect(false);
  }

  const saveField = async () => {
    try {
      const response = await axios.put(`http://${ip}:4000/user/update/${id}`, {
        firstName: name,
        lastName: lastName,
        age: age,
      });
      setonEdit(false);
      console.log(response.data);
    } catch (error) {
      console.error(`Error updating user details: ${error}`);
    }
  };

  if (onEdit == true) {
    return (
      <ImageBackground
        source={require("../assets/BackgroundScreens/profile.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <Text style={styles.TitleOut}>Your Details</Text>

        <ScrollView style={styles.scroll}>
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
                placeholder={name}
                placeholderTextColor="#003f5c"
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputViewName}>
              <TextInput
                style={styles.TextInput}
                value={lastName}
                variant="outlined"
                placeholder={lastName}
                placeholderTextColor="#003f5c"
                onChangeText={setLastName}
              />
            </View>
          </View>
          <View style={styles.rowInput}>
            <Text style={styles.box}>Email:</Text>
            <Text style={{ marginStart: 255 }}>Age:</Text>
          </View>
          <View style={styles.rowInput}>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                value={email}
                helperText="Can't Change Email"
                editable={false}
                variant="outlined"
                placeholder="Email"
                placeholderTextColor="#003f5c"
                n
                onChangeText={setEmail}
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
          </View>
          <View style={styles.rowInput}>
            <TouchableOpacity style={styles.button} onPress={saveField}>
              <Text>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setonEdit((onEdit) => !onEdit)}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
  if (onEdit == false) {
    return (
      <ImageBackground
        source={require("../assets/BackgroundScreens/profile.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.rowInput}>
          <Text style={styles.TitleOut}>Your Details</Text>
          <TouchableOpacity
            style={styles.edit}
            onPress={() => setonEdit((onEdit) => !onEdit)}
          >
            <Text>Edit</Text>

            <Image
              source={require("../assets/markIcon/edit.png")}
              style={{ marginTop: 2, width: 30, height: 30 }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logout} onPress={logout}>
            <Text>Logout</Text>

            <Image
              source={require("../assets/markIcon/logout.png")}
              style={{ marginTop: 2, width: 30, height: 30 }}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll}>
          <View
            style={{
              start: "30%",
            }}
          >
            <View style={styles.rowInput}>
              <Text style={styles.box}>Full Name:</Text>
            </View>
            <View style={styles.rowInput}>
              <Text style={{ fontSize: 18, padding: 5, marginLeft: 20 }}>
                {name} {lastName}
              </Text>
            </View>
            <Text style={styles.box}>Age:</Text>
            <Text style={{ fontSize: 18, padding: 5, marginLeft: 20 }}>
              {age}
            </Text>
            <Text style={styles.box}>Email:</Text>
            <Text style={{ fontSize: 18, padding: 5, marginLeft: 20 }}>
              {email}
            </Text>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
};

const styles = StyleSheet.create({
  logout: {
    backgroundColor: "#ffffff",
    justifyContent: "center",
    marginTop: 90,
    fontSize: 28,
    width: 80,
    height: 60,
    fontWeight: "bold",
    marginStart: 10,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    alignItems: "center",
  },
  edit: {
    backgroundColor: "#ffffff",
    justifyContent: "center",
    marginTop: 90,
    fontSize: 28,
    width: 80,
    height: 60,
    fontWeight: "bold",
    marginStart: 50,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    alignItems: "center",
  },
  button: {
    width: 100,
    height: 50,
    marginTop: 30,
    marginStart: "5%",
    alignItems: "center",
    borderRadius: 20,
    justifyContent: "center",
    color: "#ffff",
    backgroundColor: "#E1E0FB",
  },
  rowInput: {
    flexDirection: "row",
  },
  box: {
    marginStart: 5,
    marginTop: 10,
  },
  TitleOut: {
    marginTop: 120,
    fontSize: 28,
    marginStart: 10,
    fontWeight: "bold",
    color: "#ffff",
    borderRadius: 10,
    borderColor: "black",
    textShadowRadius: 10,
    textShadowColor: "black",
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
  scroll: {
    marginTop: "2.5%",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    borderWidth: 1,
    padding: 10,
  },

  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tripContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  tripText: {
    flex: 1,
  },

  image: {
    flex: 1,
    justifyContent: "center",
  },
  recommends: {
    margin: 10,
  },
});

export default Profile;
