import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
function ChangeAttraction() {
  const navigation = useNavigation();
  const route = useRoute();
  const { data, id, NearByAPI } = route.params;
  //   async function NearByAPI() {

  //     let locationFrom = cordinates.lat + "," + cordinates.lng;
  //     console.log(locationFrom);
  //     const responseArray = [];

  //     const response = await axios.get(
  //       "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
  //       {
  //         params: {
  //           location: locationFrom,
  //           radius: userRadius,
  //           type: "tourist_attraction",
  //           key: "AIzaSyDOI5owICVszKfksbNqLRRwHFh-RFQbeV0",
  //         },
  //       }
  //     );

  //     responseArray.push(response.data);
  //     return responseArray;
  //   }
  const handleEditAttraction = (index, i) => {
    NearByAPI().then((dataList) => {
      console.log(dataList[0].results);
      console.log(id + " id in change");
      navigation.navigate("Details", {
        dataList: dataList[0].results,
        id: id,
        attractionIndex: i,
        dayIndex: index,
      });
    });
  };
  return (
    <View contentContainerStyle={styles.container}>
      {data.map((item, index) => (
        <View key={index}>
          {item.data.map((attraction, i) => (
            <Button
              key={i}
              title={`Change Attraction: ${attraction.title}`}
              onPress={() => handleEditAttraction(index, i)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  loadingText: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default ChangeAttraction;
