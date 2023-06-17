import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useEffect, useState } from "react";

function RowHome(props) {
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
        uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=AIzaSyBfiFw1fsLgQZ9a3JB_XplnxgO5eeK9b2E`,
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
      <Image key={"nickname"} style={styles.img} source={images} />
      <View
        style={{
          flexDirection: "column",
          width: 180,
          margin: 5,
        }}
      >
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Text style={{ alignContent: "center", fontWeight: "bold" }}>
            <Image
              source={require("../../assets/markIcon/star.png")}
              style={{
                width: 18,
                height: 18,
                alignItems: "center",
                marginRight: 2,
              }}
            />
            {/* Rating: */}
            {props.rating ? (
              props.rating
            ) : (
              <Text style={{ color: "red" }}>No Rating Available</Text>
            )}
          </Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.text}>
            <Text style={styles.text.title}>{props.title}</Text>

            <Text style={{ marginStart: 2 }}>
              {props.address ? (
                props.address
              ) : (
                <Text style={{ color: "red" }}>No Address Available</Text>
              )}
            </Text>

            <Text>
              <Text style={{ fontWeight: "500" }}> Opening Hours:</Text>
              {props.openingHours &&
              props.openingHours.open_now !== undefined ? (
                props.openingHours.open_now ? (
                  <Text style={{ color: "green" }}> Open Now</Text>
                ) : (
                  <Text style={{ color: "red" }}> Closed</Text>
                )
              ) : (
                <Text style={{ color: "red" }}> Not Available</Text>
              )}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
export default RowHome;

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 10,
    margin: 10,
  },
  container: {
    elevation: 50,
    alignContent: "center",
    borderWidth: 1,
    margin: 5,
    borderColor: "#C0C0C0",
    shadowRadius: 3,
    shadowColor: "#222",
    padding: 10,
    borderRadius: 30,
    backgroundColor: "transparent",
    justifyContent: "center",
  },
  row: {
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    width: 200,
    textAlign: "center",
    title: { fontWeight: "bold", textAlign: "center" },
    fontSize: 15,
    // width: 270,
  },
  img: {
    justifyContent: "center",
    marginStart: 20,
    borderWidth: 2,
    borderColor: "#C0C0C0",
    width: 150,
    height: 150,
    borderRadius: 30,
  },
});
