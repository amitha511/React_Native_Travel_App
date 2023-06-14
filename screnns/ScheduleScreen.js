import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
  TouchableOpacity,
  Image,
  Text,
  ImageBackground,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Timeline from "react-native-beautiful-timeline";
import * as Animatable from "react-native-animatable";
import { useRoute } from "@react-navigation/native";
import ChangeAttraction from "../components/ChangeAttraction";
import { UserContext } from "../UserContext";
// import { ip } from "../App";
import { ip } from "@env";

function Schedule() {
  const route = useRoute();
  //const { mobility, location } = route.params;
  const navigation = useNavigation();
  const [receiveData, setReceiveData] = useState(0);
  const [responseData, setResponseData] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(0);
  const [currentId, setCurrentId] = useState();

  let currentIndex = currentTrip;
  const [idArr, setIdArr] = useState([]);
  const [flag, setFlag] = useState(0);
  const { userDetails, setUserDetails } = useContext(UserContext);
  let attractions = [];
  useEffect(() => {
    console.log("enter from the delete");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://${ip}:4000/travel/get/${userDetails}`
        );

        // setCurrentId(response.data[0]._id);
        if (flag != 1) {
          for (let i = 0; i < response.data.length; i++) {
            idArr.push(response.data[i]._id);
            console.log(idArr[i]);
          }
        }
        setFlag(1);
        attractions = [];
        setResponseData(response.data);
        setReceiveData(1);
      } catch (error) {
        console.error(`Error${error} !`);
      }
    };

    fetchData();
    setRefreshData(false); // Reset the refresh state after fetching
  }, [refreshData]);
  let { refresh } = route.params || {};
  // Check if refresh flag is true and trigger refresh
  useEffect(() => {
    console.log(refresh + " refreshhhhhhhhhhhhhhhhhhhhhhhh");
    if (refresh) {
      handleRefresh();
    }
    refresh = false;
  }, [refresh]);
  let unixTimestamp;
  let newDays = [];
  if (
    responseData &&
    responseData[currentTrip] &&
    Array.isArray(responseData) &&
    responseData.length > 0
  ) {
    let date = new Date(responseData[currentTrip].dates[1]);
    // console.log(
    //   Object.values(
    //     responseData[currentTrip].attractions.day1.dailyAttractions[0]
    //   )
    // );
    for (let i = 0; i < responseData[currentTrip].dates.length; i++) {
      console.log("Dates2!!!!!!!! " + responseData[currentTrip].dates[i]);
      newDays.push(new Date(responseData[currentTrip].dates[i]));
    }

    unixTimestamp = date.getTime();
  }
  //console.log(responseData[currentTrip]._id); // the id of the attraction
  let data = [];

  const dataMap = new Map();
  if (responseData && Array.isArray(responseData) && responseData.length > 0) {
    for (let i = 0; i < newDays.length; i++) {
      console.log(newDays.length);
      console.log(responseData[currentTrip].dates[i] + "  Dates!!!!!!");
      dataMap.set(
        responseData[currentTrip].dates[i],
        Object.values(responseData[currentTrip].attractions)
      );
    }
    // for (let i = 0; i < dataMap.size; i++) {
    //   const map = dataMap.get(responseData[currentTrip].dates[i]);
    // }
  }

  const deleteAttraction = async () => {
    let id = responseData[currentTrip]._id;
    try {
      await axios
        .delete(`http://${ip}:4000/travel/delete/${id}`)
        .then((response) => {
          console.log(`Deleted id: ${id}`);

          const updatedData = responseData.filter((trip) => trip._id !== id);
          setResponseData(updatedData);

          if (currentTrip === responseData.length - 1) {
            setCurrentTrip(updatedData.length - 1);
          }
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

  for (let i = 0; i < newDays.length; i++) {
    let dailyData = [];
    let dateAndHour = newDays[i].getTime() + 18000000;
    let currentDayAttractions = dataMap.get(responseData[currentTrip].dates[i])[
      i
    ]?.dailyAttractions;
    console.log(currentDayAttractions + " Current day attraction");
    console.log(responseData[currentTrip].dates[i] + " Dates@@@");
    if (currentDayAttractions) {
      for (let j = 0; j < currentDayAttractions.length; j++) {
        if (currentDayAttractions[j]) {
          dailyData.push({
            title: currentDayAttractions[j].name,
            vicinity: currentDayAttractions[j].vicinity,
            photos: currentDayAttractions[j].photos,
            rating: currentDayAttractions[j].rating,
            openingHours: currentDayAttractions[j].opening_hours,
            subtitle: `Location is: ${currentDayAttractions[j].vicinity}`,
            date: dateAndHour,
          });
          dateAndHour = dateAndHour + 7200000;
        }
      }
    }

    data.push({
      date: newDays[i],
      data: dailyData,
    });
  }
  const handleButtonClick = () => {
    console.log("index is:" + currentTrip);
    console.log(responseData[currentTrip]._id);
    console.log(responseData[currentTrip]);
    navigation.navigate("Change", {
      data: data,
      id: responseData[currentTrip]._id,
      NearByAPI: NearByAPI,
      // type: typearr
    });
  };
  const handleMobilityClick = () => {
    navigation.navigate("Mobility", {
      location: responseData[currentTrip].hotelLocation,
      mobility: responseData[currentTrip].mobility,
      id: responseData[currentTrip]._id,
      dates: responseData[currentTrip].dates,
      type: responseData[currentTrip].typeAttractions,
      userDetails: userDetails,
    });
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
  async function NearByAPI() {
    let userRadius = 5000;
    let searchFrom =
      responseData[currentTrip].attractions.day1.dailyAttractions[0].geometry;
    const cordinates = searchFrom.location;
    let locationFrom = cordinates.lat + "," + cordinates.lng;
    console.log(locationFrom);
    const responseArray = [];

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: locationFrom,
          radius: userRadius,
          type: "tourist_attraction",
          key: "AIzaSyDOI5owICVszKfksbNqLRRwHFh-RFQbeV0",
        },
      }
    );

    responseArray.push(response.data);
    return responseArray;
    // Do something with the responseArray
  }
  if (receiveData === 1) {
    return (
      <ImageBackground
        source={require("../assets/BackgroundScreens/myTrips.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.scroll}>
          {/* <View Style={styles.container}> */}
          {/* <Text>
            page number {currentTrip + 1} of {responseData.length}
          </Text> */}
          <View style={styles.buttonsTop}>
            <View style={{ flexDirection: "column" }}>
              <TouchableOpacity
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: "transparent",
                  justifyContent: "center",
                }}
                onPress={handleRefresh}
              >
                <Text>Reload</Text>

                <Image
                  source={require("../assets/markIcon/reload.png")}
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "column" }}>
              <TouchableOpacity
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: "transparent",
                  justifyContent: "center",
                }}
                onPress={() => handleButtonClick()}
              >
                <Text>Edit</Text>

                <Image
                  source={require("../assets/markIcon/edit.png")}
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "column" }}>
              <TouchableOpacity
                style={{
                  width: 60,
                  height: 50,
                  backgroundColor: "transparent",
                  justifyContent: "center",
                }}
                onPress={() => handleMobilityClick()}
              >
                {/* <Text>Edit</Text> */}
                <Text>edit</Text>
                <Text>Mobility</Text>
                <Image
                  source={require("../assets/markIcon/mobility.png")}
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "column" }}>
              <TouchableOpacity
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: "transparent",
                  justifyContent: "center",
                }}
                onPress={deleteAttraction}
              >
                <Text>Delete</Text>

                <Image
                  source={require("../assets/markIcon/garbage.png")}
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.buttonContainer}></View>

          <View style={styles.timeLineContainer}>
            <Timeline
              timelineStyle={styles.timeLine}
              data={data}
              renderDetail={({ item }) => (
                <View>
                  <Text>{item.title}</Text>
                  <Text>{item.subtitle}</Text>
                  <Text>{item.date}</Text>
                </View>
              )}
            />
          </View>

          <View style={styles.buttonsPages}>
            <TouchableOpacity
              style={{
                width: 35,
                height: 35,
                backgroundColor: "transparent",
                justifyContent: "center",
                paddingLeft: "30%",
              }}
              onPress={handlePreviousTrip}
            >
              <Image
                source={require("../assets/markIcon/back.png")}
                style={{ width: 35, height: 35 }}
              />
            </TouchableOpacity>

            <Text style={{ margin: 10, paddingLeft: 40 }}>
              {currentTrip + 1} of {responseData.length}
            </Text>

            <TouchableOpacity
              style={{
                width: 35,
                height: 35,
                backgroundColor: "transparent",
                justifyContent: "center",
                paddingRight: "40%",
              }}
              onPress={handleNextTrip}
            >
              <Image
                source={require("../assets/markIcon/next.png")}
                style={{ width: 35, height: 35 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );

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
  scroll: {
    marginTop: "65.5%",
    marginBottom: "10%",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },

  buttonsPages: {
    flexDirection: "row",
    backgroundColor: "#ffff",
    justifyContent: "space-between",
    position: "absolute",
    width: "100%",
    marginVertical: "143%",
  },
  buttonsTop: {
    flexDirection: "row",
    backgroundColor: "#ffff",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 10,
  },
  timeLine: {
    borderTopEndRadius: 10,
    borderTopLeftRadius: 10,
    height: 700,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    flex: 1,
    backgroundColor: "black",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  container: {
    flexGrow: 1,
    marginTop: "40.5%",
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
