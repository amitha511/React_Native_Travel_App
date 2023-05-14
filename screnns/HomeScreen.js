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
      source={require("../assets/background/homeBack.png")}
      resizeMode="cover"
      style={styles.image}
    >
      <View style={styles.container}>
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
      </View>
    </ImageBackground>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  scroll: {
    marginTop: "20%",
  },
  container: {
    paddingTop: "-30%",
    flex: 1,
    width: "100%",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  recommends: {
    margin: 10,
  },
});
