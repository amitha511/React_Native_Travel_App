import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import { UserContext } from "../App";
import axios from "axios";
import { ip } from "../App";
const Profile = () => {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [name, setName] = useState("Name");
  const [editName, setEditName] = useState(false);
  const [lastName, setLastName] = useState("Last Name");
  const [editLastName, setEditLastName] = useState(false);
  const [age, setAge] = useState(0);
  const [editAge, setEditAge] = useState(false);
  const [email, setEmail] = useState("@example1.com");
  const [editEmail, setEditEmail] = useState(false);
  const [password, setPassword] = useState("*******");
  const [trips, setTrips] = useState(["Trip 1", "Trip 2", "Trip 3"]);
  const [id, setId] = useState(null);
  useEffect(() => {
    if (userDetails !== undefined) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://${ip}:4000/user/Details/${userDetails}`
          );
          console.log(response.data[0]._id);
          setId(response.data[0]._id);
          setEmail(response.data[0].email);
          setName(response.data[0].name);
          setLastName(response.data[0].lastname);
          setAge(response.data[0].age);
        } catch (error) {
          console.error(`Error${error} !`);
        }
      };
      fetchData();
    }
  }, [userDetails]);

  function logout() {
    setUserConnect(false);
  }

  const editField = (field) => {
    switch (field) {
      case "name":
        setEditName(true);
        break;
      case "lastName":
        setEditLastName(true);
        break;
      case "age":
        setEditAge(true);
        break;
      case "email":
        setEditEmail(true);
        break;
      default:
        break;
    }
  };

  const saveField = async (field) => {
    let updatedValue;
    switch (field) {
      case "name":
        updatedValue = name;
        break;
      case "lastName":
        updatedValue = lastName;
        break;
      case "age":
        updatedValue = age;
        break;
      case "email":
        updatedValue = email;
        break;
      default:
        break;
    }

    try {
      const response = await axios.put(`http://${ip}:4000/user/update${id}`, {
        field,
        value: updatedValue,
        userDetails, // Assuming userDetails is the user identifier
      });
      console.log(response.data);
    } catch (error) {
      console.error(`Error updating user details: ${error}`);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/background/register.png")}
      resizeMode="cover"
      style={styles.image}
    >
      <View style={styles.container}>
        <View style={styles.profileInfo}>
          <Text>Name:</Text>
          {editName ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(value) => setName(value)}
            />
          ) : (
            <Text>{name}</Text>
          )}
          {!editName && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => editField("name")}
            >
              <Text>Edit</Text>
            </TouchableOpacity>
          )}
          {editName && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => saveField("name")}
            >
              <Text>Save</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.profileInfo}>
          <Text>Last Name:</Text>
          {editLastName ? (
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={(value) => setLastName(value)}
            />
          ) : (
            <Text>{lastName}</Text>
          )}
          {!editLastName && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => editField("lastName")}
            >
              <Text>Edit</Text>
            </TouchableOpacity>
          )}
          {editLastName && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => saveField("lastName")}
            >
              <Text>Save</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.profileInfo}>
          <Text>Age:</Text>
          {editAge ? (
            <TextInput
              style={styles.input}
              value={age.toString()}
              onChangeText={(value) => setAge(parseInt(value))}
            />
          ) : (
            <Text>{age}</Text>
          )}
          {!editAge && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => editField("age")}
            >
              <Text>Edit</Text>
            </TouchableOpacity>
          )}
          {editAge && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => saveField("age")}
            >
              <Text>Save</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.profileInfo}>
          <Text>Email:</Text>
          {editEmail ? (
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(value) => setEmail(value)}
            />
          ) : (
            <Text>{email}</Text>
          )}
          {!editEmail && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => editField("email")}
            >
              <Text>Edit</Text>
            </TouchableOpacity>
          )}
          {editEmail && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => saveField("email")}
            >
              <Text>Save</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.profileInfo}>
          <Text>Password:</Text>
          <TextInput
            style={styles.input}
            value={password}
            editable={false}
            secureTextEntry
          />
        </View>

        <View>
          <Button title="Logout" onPress={logout} />
        </View>

        <ScrollView style={styles.scroll} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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
  button: {
    backgroundColor: "mediumpurple",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 10,
    borderRadius: 5,
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
  scroll: {
    marginTop: "50%",
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
