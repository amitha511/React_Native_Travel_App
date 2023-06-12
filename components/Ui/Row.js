import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useEffect, useState } from "react";

function Row(props) {
  const [type, setType] = useState(props.type);
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

  useEffect(() => {
    let updatedImages = {};
    if (props.image && props.image.length > 0) {
      let photoReference = props.image[0].photo_reference;
      updatedImages = {
        uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=AIzaSyDOI5owICVszKfksbNqLRRwHFh-RFQbeV0`,
      };
    }
    if (updatedImages.uri !== undefined) {
      setImages(updatedImages);
    } else {
      setImages(images[type]);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image key={"nickname"} style={styles.img} source={images} />
        <View style={styles.text}>
          <Text style={styles.text.title}>{props.title}</Text>
          <Text>
            {props.address ? (
              props.address
            ) : (
              <Text style={{ color: "red" }}>No Address Available</Text>
            )}
          </Text>
          <Text>
            Rating:
            {props.rating ? (
              props.rating
            ) : (
              <Text style={{ color: "red" }}>No Rating Available</Text>
            )}
          </Text>
          <Text>
            Business Status:
            {props.businessStatus ? (
              props.businessStatus
                .replace(/_/g, " ")
                .toLowerCase()
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
                .join(" ")
            ) : (
              <Text style={{ color: "red" }}>No Business Status Available</Text>
            )}
          </Text>
          {/*console.log(props.image)*/}
        </View>
      </View>
    </View>
  );
}
export default Row;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#C0C0C0",
    padding: 10,
    backgroundColor: "#ffffff",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    title: { fontWeight: "bold" },
    fontSize: 20,
    width: 270,
  },
  img: {
    borderWidth: 2,
    borderColor: "#990099",
    margin: 10,
    width: 100,
    height: 100,
    borderRadius: 50 / 2,
  },
});
