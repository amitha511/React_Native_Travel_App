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
  let findHotel = false;
  const [inboundDate, setInboundDate] = useState(null);
  const [outboundDate, setOutboundDate] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const [allData, setAllData] = useState([]);

  // function buildTrip(selectedType, location) {
  //   selectedType.forEach((attraction) => NearByAPI(attraction, location));
  // }

  function buildTrip(selectedType, location) {
    NearByAPI(selectedType, location);
  }
  // async function NearByAPI(attraction, location) {
  //   let userRaduis = 100;
  //   if (selectedOption != null) {
  //     if (selectedOption === "walking") {
  //       userRaduis = 1000;
  //     } else if (selectedOption === "public") {
  //       userRaduis = 2500;
  //     } else if (selectedOption === "car") {
  //       userRaduis = 4000;
  //     }
  //     axios
  //       .get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
  //         params: {
  //           location: location,
  //           radius: userRaduis,
  //           type: attraction,
  //           key: "AIzaSyChcyF4cVEDDH2QVUYwvST7QAMughUNnhU",
  //         },
  //       })
  //       .then(function (response) {
  //         console.log(response.data);
  //         const data = response.data.results;
  //         console.log("--------------------------------");
  //         data.forEach((item, index) => {
  //           if (item.photos) {
  //             console.log(`Photos for item ${index}:`, item.photos);
  //           } else {
  //             console.log(`No photos for item ${index}`);
  //           }
  //         });

  //         clickSearchHandel(data);
  //         setHotel("");
  //         setSelectedOption("");
  //         setSelectedType([]);
  //         findHotel = false;
  //         setIcon(require("../assets/markIcon/question.png"));
  //       })
  //       .catch(function (error) {
  //         console.error(error);
  //       });
  //   }
  // }
  async function NearByAPI(attractions, location) {
    let userRadius = 100;
    if (selectedOption !== null) {
      if (selectedOption === "walking") {
        userRadius = 1000;
      } else if (selectedOption === "public") {
        userRadius = 2500;
      } else if (selectedOption === "car") {
        userRadius = 4000;
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
                key: "AIzaSyChcyF4cVEDDH2QVUYwvST7QAMughUNnhU",
              },
            }
          );
        });

        const responses = await Promise.all(requests);
        const data = responses.map((response) => response.data.results);

        const allData = data.flat();

        // console.log(allData);

        clickSearchHandel(allData);
        setHotel("");
        setSelectedOption("");
        setSelectedType([]);
        findHotel = false;
        setIcon(require("../assets/markIcon/question.png"));
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function TextAPI(hotel) {
    axios
      .get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          address: hotel,
          key: "AIzaSyChcyF4cVEDDH2QVUYwvST7QAMughUNnhU",
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
          console.error("No results returned from the Geocoding API");
        }
      })
      .catch(function (error) {
        setIcon(require("../assets/markIcon/error.png"));
        console.error(error);
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
    });
  }

  function changeHotelhandler(event) {
    setHotel(event);
    setLocation("");
    findHotel = false;
    setIcon(require("../assets/markIcon/question.png"));
  }

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
