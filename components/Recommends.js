import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import Row from "./Ui/Row";
const options = [
  { title: "try1", phone: "rowwww", website: "dfgfdf" },
  { title: "try1", phone: "rowwww", website: "dfgfdf" },

  { title: "try1", phone: "rowwww", website: "dfgfdf" },
];
function Recommends() {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onValueSelect(option);
  };

  //row => props - image, title , phone, website

  return (
    <View>
      <ScrollView horizontal={true} style={styles.container}>
        {options.map((item) => (
          <Row
            image={require("../assets/people.jpg")}
            phone={item.phone_number}
            address={item.address}
            website={item.website}
          ></Row>
        ))}
      </ScrollView>
    </View>
  );
}

export default Recommends;

const styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  content: {
    width: 70,
    height: 60,
    backgroundColor: "#FEEEFF",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    padding: 10,
    borderWidth: 2,
    borderColor: "#802A86",
    cursor: "pointer",
  },
  text: {
    fontSize: 10,
  },
  selected: {
    backgroundColor: "#C5B1C9",
  },
});
