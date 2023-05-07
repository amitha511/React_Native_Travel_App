import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TextInput, View, Button } from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
import RadioGroup from "react-native-radio-buttons-group";
import { ScrollView } from "react-native";
import Menu from "../components/Menu";

export default function BuildTripScreen() {
  const [hotel, setHotel] = useState(""); //hotel name
  const [location, setLocation] = useState(""); //hotel coordinates
  const [attractions, setAttractions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedType, setSelectedType] = useState("");

  //---------------------Api By Text To get Coordinates-----------
  function TextAPI(hotel) {
    console.log(hotel);
    const options = {
      method: "GET",
      url: "https://trueway-places.p.rapidapi.com/FindPlaceByText",
      params: { text: hotel, language: "en" },
      headers: {
        "X-RapidAPI-Key": "eaf73400d8msh6eb8f4919f0ef40p15e7a9jsnd2bdd10405dd",
        "X-RapidAPI-Host": "trueway-places.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data.results[0].location);
        var cordinates = response.data.results[0].location;
        console.log(cordinates);
        setLocation(cordinates.lat + "," + cordinates.lng);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
  //--------API By Coordinates---------------
  function NearByAPI(location, option) {
    if (option == null) {
      return;
    } else {
      let userRaduis;
      if (option === "walking") {
        userRaduis = 100;
        const options = {
          method: "GET",
          url: "https://trueway-places.p.rapidapi.com/FindPlacesNearby",
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

        axios
          .request(options)
          .then(function (response) {
            console.log(response.data.results);
            setAttractions(response.data.results);
          })
          .catch(function (error) {
            console.error(error);
          });
      } else if (option === "public") {
        userRaduis = 2500;
        const options = {
          method: "GET",
          url: "https://trueway-places.p.rapidapi.com/FindPlacesNearby",
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

        axios
          .request(options)
          .then(function (response) {
            console.log(response.data.results);
            setAttractions(response.data.results);
          })
          .catch(function (error) {
            console.error(error);
          });
      } else {
        userRaduis = 5000;
        const options = {
          method: "GET",
          url: "https://trueway-places.p.rapidapi.com/FindPlacesNearby",
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

        axios
          .request(options)
          .then(function (response) {
            setAttractions(response.data.results);
            //console.log(response.data.results); // log result of the search
            console.log(response.data.results);
          })
          .catch(function (error) {
            console.error(error);
          });
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
  const handleMenuOptionType = (option) => {
    setSelectedType(option);
    console.log("selectedOption " + selectedType);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>App Travel</Text>
      <View style={styles.hotelChoose}>
        <Text style={styles.text}>Inset Hotel:</Text>
        <TextInput
          placeholder=""
          style={styles.textInput}
          value={hotel}
          onChangeText={setHotel}
        ></TextInput>
        <Button title="Find Hotel" onPress={() => TextAPI(hotel)}></Button>
      </View>
      <Menu onValueSelect={handleMenuOptionType} />
      <View style={{ flexDirection: "column" }}>
        {data.map((item) => (
          <View style={{ flexDirection: "row", marginVertical: 5 }}>
            <RadioGroup
              radioButtons={[item]}
              onPress={handleOptionSelect}
              selectedButton={selectedOption === item.value}
              layout="row"
            />
          </View>
        ))}
      </View>
      <View></View>
      <Button
        title="Search"
        onPress={() => NearByAPI(location, selectedOption)}
      ></Button>

      <ScrollView>
        {attractions.map((attraction, index) => (
          <Text
            key={index}
            style={[
              styles.attractionText,
              selectedOption == null ? styles.errorText : null,
            ]}
          >
            <View>
              <Text
                style={styles.text}
              >{`attraction name-${attraction.name} attraction address-${attraction.address} attraction phone_number-${attraction.phone_number} attraction website-${attraction.website}`}</Text>
              {/* <Text
                style={styles.text}
              >{`attraction address-${attraction.address}`}</Text>
              <Text
                style={styles.text}
              >{`attraction phone_number-${attraction.phone_number}`}</Text>
              <Text
                style={styles.text}
              >{`attraction website-${attraction.website}`}</Text> */}
            </View>
          </Text>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 100,
  },
  hotelChoose: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#cccccc",
    width: "80%",
  },
  text: {
    fontSize: 20,
  },
  textHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
  },
  errorText: {
    color: "red",
  },
});
/*
name,
address,
phone_number,
website,



*/
