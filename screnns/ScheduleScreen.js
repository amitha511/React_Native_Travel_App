import axios from "axios";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import Timeline from "react-native-beautiful-timeline";
import * as Animatable from "react-native-animatable";
import moment from "moment";

function Schedule() {
  const [receiveData, setReceiveData] = useState(false);
  const [responseData, setResponseData] = useState(null);

  useEffect(async () => {
    await axios
      .get("http://192.168.1.70:4000/travel/get")

      .then((response) => {
        setResponseData(response.data);
        setReceiveData(true);
      })
      .catch((error) => console.error(`Error${error} !`));
  }, []);

  // let data = [];

  // if (responseData) {
  //   data = responseData.map((item) => {
  //     const attractionsData = Object.entries(item.attractions || {}).flatMap(
  //       ([day, attractions]) => {
  //         // const dayIndex = parseInt(day.replace("day", "")) - 1; // Extract day number and convert to zero-based index

  //         //const date = item.dates[dayIndex]; // Get corresponding date
  //         //console.log(date);
  //         const dailyAttractions = (attractions.dailyAttractions || []).map(
  //           (attraction, index) => {
  //             return {
  //               // day: day,
  //               title: attraction.name,
  //               subtitle: item.dates,
  //               // vicinity: attraction.vicinity,
  //             };
  //           }
  //         );
  //         return dailyAttractions;
  //       }
  //     );
  //     console.log(attractionsData);

  //     return {
  //       data: attractionsData,
  //     };
  //   });
  // }
  //console.log(responseData[0].dates[0]);
  let unixTimestamp;
  let newDays = [];
  if (responseData && Array.isArray(responseData) && responseData.length > 0) {
    let date = new Date(responseData[0].dates[1]);
    //console.log(responseData[0].attractions.day1.dailyAttractions);
    console.log(
      Object.values(responseData[0].attractions.day1.dailyAttractions[0])
    );
    for (let i = 0; i < responseData[0].dates.length + 1; i++) {
      newDays.push(new Date(responseData[0].dates[i]));
    }
    //console.log(newDays[0] + "aa");
    // console.log(newDays[1] + "aa");

    unixTimestamp = date.getTime();
    //console.log(unixTimestamp);
  }

  let data = [];

  const dataMap = new Map();
  if (responseData && Array.isArray(responseData) && responseData.length > 0) {
    for (let i = 0; i < newDays.length; i++) {
      dataMap.set(
        responseData[0].dates[i],
        Object.values(responseData[0].attractions)
      );
    }
    for (let i = 0; i < dataMap.size; i++) {
      console.log("day " + i + ":");

      const map = dataMap.get(responseData[0].dates[i]);
      console.log(map[0].dailyAttractions[0].name);
    }
  }

  for (let i = 0; i < newDays.length - 1; i++) {
    data.push({
      date: newDays[i],
      data: [
        {
          title: `Title for ${
            dataMap.get(responseData[0].dates[i])[i].dailyAttractions[0].name
          }`,
          subtitle: `Rating for ${
            dataMap.get(responseData[0].dates[i])[i].dailyAttractions[0].rating
          }`,
          date: newDays[i].getTime(),
        },

        // more items as needed...
      ],
    });
  }

  return receiveData ? (
    <View contentContainerStyle={styles.container}>
      <Timeline data={data} />
    </View>
  ) : (
    <View style={styles.container}>
      <Animatable.Text
        animation="fadeIn"
        duration={1000}
        style={styles.loadingText}
      >
        Loading...
      </Animatable.Text>
      <ActivityIndicator />
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
  loadingText: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default Schedule;
// const data = [
//   {
//     date: newDays[0],
//     data: [
//       {
//         title: "React Native Beautiful Timeline",
//         subtitle: "Sed at justo eros. Phasellus.",
//         date: 1574342522000,
//       },
//       {
//         title: "React Native",
//         subtitle: "Sed viverra. Nam sagittis.",
//         date: 1574342501000,
//       },
//     ],
//   },
//   {
//     date: newDays[1],
//     data: [
//       {
//         title: "Timeline",
//         subtitle: "Morbi magna orci, consequat in.",
//         date: 1574248261000,
//       },
//     ],
//   },
//   {
//     date: 1574125621000,
//     data: [
//       {
//         title: "Beauty Timeline",
//         subtitle: "Nulla a eleifend urna. Morbi. Praesent.",
//         date: 1574125621000,
//       },
//     ],
//   },
// ];
