import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Button,
  ScrollView,
} from "react-native";
import { UserContext } from "../App";

//Profile

function Profile() {
  const { userConnect, setUserConnect } = useContext(UserContext);

  function logout() {
    setUserConnect(false);
  }
  return (
    <ImageBackground
      source={require("../assets/background/register.png")}
      resizeMode="cover"
      style={styles.image}
    >
      <View>
        <Button title="Logout" onPress={logout}></Button>
      </View>
      <ScrollView style={styles.scroll}></ScrollView>
    </ImageBackground>
  );
}

export default Profile;

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
  recommends: {
    margin: 10,
  },
});
