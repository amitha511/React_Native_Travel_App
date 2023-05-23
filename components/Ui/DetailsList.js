import React, { Fragment, useState, useEffect } from "react";
import {
  Text,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";

import Row from "./Row";

export default function DetailsList() {
  const route = useRoute();
  const { dataList, selectedType } = route.params;
  const [list, setList] = useState(dataList);
  const [tripData, setTripData] = useState([]);
  const [images, setImages] = useState({
    bar: require("../../assets/defualtBackground/bar.jpg"),
    bowling: require("../../assets/defualtBackground/bowling.jpg"),
    cafe: require("../../assets/defualtBackground/cafe.jpg"),
    casino: require("../../assets/defualtBackground/casino.jpg"),
    cemetery: require("../../assets/defualtBackground/cemetery.jpg"),
    church: require("../../assets/defualtBackground/church.jpg"),
    cinema: require("../../assets/defualtBackground/cinema.jpg"),
    clothing_store: require("../../assets/defualtBackground/clothing_store.jpg"),
    department_store: require("../../assets/defualtBackground/department_store.jpg"),
    doctor: require("../../assets/defualtBackground/doctor.jpg"),
    lodging: require("../../assets/defualtBackground/lodging.jpg"),
    museum: require("../../assets/defualtBackground/museum.jpg"),
    night_club: require("../../assets/defualtBackground/night_club.jpg"),
    park: require("../../assets/defualtBackground/park.jpg"),
    pharmacy: require("../../assets/defualtBackground/pharmacy.jpg"),
    restaurant: require("../../assets/defualtBackground/restaurant.jpg"),
    shopping_center: require("../../assets/defualtBackground/shopping_center.jpg"),
    spa: require("../../assets/defualtBackground/spa.jpg"),
    stadium: require("../../assets/defualtBackground/stadium.jpg"),
    store: require("../../assets/defualtBackground/store.jpg"),
    supermarket: require("../../assets/defualtBackground/supermarket.jpg"),
    synagogue: require("../../assets/defualtBackground/synagogue.jpg"),
    tourist_attraction: require("../../assets/defualtBackground/tourist_attraction.jpg"),
    train_station: require("../../assets/defualtBackground/train_station.jpg"),
    transit_station: require("../../assets/defualtBackground/transit_station.jpg"),
    zoo: require("../../assets/defualtBackground/zoo.jpg"),
  });

  const url = useEffect(() => {
    const fetchImages = async () => {
      let updatedImages = {};

      for (const item of list) {
        if (item.photos && item.photos.length > 0) {
          let photoReference = item.photos[0].photo_reference;
          let photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=AIzaSyAlbzwSETLZjyKsbInBioNPQP85gWNPlQ0`;

          try {
            let response = await axios.get(photoUrl);
            if (response.status === 200 && response.request.responseURL) {
              updatedImages[item.place_id] = {
                uri: response.request.responseURL,
              };
            } else {
              updatedImages[item.place_id] = images[selectedType];
            }
          } catch (error) {
            updatedImages[item.place_id] = images[selectedType];
            console.error(error);
          }
        }
      }

      setImages(updatedImages);
    };

    fetchImages();
  }, [list]);
  console.log(url);

  const handleButtonClick = (item) => {
    setTripData((prevData) => {
      const itemExist = prevData.find((data) => data.id === item.id);
      if (!itemExist) {
        return [...prevData, item];
      } else {
        return prevData;
      }
    });
  };

  if (!(list.length > 0)) {
    return (
      <Fragment>
        <Text style={styles.text}>
          There are no attractions of the selected type nearby
        </Text>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <ScrollView>
          {list.map((item, index) => (
            <View key={index}>
              <Row
                title={item.name}
                image={
                  images[item.place_id]
                    ? images[item.place_id]
                    : images[selectedType]
                }
                address={item.vicinity}
                rating={item.rating}
                businessStatus={item.business_status}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleButtonClick(item)}
              >
                <Text style={styles.buttonText}>Add to trip</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    fontSize: 20,
    margin: "20%",
    width: 270,
  },
  button: {
    backgroundColor: "#ADD8E6",
    padding: 10,
    alignItems: "center",
    margin: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
