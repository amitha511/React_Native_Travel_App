import {
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
} from "react-native";
import Row from "./Row";
import { Fragment, useState } from "react";
import { useRoute } from "@react-navigation/native";

export default function DetailsList() {
  const route = useRoute();
  const [list, setList] = useState(route.params);
  const [tripData, setTripData] = useState([]);

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
                image={require("../../assets/people.jpg")}
                phone={item.phone_number}
                address={item.address}
                website={item.website}
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
