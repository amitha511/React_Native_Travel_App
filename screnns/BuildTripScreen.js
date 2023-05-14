import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ImageBackground,
  Image,
} from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
import RadioGroup from "react-native-radio-buttons-group";
import { ScrollView } from "react-native";
import Menu from "../components/Menu";
import { useNavigation } from "@react-navigation/native";

export default function BuildTripScreen() {
  const navigation = useNavigation();

  const [hotel, setHotel] = useState(""); //hotel name
  const [location, setLocation] = useState(""); //hotel coordinates
  const [attractions, setAttractions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedAttractions, setSelectedAttractions] = useState([]);
  const [icon, setIcon] = useState(require("../assets/markIcon/question.png"));
  const [message, setMessage] = useState("");
  let findHotel = false;
  //---------------------Api By Text To get Coordinates-----------
  async function TextAPI(hotel) {
    setMessage("");
    console.log(hotel);
    const url = "https://trueway-places.p.rapidapi.com/FindPlaceByText";
    const options = {
      params: {
        text: hotel,
        language: "en",
      },
      headers: {
        "X-RapidAPI-Key": "1f28776a25mshce47ae80ec26e34p193099jsne9d651be391e",
        "X-RapidAPI-Host": "trueway-places.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.get(url, options);
      var cordinates = response.data.results[0].location;
      console.log(cordinates);
      setLocation(cordinates.lat + "," + cordinates.lng);
      setIcon(require("../assets/markIcon/validationIcon.png"));
      findHotel = true;
    } catch (error) {
      setIcon(require("../assets/markIcon/error.png"));
      findHotel = false;

      console.log(error.message);
    }
  }

  //--------API By Coordinates---------------
  async function NearByAPI() {
    console.log(selectedType);
    console.log(selectedOption);
    setAttractions([]);
    const url = "https://trueway-places.p.rapidapi.com/FindPlacesNearby";
    let userRaduis = 100;
    if (selectedOption != null) {
      if (selectedOption === "car") {
        userRaduis = 1000;
      } else if (selectedOption === "public") {
        userRaduis = 2500;
      } else if (selectedOption === "car") {
        userRaduis = 4000;
      }

      const options = {
        params: {
          location: location,
          type: selectedType,
          radius: userRaduis,
          language: "en",
        },
        headers: {
          "X-RapidAPI-Key":
            "1f28776a25mshce47ae80ec26e34p193099jsne9d651be391e",
          "X-RapidAPI-Host": "trueway-places.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.get(url, options);
        const data = response.data.results;
        setAttractions(data);
        console.log(data);
        clickSearchHandel(data);
      } catch (error) {
        if (findHotel === false) {
          setMessage(
            "The hotel is not found, please enter the name of the hotel or the city of the hotel"
          );
        } else {
          setMessage(error.message);
        }
        setIcon(require("../assets/markIcon/error.png"));
        console.log(error.message);
      }
    }
  }
  //--------------------
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
    console.log(selectedOption);
    setSelectedOption(newSelectedValue);
  }
  function handleAttractionSelect(attraction) {
    setSelectedAttractions((prevSelectedAttractions) => [
      ...prevSelectedAttractions,
      attraction,
    ]);
  }
  const handleMenuOptionType = (option) => {
    setSelectedType(option);
    console.log("selectedOption: " + selectedType);
  };
  function clickSearchHandel(params) {
    navigation.navigate("Details", params);
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
          <Menu onValueSelect={handleMenuOptionType} />
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
            onPress={() => NearByAPI(location, selectedOption)}
          />
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
          ></ScrollView>
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
    // textAlign: "center",
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
  attractionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
  },
  attractionName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  attractionDetails: {
    fontSize: 16,
    marginBottom: 4,
  },
  noResultsText: {
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
});
