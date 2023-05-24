import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Image,
  ImageBackground,
} from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
import RadioGroup from "react-native-radio-buttons-group";
import { ScrollView } from "react-native";
import Menu from "../components/Menu";
import { useNavigation } from "@react-navigation/native";
import DatePicker from "react-native-datepicker";

export default function BuildTripScreen() {
  const navigation = useNavigation();
  const [hotel, setHotel] = useState("");
  const [location, setLocation] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedType, setSelectedType] = useState([]);
  const [icon, setIcon] = useState(require("../assets/markIcon/question.png"));
  const [message, setMessage] = useState("");
  const [inboundDate, setInboundDate] = useState(null);
  const [outboundDate, setOutboundDate] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const [dateRange, setDateRange] = useState([]);
  function buildTrip(selectedType, location) {
    NearByAPI(selectedType, location);
  }

  const calculateDateDifference = () => {
    const date1 = new Date(inboundDate);

    const date2 = new Date(outboundDate);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    if (inboundDate && outboundDate) {
      const range = getDatesBetween(
        new Date(inboundDate),
        new Date(outboundDate)
      );
      setDateRange(range);
    }
  }, [inboundDate, outboundDate]);

  async function findMaxItem(ItemList) {
    const maxRatingItem = ItemList.reduce((maxItem, currentItem) => {
      if (currentItem.rating > maxItem.rating) {
        return currentItem;
      }
      return maxItem;
    });
    return maxRatingItem;
  }

  async function startingAttraction(filteredDataList) {
    // console.log("Function!!!!!!!!!!!!!!!!");
    let attractionArray = [];

    for (let i = 0; i < 3; i++) {
      attractionArray[i] = new Array(diff);
    }
    for (let i = 0; i < diff; i++) {
      attractionArray[0][i] = dateRange[i];
      //  console.log("attraction date: " + attractionArray[0][i]);
    }
    for (let i = 1; i < 3; i++) {
      attractionArray[i] = [];
      for (let j = 0; j < diff; j++) {
        attractionArray[i][j] = {};
      }
    }
    let index = 1;
    let currentDay = 0;
    let flag = 0;
    //console.log("before max item");
    let maxItem = findMaxItem(filteredDataList);
    //console.log("after max item");
    //console.log("diff is:" + diff);
    while (true) {
      //console.log("max item!!!!!" + maxItem)
      attractionArray[index][currentDay] = JSON.stringify(maxItem);
      //console.log("attraction!!!!!!!!!!!!!!!!! on index" + index + "on day" + currentDay + attractionArray[index][currentDay]);
      if (index == 2 && currentDay == diff - 1)
        break;
      else if (index == 2) {
        currentDay++;
        index = 1; // Reset index to 0 when moving to the next day
      } else {
        index++;
      }
      //const updatedDataList = filteredDataList.filter(item => JSON.stringify(item).name !== JSON.stringify(maxItem).name);
      console.log(filteredDataList);
      const updatedDataList = filteredDataList.filter(item => item.name);
      maxItem = findMaxItem(updatedDataList);

    }
    for (let i = 1; i < 3; i++) {
      for (let j = 0; j < diff; j++) {
        // console.log(attractionArray[i][j]);
      }
    }
  }



  const getDatesBetween = (start, end) => {
    const dateArray = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  };
  async function NearByAPI(attractions, location) {
    let userRadius = 100;
    if (selectedOption !== null) {
      if (selectedOption === "walking") {
        userRadius = 2500;
      } else if (selectedOption === "public") {
        userRadius = 5000;
      } else if (selectedOption === "car") {
        userRadius = 10000;
      }

      try {
        const requests = attractions.map((attraction) => {
          return axios.get(
            "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
            {
              params: {
                location: location,
                radius: userRadius,
                type: attraction,
                key: "AIzaSyAlbzwSETLZjyKsbInBioNPQP85gWNPlQ0",
              },
            }
          );
        });

        const responses = await Promise.all(requests);
        const data = responses.map((response) => response.data.results);
        const convert = data.map((item) => {
          id: item.place_id;
          name: item.name;
        });
        const allData = data.flat();
        //console.log(allData); //all the data that is send to the details components
        //console.log(allData.map((item) => item.rating)); // all the data that is send to the details components
        //console.log(selectedType); // an array of type's the user selected
        //console.log(dateRange); // an array of dates , //<Text key={date}>{date.toISOString().split("T")[0]}</Text>
        const filteredDataList = allData.filter(item => item.rating !== undefined);
        startingAttraction(filteredDataList);
        clickSearchHandel(filteredDataList);
        setHotel("");
        setSelectedOption("");
        setSelectedType([]);
        findHotel = false;
        setIcon(require("../assets/markIcon/question.png"));
      } catch (error) {
        // console.error(error);
      }
    }
  }

  async function TextAPI(hotel) {
    axios
      .get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          address: hotel,
          key: "AIzaSyAlbzwSETLZjyKsbInBioNPQP85gWNPlQ0",
        },
      })
      .then(function (response) {
        if (
          response.data &&
          response.data.results &&
          response.data.results[0]
        ) {
          const cordinates = response.data.results[0].geometry.location;
          setLocation(cordinates.lat + "," + cordinates.lng);
          setIcon(require("../assets/markIcon/validationIcon.png"));
          findHotel = true;
          // console.log(location);
        } else {
          // console.error("No results returned from the Geocoding API");
        }
      })
      .catch(function (error) {
        setIcon(require("../assets/markIcon/error.png"));
        //console.error(error);
      });
  }

  const data = [
    {
      label: "Walking",
      value: "walking",
    },
    {
      label: "Public Transport",
      value: "public",
    },
    {
      label: "Car",
      value: "car",
    },
  ];

  function handleOptionSelect(selected) {
    const newSelectedValue = selected.find(
      (item) => item.selected === true
    ).value;
    setSelectedOption(newSelectedValue);
  }

  function clickSearchHandel(params) {
    navigation.navigate("Details", {
      dataList: params,
      selectedType: selectedType,
      duration: diff,
      dates: dateRange,

    });
  }

  function changeHotelhandler(event) {
    setHotel(event);
    setLocation("");
    findHotel = false;
    setIcon(require("../assets/markIcon/question.png"));
  }
  const diff = calculateDateDifference();



  return (
    <ImageBackground
      source={require("../assets/background/vecation.png")}
      style={styles.backgroundImage}
    >
      <ScrollView style={styles.scroll}>
        <Text style={styles.errorMessage}>{message}</Text>
        <View style={styles.container}>
          <Text>Inbound Date:</Text>
          <DatePicker
            style={styles.datePicker}
            date={inboundDate}
            mode="date"
            placeholder="Select Inbound Date"
            format="YYYY-MM-DD"
            minDate={today}
            maxDate="2023-12-31"
            onDateChange={(date) => setInboundDate(date)}
          />
          <Text>Outbound Date:</Text>
          <DatePicker
            style={styles.datePicker}
            date={outboundDate}
            mode="date"
            placeholder="Select Outbound Date"
            format="YYYY-MM-DD"
            minDate={today}
            maxDate="2023-12-31"
            onDateChange={(date) => setOutboundDate(date)}
            locale="en"
          />
          <Text>
            {diff > 7 ? (
              <Text style={{ color: "red" }}>
                There are too many days the max is 7
              </Text>
            ) : (
              `Days Difference: ${diff}`
            )}
          </Text>
          {diff <= 7 &&
            dateRange.map((date) => (
              <Text key={date}>{date.toISOString().split("T")[0]}</Text>
            ))}
          <Text style={styles.text}>Enter Hotel/location:</Text>
          <View style={styles.validHotel}>
            <View style={styles.inputView}>
              <TextInput
                placeholder="Enter hotel name"
                style={styles.TextInput}
                value={hotel}
                placeholderTextColor="#003f5c"
                onChangeText={changeHotelhandler}
              />
              <Image key={"validation"} style={styles.img} source={icon} />
            </View>
            <Button title="Find Hotel" onPress={() => TextAPI(hotel)} />
          </View>
          <View style={styles.separator} />
          <Text style={styles.text}>Select an option:</Text>
          <Menu selectedType={selectedType} setSelectedType={setSelectedType} />

          <View style={styles.separator} />

          <Text style={styles.text}>mobility:</Text>
          <View style={styles.radioGroupContainer}>
            {data.map((item) => (
              <View key={item.value} style={styles.radioButtonItem}>
                <RadioGroup
                  radioButtons={[item]}
                  onPress={handleOptionSelect}
                  selectedButton={selectedOption === item.value}
                  layout="row"
                />
              </View>
            ))}
          </View>

          <Button
            style={styles.emphasizedButton}
            titleStyle={styles.buttonTitle}
            title="Search"
            onPress={() => buildTrip(selectedType, location)}
          />
          <StatusBar style="auto" />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginTop: "25%",
  },
  container: {
    paddingTop: "-30%",
    flex: 1,
  },
  inputView: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0EDED",
    borderRadius: 10,
    width: "70%",
    height: 55,
    marginBottom: 20,
  },
  TextInput: {
    flex: 1,
    padding: "2%",
    marginLeft: 20,
  },
  img: {
    margin: 10,
    width: 25,
    height: 25,
    borderRadius: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  validHotel: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  text: {
    fontSize: 15,
    margin: 10,
  },
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 15,
    margin: 10,
  },
  errorMessage: {
    color: "red",
    width: "60%",
    margin: 10,
    paddingBottom: "5%",
  },
  radioGroupContainer: {
    marginStart: 5,
    flexDirection: "row",
    marginBottom: 16,
  },
  radioButtonItem: {
    marginLeft: 7,
    marginRight: 7,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  datePicker: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
  },
});
