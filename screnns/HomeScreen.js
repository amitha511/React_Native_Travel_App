import React, { useContext } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView,
} from "react-native";
import { UserContext } from "../App";

function HomeScreen() {
  const { userConnect, setUserConnect } = useContext(UserContext);
  return (
    <ImageBackground
      source={require("../assets/background/vecation.png")}
      resizeMode="cover"
      style={styles.image}
    >
      <ScrollView style={styles.scroll}></ScrollView>
    </ImageBackground>
  );
}

export default HomeScreen;

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
});
