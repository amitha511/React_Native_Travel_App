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

const Profile = () => {
  const [name, setName] = useState("Name");
  const [email, setEmail] = useState("@example1.com");
  const [password, setPassword] = useState("*******");
  const [trips, setTrips] = useState(["Trip 1", "Trip 2", "Trip 3"]);

  const { userConnect, setUserConnect } = useContext(UserContext);

  function logout() {
    setUserConnect(false);
  }

  const editField = (field) => {
    // Implement your logic to enable editing the field
  };

  const editTrip = (index) => {
    // Implement your logic to enable editing the trip
  };

  const deleteTrip = (index) => {
    // Implement your logic to delete the trip
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
          <TextInput style={styles.input} value={name} editable={false} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => editField("name")}
          >
            <Text>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <Text>Email:</Text>
          <TextInput style={styles.input} value={email} editable={false} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => editField("email")}
          >
            <Text>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <Text>Password:</Text>
          <TextInput
            style={styles.input}
            value={password}
            editable={false}
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => editField("password")}
          >
            <Text>Edit</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.heading}>Trips:</Text>
        {trips.map((trip, index) => (
          <View key={index} style={styles.tripContainer}>
            <Text style={styles.tripText}>{trip}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => editTrip(index)}
            >
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => deleteTrip(index)}
            >
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
        <View>
          <Button title="Logout" onPress={logout}></Button>
        </View>
        <ScrollView style={styles.scroll}></ScrollView>
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
