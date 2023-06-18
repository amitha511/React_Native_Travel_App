import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import Row from "./Ui/Row";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
function ChangeAttraction() {
  const navigation = useNavigation();
  const route = useRoute();
  const { data, id, NearByAPI } = route.params;
  const handleEditAttraction = (index, i) => {
    NearByAPI().then((dataList) => {
      console.log(dataList[0].results);
      console.log(id + " id in change");
      navigation.navigate("Details", {
        dataList: dataList[0].results,
        id: id,
        attractionIndex: i,
        dayIndex: index,
      });
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please Choose an attraction to exchange</Text>

      <ScrollView>
        {data.map((item, index) => (
          <View key={index}>
            {item.data.map((attraction, i) => (
              <TouchableOpacity
                key={i}
                style={styles.row}
                //
                onPress={() => handleEditAttraction(index, i)}
              >
                <Row
                  key={i}
                  title={attraction.title}
                  image={attraction.photos}
                  address={attraction.vicinity}
                  rating={attraction.rating}
                  openingHours={attraction.openingHours}
                  type={attraction.type}
                />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    color: "#000",
    textAlign: "center",
    backgroundColor: "#E1B9B1",
  },
  container: {
    backgroundColor: "#ffff",
  },
  row: {
    borderWidth: 1,
    borderColor: "#FF4242",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  loadingText: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default ChangeAttraction;
