import React, { useContext } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView,
} from "react-native";
import Recommends from "../components/Recommends";
import { UserContext } from "../App";

function HomeScreen() {
  const { userConnect, setUserConnect } = useContext(UserContext);

  const handleMenuOptionType = (option) => {
    setSelectedType(option);
    console.log("selectedOption: " + selectedType);
  };

  return (
    <ImageBackground
      source={require("../assets/background/airBallon.png")}
      resizeMode="cover"
      style={styles.image}
    >
      <ScrollView style={styles.scroll}>
        <View style={styles.recommends}>
          <Text style={styles.text}>Hotels:</Text>
          <Recommends onValueSelect={handleMenuOptionType} />
        </View>

        <View style={styles.recommends}>
          <Text style={styles.text}>Attractions:</Text>
          <Recommends onValueSelect={handleMenuOptionType} />
        </View>

        <View style={styles.recommends}>
          <Text style={styles.text}>Restaurants:</Text>
          <Recommends onValueSelect={handleMenuOptionType} />
        </View>
      </ScrollView>
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
  recommends: {
    margin: 10,
  },
});
