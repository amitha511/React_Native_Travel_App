import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

const Menu = (props) => {
  const options = [
    "bar",
    "bowling",
    "cafe",
    "casino",
    "cemetery",
    "church",
    "cinema",
    "clothing_store",
    "department_store",
    "doctor",
    "lodging",
    "museum",
    "night_club",
    "park",
    "pharmacy",
    "restaurant",
    "shopping_center",
    "spa",
    "stadium",
    "store",
    "supermarket",
    "synagogue",
    "tourist_attraction",
    "train_station",
    "transit_station",
    "zoo",
  ];

  const handleOptionSelect = (option) => {
    console.log(option + "----");
    if (!props.selectedType.includes(option)) {
      props.setSelectedType((type) => [...type, option]);
    }
    console.log(props.selectedType);
  };

  return (
    <View>
      <ScrollView horizontal={true} style={styles.container}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => handleOptionSelect(option)}
          >
            <View
              style={[
                styles.content,
                props.selectedType.includes(option) && styles.selected,
              ]}
            >
              <Text style={styles.text}>{option}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Menu;

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
