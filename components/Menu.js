import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

const Menu = (props) => {
  const options = [
    "tourist_attraction",
    "museum",
    "restaurant",
    "cafe",
    "bar",
    "synagogue",
    "church",
    "shopping_center",
    "cinema",
    "clothing_store",
    "casino",
    "bowling",
    "park",
    "spa",
    "stadium",
    "store",
    "supermarket",
    "zoo",
  ];

  const handleOptionSelect = (option) => {
    console.log(option + "----");
    if (props.selectedType.includes(option)) {
      props.setSelectedType((type) => type.filter((item) => item !== option));
    } else {
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
    width: 100,
    height: 50,
    backgroundColor: "#F8F4FA",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
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
