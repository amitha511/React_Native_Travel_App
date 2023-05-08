import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ImageBackground,
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
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [selectedAttractions, setSelectedAttractions] = useState([]);

  //---------------------Api By Text To get Coordinates-----------
  async function TextAPI(hotel) {
    console.log(hotel);
    const url = "https://trueway-places.p.rapidapi.com/FindPlaceByText";
    const options = {
      params: {
        text: hotel,
        language: "en",
      },
      headers: {
        "X-RapidAPI-Key": "eaf73400d8msh6eb8f4919f0ef40p15e7a9jsnd2bdd10405dd",
        "X-RapidAPI-Host": "trueway-places.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.get(url, options);
      var cordinates = response.data.results[0].location;
      console.log(cordinates);
      setLocation(cordinates.lat + "," + cordinates.lng);
    } catch (error) {
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
      if (selectedOption === "walking") {
        userRaduis = 1000;
      } else if (selectedOption === "public") {
        userRaduis = 2500;
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
            "eaf73400d8msh6eb8f4919f0ef40p15e7a9jsnd2bdd10405dd",
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
    console.log(selectedAttractions);
    navigation.navigate("SelectedAttractionsScreen", {
      selectedAttractions: [...selectedAttractions, attraction],
    });
  }
  const handleMenuOptionType = (option) => {
    setSelectedType(option);
    console.log("selectedOption " + selectedType);
  };
  function clickSearchHandel(params) {
    navigation.navigate("Details", params);
  }

  return (
    <ImageBackground
      source={require("../assets/background5.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.textHeader}>App Travel</Text>
        <View style={styles.hotelChoose}>
          <Text style={styles.text}>Inset Hotel:</Text>
          <TextInput
            placeholder=""
            style={styles.textInput}
            value={hotel}
            onChangeText={setHotel}
          />
          <Button
            title="Find Hotel"
            onPress={() => TextAPI(hotel)}
            style={styles.emphasizedButton}
            color="black"
            titleStyle={styles.buttonTitle}
          />
        </View>
        <Menu onValueSelect={handleMenuOptionType} />
        <View style={styles.radioGroupContainer}>
          {data.map((item) => (
            <View key={item.value} style={styles.radioButtonContainer}>
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
          color="black"
          titleStyle={styles.buttonTitle}
          title="Search"
          onPress={() => NearByAPI(location, selectedOption)}
        />

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* {attractions.length > 0 ? (
            attractions.map((attraction, index) => (
              <View key={index} style={styles.attractionCard}>
                <Text style={styles.attractionName}>{attraction.name}</Text>
                <Text style={styles.attractionDetails}>
                  Address: {attraction.address ? attraction.address : "NONE"}
                </Text>
                <Text style={styles.attractionDetails}>
                  Phone Number:{" "}
                  {attraction.phone_number ? attraction.phone_number : "NONE"}
                </Text>
                <Text style={styles.attractionDetails}>
                  Website: {attraction.website ? attraction.website : "NONE"}
                </Text>
                <Button
                  title="Select"
                  onPress={() => handleAttractionSelect(attraction)}
                  style={styles.selectButton}
                />
              </View>
            ))
          ) : (
            <Text style={styles.noResultsText}>No results found.</Text>
          )} */}
        </ScrollView>

        <StatusBar style="auto" />
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  emphasizedButton: {
    backgroundColor: "black",
    borderColor: "black",
    borderWidth: 2,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    // backgroundColor: "#C8FACD",
    // paddingVertical: 20,
    // paddingHorizontal: 16,
  },
  textHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  hotelChoose: {
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  radioGroupContainer: {
    flexDirection: "column",
    marginBottom: 16,
  },
  radioButtonContainer: {
    flexDirection: "row",
    marginVertical: 5,
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
