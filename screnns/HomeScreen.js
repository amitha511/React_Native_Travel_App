import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Button,
  ScrollView,
} from "react-native";
import axios from "axios";
import { UserContext } from "../UserContext";
import Recommends from "../components/Recommends";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

function HomeScreen() {
  const { userConnect, setUserConnect } = useContext(UserContext);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [dataApi, setDataApi] = useState([]);
  const [dataApi1, setDataApi1] = useState([]);
  const [dataApi2, setDataApi2] = useState([]);

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
      } else {
        console.log("Location permission granted");
        getLocation();
      }
    };

    requestLocationPermission();
  }, []);

  useEffect(() => {
    NearByAPI("bar");
    NearByAPI("tourist_attraction");
    NearByAPI("restaurant");
  }, [latitude, longitude]);

  const getLocation = async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;
      setLatitude(latitude);
      setLongitude(longitude);
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
    } catch (error) {
      console.warn("Error getting location:", error);
    }
  };

  async function NearByAPI(type) {
    const userRadius = 100;
    const selectedOption = "car";

    if (selectedOption !== null) {
      let radius = 0;
      if (selectedOption === "walking") {
        radius = 2500;
      } else if (selectedOption === "public") {
        radius = 5000;
      } else if (selectedOption === "car") {
        radius = 10000;
      }

      try {
        const response = await axios.get(
          "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
          {
            params: {
              location: `${latitude},${longitude}`,
              radius: radius,
              type: type,
              key: "AIzaSyBfiFw1fsLgQZ9a3JB_XplnxgO5eeK9b2E",
            },
          }
        );

        const data = response.data.results.filter(
          (item) => item.rating !== undefined
        );

        switch (type) {
          case "bar":
            setDataApi(data);
            break;
          case "tourist_attraction":
            setDataApi1(data);
            break;
          case "restaurant":
            setDataApi2(data);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function logout() {
    try {
      await AsyncStorage.removeItem("email");
      console.log("local Data removed successfully.");
    } catch (error) {
      console.log("Error removing data:", error);
    }
    setUserConnect(false);
  }

  return (
    <ImageBackground
      source={require("../assets/BackgroundScreens/home.png")}
      resizeMode="cover"
      style={styles.image}
    >
      {/* <View>
        <Button title="Logout" onPress={logout}></Button>
      </View> */}
      <Text style={styles.TitleOut}>Explore Your Favorite journey</Text>

      <ScrollView style={styles.scroll}>
        <View style={styles.recommends}>
          <Text style={styles.text}>Bars Near You:</Text>
          <Recommends dataApi={dataApi} />
        </View>

        <View style={styles.recommends}>
          <Text style={styles.text}>Attractions Near You:</Text>
          <Recommends dataApi={dataApi1} />
        </View>

        <View key={"3"} style={styles.recommends}>
          <Text style={styles.text}>Restaurants Near You:</Text>
          <Recommends dataApi={dataApi2} />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: "black",
    borderRadius: 10,
    borderColor: "black",
  },
  TitleOut: {
    marginTop: 140,
    fontSize: 28,
    marginStart: 10,
    fontWeight: "bold",
    color: "#ffff",
    borderRadius: 10,
    borderColor: "black",
    textShadowRadius: 10,
    textShadowColor: "black",
  },

  scroll: {
    marginTop: "4.5%",
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
