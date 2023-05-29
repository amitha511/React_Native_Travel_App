import axios from "axios";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import Timeline from "react-native-beautiful-timeline";
import * as Animatable from "react-native-animatable";
import moment from "moment";

function Schedule() {
  const [receiveData, setReceiveData] = useState(false);
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    axios
      .get("http://192.168.1.70:4000/travel/get")
      .then((response) => {
        setResponseData(response.data);
        setReceiveData(true);
      })
      .catch((error) => console.error(`Error${error}`));
  }, []);

  let data = [];

  if (responseData) {
    data = responseData.map((item) => {
      const dates = item.dates.map((date) =>
        moment(date, "YYYY-MM-DD").toDate()
      );

      const attractionsData = Object.entries(item.attractions || {}).flatMap(
        ([day, attractions]) => {
          const dayNumber = Number(day.slice(3)); // Extract day number

          const dailyAttractions = (attractions.dailyAttractions || []).map(
            (attraction, index) => {
              const currentDate = Math.floor(
                dates[dayNumber - 1].getTime() / 1000
              );
              return {
                title: attraction.name,
                subtitle: attraction.rating,
                date: currentDate,
                vicinity: attraction.vicinity,
                day: dayNumber, // Add day information to each attraction
              };
            }
          );
          return dailyAttractions;
        }
      );

      return {
        date: dates.map((date) => Math.floor(date.getTime() / 1000)),
        data: attractionsData,
      };
    });
  }

  return receiveData ? (
    <ScrollView contentContainerStyle={styles.container}>
      <Timeline data={data} />
    </ScrollView>
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
