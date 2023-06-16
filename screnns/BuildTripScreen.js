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
import { useState, useEffect, useContext } from "react";
import RadioGroup from "react-native-radio-buttons-group";
import { ScrollView } from "react-native";
import Menu from "../components/Menu";
import { useNavigation } from "@react-navigation/native";
import DatePicker from "react-native-datepicker";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../UserContext";
import axios from "axios";
import { ip } from "@env";
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
  const [numberDays, setnumberDays] = useState(0);
  const { userDetails, setUserDetails } = useContext(UserContext);
  let findHotel = false;
  //search btn
  function buildTrip(selectedType, location) {
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

  async function startingAttraction(filteredDataList) {
    const mapCalender = new Map(); //map => (numday , [attractionArray])
    let daysKeyArrays = [];
    let maxItem; //item with max rating
    let numDays = calculateDateDifference(); // number days

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

    for (let i = 0; i < diff + 1; i++) {
      console.log("day " + i + ":");
      for (let j = 0; j < 3; j++) {
        console.log("attra " + j + ":");
        const map = mapCalender.get(i)[j];
        console.log(mapCalender.get(i)[j]);
      }
    }

    let tempData = [];
    // for (let i = 0; i < diff + 1; i++) {
    //   //console.log("day " + i + ":");
    //   for (let j = 0; j < 3; j++) {
    //     //console.log("attra " + j + ":");
    //     //console.log(mapCalender.get(i)[j]);
    //   }
    // }
    // var oneItem;
    // (oneItem = {
    //   dates: dateRange,
    //   attractions: {
    //     day1: { dailyAttractions: mapCalender.get(0) },
    //     day2: { dailyAttractions: mapCalender.get(1) },
    //     day3: { dailyAttractions: mapCalender.get(3) },
    //   },
    // }),
    //   console.log(mapCalender.get(0));
    let attractions = {};

    for (let i = 0; i < mapCalender.size; i++) {
      attractions[`day${i + 1}`] = { dailyAttractions: mapCalender.get(i) };
    }

    let oneItem = {
      dates: dateRange,
      attractions: attractions,
      author: userDetails,
      typeAttractions: selectedType,
      hotelLocation: location,
      mobility: selectedOption,
    };
    await axios
      .post(`http://${ip}:4000/travel/add`, oneItem)
      .then(console.log(typeof oneItem.attractions))
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
        userRadius = 1000;
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
                key: "AIzaSyBfiFw1fsLgQZ9a3JB_XplnxgO5eeK9b2E",
              },
            }
          );
        });

        const responses = await Promise.all(requests);
        const data = responses.map((response) => response.data.results);
        const allData = data.flat();
        //console.log(allData); //all the data that is send to the details components
        //console.log(allData.map((item) => item.rating)); // all the data that is send to the details components
        //console.log(selectedType); // an array of type's the user selected
        //console.log(dateRange); // an array of dates , //<Text key={date}>{date.toISOString().split("T")[0]}</Text>
        const filteredDataList = allData.filter(
          (item) => item.rating !== undefined
        );
        startingAttraction(filteredDataList);
        clickSearchHandel(filteredDataList);
        // setHotel("");
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
          key: "AIzaSyBfiFw1fsLgQZ9a3JB_XplnxgO5eeK9b2E",
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
      source={require("../assets/BackgroundScreens/register.png")}
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
          // maxDate={inboundDat}
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
            <Button title="Find Hotel" onPress={() => TextAPI(hotel)} />
          </View>
          {outboundDate != null ? (
            <Text style={{ paddingStart: 10 }}>Number of days: {diff}</Text>
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
          <Button
            style={styles.emphasizedButton}
            titleStyle={styles.buttonTitle}
            title="Search"
            onPress={() => {
              buildTrip(selectedType, location);
            }}
          />
          <StatusBar style="auto" />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    // marginTop: "0.5%",
  },
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
    // width: "50%",
  },
  datePicker: {
    width: "42%",
    padding: 5,
    // color: "#000",
  },
  iconCalander: {
    margin: 10,
    width: 25,
    height: 25,
  },
});
