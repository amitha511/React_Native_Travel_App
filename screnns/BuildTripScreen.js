import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import RadioGroup from "react-native-radio-buttons-group";
import { ScrollView } from "react-native";
import Menu from "../components/Menu";
import { useNavigation } from "@react-navigation/native";
import DatePicker from "react-native-datepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../UserContext";
import axios from "axios";
import { LogBox } from "react-native";
export default function BuildTripScreen() {
  const navigation = useNavigation();
  const [hotel, setHotel] = useState("");
  const [location, setLocation] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedType, setSelectedType] = useState([]);
  const [icon, setIcon] = useState(require("../assets/markIcon/question.png"));
  const [message, setMessage] = useState("");
  const [message1, setMessage1] = useState("");
  const [inboundDate, setInboundDate] = useState(null);
  const [outboundDate, setOutboundDate] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const [dateRange, setDateRange] = useState([]);
  const { userDetails } = useContext(UserContext);
  let findHotel = false;
  LogBox.ignoreLogs(["Warning: ..."]);
  LogBox.ignoreAllLogs();
  function buildTrip(selectedType, location) {
    console.disableYellowBox = true;
    if (
      outboundDate != null &&
      inboundDate != null &&
      location != "" &&
      selectedOption != "" &&
      diff <= 7 &&
      selectedType.length > 0
    ) {
      setMessage("");
      NearByAPI(selectedType, location);
    } else if (diff > 7) {
      setMessage("A trip should be a maximum of 7 days");
    } else {
      setMessage("Please full all the filed");
    }
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

  async function startingAttraction(filteredAttractions) {
    const tripCalendar = new Map();
    let dailyAttractions = [];
    const numDays = calculateDateDifference();
    let attractionTypeAvailability = new Array(selectedType.length).fill(1);
    let additionalAttractions = [];

    for (let day = 0; day < numDays + 1; day++) {
      dailyAttractions = [];
      attractionTypeAvailability.fill(1);
      for (let count = 0; count < 5; count++) {
        if (attractionTypeAvailability.some((val) => val === 1)) {
          const attractionInfo = addAttraction(
            filteredAttractions,
            additionalAttractions,
            attractionTypeAvailability
          );
          dailyAttractions.push(attractionInfo);
        } else {
          dailyAttractions.push(
            popOrFindAttraction(filteredAttractions, additionalAttractions)
          );
        }
        filteredAttractions = removeAddedAttraction(
          filteredAttractions,
          dailyAttractions[count].place_id
        );
      }
      tripCalendar.set(day, dailyAttractions);
    }

    await postTripDetails(tripCalendar);
  }

  function addAttraction(
    filteredAttractions,
    additionalAttractions,
    attractionTypeAvailability
  ) {
    const maxRatingAttraction = findMaxItem(filteredAttractions);
    let attractionInfo;
    if (filteredAttractions.length !== 0) {
      attractionInfo = validateAttraction(
        maxRatingAttraction,
        filteredAttractions,
        additionalAttractions,
        attractionTypeAvailability
      );
    } else {
      attractionInfo = popOrFindAttraction(
        filteredAttractions,
        additionalAttractions
      );
    }
    return attractionInfo;
  }

  function validateAttraction(
    maxRatingAttraction,
    filteredAttractions,
    additionalAttractions,
    attractionTypeAvailability
  ) {
    const attractionInfo = Object.values(maxRatingAttraction)[2];
    for (let i = 0; i < selectedType.length; i++) {
      if (
        attractionInfo.types.includes(selectedType[i]) &&
        attractionTypeAvailability[i] !== 0
      ) {
        attractionTypeAvailability[i] = 0;
        return attractionInfo;
      }
    }
    additionalAttractions.push(attractionInfo);
    filteredAttractions = removeAddedAttraction(
      filteredAttractions,
      attractionInfo.place_id
    );
    return addAttraction(
      filteredAttractions,
      additionalAttractions,
      attractionTypeAvailability
    );
  }

  function popOrFindAttraction(filteredAttractions, additionalAttractions) {
    let attractionInfo;
    if (additionalAttractions.length !== 0) {
      attractionInfo = additionalAttractions.pop();
    } else {
      const maxRatingAttraction = findMaxItem(filteredAttractions);
      attractionInfo = Object.values(maxRatingAttraction)[2];
    }
    return attractionInfo;
  }

  function removeAddedAttraction(filteredAttractions, place_id) {
    return filteredAttractions.filter((item) => item.place_id !== place_id);
  }

  async function postTripDetails(tripCalendar) {
    let attractions = {};
    for (let i = 0; i < tripCalendar.size; i++) {
      attractions[`day${i + 1}`] = { dailyAttractions: tripCalendar.get(i) };
    }
    const tripDetails = {
      dates: dateRange,
      attractions: attractions,
      author: userDetails,
      typeAttractions: selectedType,
      hotelLocation: location,
      mobility: selectedOption,
    };
    try {
      const response = await axios.post(
        `http://${process.env.ip}:4000/travel/add`,
        tripDetails
      );
      console.log(typeof tripDetails.attractions);
    } catch (error) {
      handlePostError(error);
    }
  }

  function handlePostError(error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
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
        userRadius = 500;
      } else if (selectedOption === "public") {
        userRadius = 2500;
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
        console.log(filteredDataList);
        if (filteredDataList.length != 0) {
          let amount = 5 * (diff + 1);
          if (amount > filteredDataList.length) {
            setMessage1(
              "There are no enough results to your search, please try again"
            );
          } else {
            setMessage1("");
            setMessage("");
            startingAttraction(filteredDataList);
            clickSearchHandel(filteredDataList);
          }
        } else {
          setMessage1("There are no results to your search, please try again");
        }

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
    console.log(await AsyncStorage.getItem("successLogin"));
    axios
      .get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          address: hotel,
          key: process.env.key,
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
  // , {
  //       mobility: selectedOption,
  //       location: location,
  //     }
  function clickSearchHandel() {
    navigation.navigate("Schedule");
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
      source={require("../assets/BackgroundScreens/newTrip.png")}
      style={styles.backgroundImage}
    >
      <Text style={styles.TitleOut}>Add New Trip</Text>

      <View style={styles.calender}>
        <DatePicker
          customStyles={{
            dateInput: {
              borderRadius: 10,
              borderWidth: 0.5,
              borderColor: "#ffff",
              backgroundColor: "#ffff",
              borderColor: "transference",
            },
            datePickerCon: {
              backgroundColor: "#222",
            },
            placeholderText: {
              color: "black",
            },
          }}
          showIcon={false}
          style={styles.datePicker}
          androidMode="calendar"
          date={inboundDate}
          mode="date"
          placeholder="Check-in"
          format="YYYY-MM-DD"
          minDate={today}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          onDateChange={(date) => setInboundDate(date)}
        />
        {console.log(inboundDate + "," + today)}
        <DatePicker
          style={styles.datePicker}
          showIcon={false}
          customStyles={{
            dateInput: {
              borderRadius: 10,
              borderWidth: 0.5,
              borderColor: "#ffff",
              backgroundColor: "#ffff",
              borderColor: "transference",
            },
            datePickerCon: {
              backgroundColor: "#222",
            },
            placeholderText: {
              color: "black",
            },
          }}
          androidMode="calendar"
          date={outboundDate}
          mode="date"
          placeholder="Check-out"
          format="YYYY-MM-DD"
          minDate={inboundDate}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          onDateChange={(date) => setOutboundDate(date)}
        ></DatePicker>
      </View>

      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
          <Text style={styles.errorMessage}>{message}</Text>

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
            <TouchableOpacity
              style={styles.button}
              onPress={() => TextAPI(hotel)}
            >
              <Text>Find Hotel</Text>
            </TouchableOpacity>
          </View>
          {outboundDate != null ? (
            <Text style={{ paddingStart: 10 }}>Number of days: {diff + 1}</Text>
          ) : (
            outboundDate != null
          )}
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
          <Text style={styles.errorMessage}>{message1}</Text>
          <View style={{ marginStart: 140 }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                buildTrip(selectedType, location);
              }}
            >
              <Text>Search</Text>
            </TouchableOpacity>
          </View>
          <StatusBar style="auto" />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 50,
    marginStart: "5%",
    alignItems: "center",
    borderRadius: 20,
    justifyContent: "center",
    color: "#ffff",
    backgroundColor: "#E1E0FB",
  },
  scroll: {},
  TitleOut: {
    marginTop: 100,
    fontSize: 30,
    marginStart: 10,
    fontWeight: "bold",
    color: "#ffff",
    borderRadius: 10,
    borderColor: "black",
    textShadowRadius: 10,
    textShadowColor: "black",
  },
  container: {
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
    padding: 5,
    marginStart: 5,
    marginEnd: 5,
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
    textAlign: "center",
  },
  radioGroupContainer: {
    marginStart: 5,
    flexDirection: "row",
    marginBottom: 16,
    marginBottom: 50,
  },
  radioButtonItem: {
    marginLeft: 7,
    marginRight: 7,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  calender: {
    flexDirection: "row",
    justifyContent: "center",
    margin: 5,
  },
  calenderTitle: {
    title: {
      marginRight: 102,
    },
    marginLeft: 15,
    flexDirection: "row",
  },
  datePicker: {
    width: "42%",
    padding: 5,
  },
  iconCalander: {
    margin: 10,
    width: 25,
    height: 25,
  },
});
