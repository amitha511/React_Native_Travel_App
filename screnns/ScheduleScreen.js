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
import Timeline from "react-native-beautiful-timeline";
import * as Animatable from "react-native-animatable";
import { useRoute } from "@react-navigation/native";
function Schedule() {
  const route = useRoute();
  const { dataList, selectedType, duration, dates } = route.params;
  const navigation = useNavigation();
  const [receiveData, setReceiveData] = useState(0);
  const [responseData, setResponseData] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(0);
  const [currentId, setCurrentId] = useState();
  let currentIndex = currentTrip;
  const [idArr, setIdArr] = useState([]);
  const [flag, setFlag] = useState(0)

  useEffect(() => {
    console.log("enter from the delete");
    const fetchData = async () => {
      try {
        const response = await axios.get("http://172.20.10.5:4000/travel/get");
        setCurrentId(response.data[0]._id);
        if (flag != 1) {
          for (let i = 0; i < response.data.length; i++) {
            idArr.push(response.data[i]._id);
            console.log(idArr[i]);
          }
        }
        setFlag(1)
        setResponseData(response.data);
        setReceiveData(1);
      } catch (error) {
        console.error(`Error${error} !`);
      }
    };

    fetchData();
    setRefreshData(false); // Reset the refresh state after fetching
  }, [refreshData]);

  let unixTimestamp;
  let newDays = [];
  if (responseData && Array.isArray(responseData) && responseData.length > 0) {
    let date = new Date(responseData[currentTrip].dates[1]);
    // console.log(
    //   Object.values(
    //     responseData[currentTrip].attractions.day1.dailyAttractions[0]
    //   )
    // );
    for (let i = 0; i < responseData[currentTrip].dates.length + 1; i++) {
      newDays.push(new Date(responseData[currentTrip].dates[i]));
    }

    unixTimestamp = date.getTime();
  }
  //console.log(responseData[currentTrip]._id); // the id of the attraction
  let data = [];

  const dataMap = new Map();
  if (responseData && Array.isArray(responseData) && responseData.length > 0) {
    for (let i = 0; i < newDays.length; i++) {
      dataMap.set(
        responseData[currentTrip].dates[i],
        Object.values(responseData[currentTrip].attractions)
      );
    }
    for (let i = 0; i < dataMap.size; i++) {
      const map = dataMap.get(responseData[currentTrip].dates[i]);
    }
  }

  const deleteAttraction = async () => {
    let id = responseData[currentTrip]._id;
    try {
      await axios
        .delete(`http://172.20.10.5:4000/travel/delete/${id}`)
        .then((response) => {
          console.log(`Deleted id: ${id}`);
          setRefreshData(true);
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
  for (let i = 0; i < newDays.length - 1; i++) {
    let dailyData = [];
    let dateAndHour = newDays[i].getTime() + 18000000;

    let currentDayAttractions = dataMap.get(responseData[currentTrip].dates[i])[i]?.dailyAttractions;
    if (currentDayAttractions) {
      for (let j = 0; j < currentDayAttractions.length; j++) {
        if (currentDayAttractions[j]) {

          dailyData.push({
            title: currentDayAttractions[j].name,
            subtitle: `Location is: ${currentDayAttractions[j].vicinity}`,
            date: dateAndHour,
          });
          dateAndHour = dateAndHour + 7200000
        }
      }
    }

    data.push({
      date: newDays[i],
      data: dailyData,

    });
  }
  const handleButtonClick = () => {
    setReceiveData(2);
  };
  const handleRefresh = () => {
    setRefreshData(true);
  };
  const handleNextTrip = () => {
    if (currentTrip < responseData.length - 1) {
      setCurrentTrip(currentTrip + 1);

    }
  };
  const handlePreviousTrip = () => {
    if (currentTrip > 0) {
      setCurrentTrip(currentTrip - 1);
    }
  };
  const handleEditAttraction = (attraction, index, i) => {
    navigation.navigate("Details", {
      dataList: dataList,
      selectedType: selectedType,
      id: idArr[currentTrip],
      attractionIndex: i,
      dayIndex: index
    });
  };
  if (receiveData === 1) {
    return (
      <View contentContainerStyle={styles.container}>
        <Text>
          page number {currentTrip + 1} of {responseData.length}
        </Text>
        <View style={styles.buttonContainer}>
          <Button title="Reload Trip" onPress={handleRefresh} />
          <Button title="Previous Trip" onPress={handlePreviousTrip} />
          <Button title="Next Trip" onPress={handleNextTrip} />
          <Button title="delete Trip" onPress={deleteAttraction} />
        </View>
        <Button title="Edit" onPress={() => handleButtonClick()} />
        <Timeline data={data} renderDetail={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.subtitle}</Text>
            <Text>{item.date}</Text>
          </View>
        )} />
      </View>
    );
  }
  else if (receiveData === 2) {
    return (
      <View contentContainerStyle={styles.container}>
        {data.map((item, index) => (
          <View key={index}>
            {item.data.map((attraction, i) => (
              <Button
                key={i}
                title={`Change Attraction: ${attraction.title}`}
                onPress={() => handleEditAttraction(attraction, index, i)}
              />
            ))}
          </View>
        ))}
      </View>
    );
  }
  else {
    return (
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

export default Schedule;
