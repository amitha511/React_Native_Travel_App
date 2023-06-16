import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
  Text,
  Image,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { ip } from "@env";
function ChangeMobility() {
  const route = useRoute();
  const navigation = useNavigation();
  const { location, mobility, id, dates, type, userDetails } = route.params;
  //----------------------------------
  async function NearByAPI(location, userRadius, newMobility) {
    deleteAttraction();
    try {
      const requests = type.map((attraction) => {
        return axios.get(
          "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
          {
            params: {
              location: location,
              radius: userRadius,
              type: attraction,
              key: "AIzaSyBfiFw1fsLgQZ9a3JB_XplnxgO5eeK9b2E",
            },
          }
        );
      });

      const responses = await Promise.all(requests);
      const data = responses.map((response) => response.data.results);
      const allData = data.flat();
      const filteredDataList = allData.filter(
        (item) => item.rating !== undefined
      );
      startingAttraction(filteredDataList, newMobility);
      navigation.navigate("Schedule");
    } catch (error) {
      console.error(error);
    }
  }
  //-----------------------------------------------------------------
  async function startingAttraction(filteredDataList, newMobility) {
    const mapCalender = new Map(); //map => (numday , [attractionArray])
    let daysKeyArrays = [];
    let maxItem; //item with max rating
    let numDays = dates.length; // number days

    for (let i = 0; i < numDays + 1; i++) {
      for (let j = 0; j < 3; j++) {
        maxItem = findMaxItem(filteredDataList);
        //j = num of attraction in a day
        let objItem = Object.values(maxItem)[2]; //get the obj
        daysKeyArrays.push(objItem);
        const updatedDataList = filteredDataList.filter(
          (item) => item.place_id !== objItem.place_id
        );
        filteredDataList = updatedDataList;
      }
      mapCalender.set(i, daysKeyArrays);
      daysKeyArrays = [];
    }

    //print the map to the terminal:

    for (let i = 0; i < dates.length + 1; i++) {
      console.log("day " + i + ":");
      for (let j = 0; j < 3; j++) {
        console.log("attra " + j + ":");
        const map = mapCalender.get(i)[j];
        console.log(mapCalender.get(i)[j]);
      }
    }

    let tempData = [];
    let attractions = {};

    for (let i = 0; i < mapCalender.size; i++) {
      attractions[`day${i + 1}`] = { dailyAttractions: mapCalender.get(i) };
    }
    let oneItem = {
      dates: dates,
      attractions: attractions,
      author: userDetails,
      typeAttractions: type,
      hotelLocation: location,
      mobility: newMobility,
    };
    await axios
      .post(`http://${ip}:4000/travel/add`, oneItem)
      .then((response) => {
        console.log(typeof oneItem.attractions);
        // Reload the screen to see the changes
        navigation.navigate("Schedule", { refresh: true });
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      });
  }
  //-----------------------------------------------
  const deleteAttraction = async () => {
    try {
      await axios
        .delete(`http://${ip}:4000/travel/delete/${id}`)
        .then((response) => {
          console.log(`Deleted id: ${id}`);
          //setRefreshData(true);
        })
        .catch((error) => {
          if (error.response) {
            console.log("Server responded with an error:", error.response.data);
          } else if (error.request) {
            console.log("Server did not respond:", error.request);
          } else {
            console.log("Other error:", error.message);
          }
        });
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };
  //-----------------------------------------------
  async function findMaxItem(ItemList) {
    const maxRatingItem = ItemList.reduce((maxItem, currentItem) => {
      if (currentItem.rating > maxItem.rating) {
        return currentItem;
      }
      return maxItem;
    });
    return maxRatingItem;
  }
  // Conditional rendering based on `mobility` value
  let buttons = null;
  if (mobility === "walking") {
    buttons = (
      <View style={styles.buttonContainer}>
        <Button
          title="Public Transport"
          onPress={() => NearByAPI(location, "5000", "public")}
        />
        <Button
          title="Car"
          onPress={() => NearByAPI(location, "8000", "car")}
        />
      </View>
    );
  } else if (mobility == "public") {
    buttons = (
      <View style={styles.buttonContainer}>
        <Button
          title="Walking"
          onPress={() => NearByAPI(location, "2000", "walking")}
        />
        <Button
          title="Car"
          onPress={() => NearByAPI(location, "8000", "car")}
        />
      </View>
    );
  } else {
    buttons = (
      <View style={styles.buttonContainer}>
        <Button
          title="Public Transport"
          onPress={() => NearByAPI(location, "5000", "public")}
        />
        <Button
          title="Walking"
          onPress={() => NearByAPI(location, "2000", "walking")}
        />
      </View>
    );
  }
  let mobilityIcon = require(`../assets/MobilityIcons/public.png`);
  if (mobility === "public")
    mobilityIcon = require(`../assets/MobilityIcons/public.png`);
  else if (mobility === "walking")
    mobilityIcon = require(`../assets/MobilityIcons/walking.png`);
  else if (mobility === "car")
    mobilityIcon = require(`../assets/MobilityIcons/car.png`);

  return (
    <ImageBackground
      source={require("../assets/BackgroundScreens/editMobility.png")}
      resizeMode="cover"
      style={styles.image}
    >
      <View style={styles.container}>
        <Text style={styles.currentMobilityText}>
          Your current mobility is: {mobility}
        </Text>
        <Image source={mobilityIcon} style={{ width: 100, height: 100 }} />
        <Text style={styles.chooseOptionText}>
          Please choose another option:
        </Text>
        {buttons}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    marginTop: 50,
    backgroundColor: "#transparent",
    alignItems: "center",
    // marginStart: 60,
    // marginEnd: 200,
  },
  currentMobilityText: {
    marginTop: 10,
    fontSize: 18,
  },
  chooseOptionText: {
    marginTop: 10,

    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "col",
    // justifyContent: "space-around",
    width: "100%",
  },
});

export default ChangeMobility;
