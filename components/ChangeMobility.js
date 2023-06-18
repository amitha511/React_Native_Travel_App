import React from "react";
import {
  View,
  StyleSheet,
  Button,
  Text,
  Image,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
function ChangeMobility() {
  const route = useRoute();
  const navigation = useNavigation();
  const { location, mobility, id, dates, type, userDetails } = route.params;
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
              key: process.env.key,
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
  async function startingAttraction(filteredDataList1, newMobility) {
    const mapCalender = new Map();
    let daysKeyArrays = [];
    let maxItem;
    let numDays = dates.length;
    let attractionTypesCounter = new Array(type.length).fill(1);
    let extraAttractionArr = [];
    let filteredDataList = filteredDataList1;
    for (let i = 0; i < numDays + 1; i++) {
      daysKeyArrays = [];
      attractionTypesCounter = new Array(type.length).fill(1);

      for (let j = 0; j < 5; j++) {
        let allZero = attractionTypesCounter.every((count) => count === 0);
        let attractionAddingChecker = false;

        if (!allZero) {
          let flag = 0;
          while (!attractionAddingChecker) {
            maxItem = findMaxItem(filteredDataList);
            let objItem = Object.values(maxItem)[2];

            for (let i = 0; i < type.length; i++) {
              if (
                objItem.types.includes(type[i]) &&
                attractionTypesCounter[i] !== 0
              ) {
                attractionTypesCounter[i] = 0;
                daysKeyArrays.push(objItem);
                console.log(
                  `Attraction Adding Type is: ${objItem.name} on index number ${j}`
                );
                attractionAddingChecker = true;
                flag = 1;
                break;
              }
            }

            if (flag === 0) {
              console.log(
                `${objItem.name} Adding to Extra on index number ${j}`
              );
              extraAttractionArr.push(objItem);
              filteredDataList = filteredDataList.filter(
                (item) => item.place_id !== objItem.place_id
              );
            }
          }
        } else {
          if (extraAttractionArr.length !== 0) {
            let variable = extraAttractionArr.pop();
            daysKeyArrays.push(variable);
            console.log(`Extra Adding Type from the if is: ${variable.types}`);
          } else {
            maxItem = findMaxItem(filteredDataList);
            let objItem = Object.values(maxItem)[2];
            daysKeyArrays.push(objItem);
            console.log(`Extra Adding Type from the else is: ${objItem.types}`);
          }
        }

        const updatedDataList = filteredDataList.filter(
          (item) => item.place_id !== daysKeyArrays[j].place_id
        );
        filteredDataList = updatedDataList;
      }

      mapCalender.set(i, daysKeyArrays);
      daysKeyArrays = [];
    }
    let tempData = [];
    let attractions = {};

    for (let i = 0; i < mapCalender.size; i++) {
      attractions[`day${i + 1}`] = { dailyAttractions: mapCalender.get(i) };
    }
    console.log(newMobility);
    let oneItem = {
      dates: dates,
      attractions: attractions,
      author: userDetails,
      typeAttractions: type,
      hotelLocation: location,
      mobility: newMobility,
    };
    await axios
      .post(`http://${process.env.ip}:4000/travel/add`, oneItem)
      .then((response) => {
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
  const deleteAttraction = async () => {
    try {
      await axios
        .delete(`http://${process.env.ip}:4000/travel/delete/${id}`)
        .then((response) => {})
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
  async function findMaxItem(ItemList) {
    const maxRatingItem = ItemList.reduce((maxItem, currentItem) => {
      if (currentItem.rating > maxItem.rating) {
        return currentItem;
      }
      return maxItem;
    });
    return maxRatingItem;
  }
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
          Your current mobility is:
        </Text>
        <Image source={mobilityIcon} style={{ width: 100, height: 100 }} />
        <Text> {mobility}</Text>

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
