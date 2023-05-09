import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

const Menu = ({ onValueSelect }) => {
  const options = [
    "bar",
    // "beauty_salon",
    // "bicycle_store",
    // "book_store",
    "bowling",
    // "bus_station",
    "cafe",
    // "campground",
    // "car_dealer",
    // "car_rental",
    // "car_repair",
    // "car_wash",
    "casino",
    "cemetery",
    "church",
    "cinema",
    // "city_hall",
    "clothing_store",
    // "convenience_store",
    // "courthouse",
    // "dentist",
    "department_store",
    "doctor",
    // "electrician",
    // "electronics_store",
    // "embassy",
    // "fire_station",
    // "flowers_store",
    // "funeral_service",
    // "furniture_store",
    // "gas_station",
    // "government_office",
    // "grocery_store",
    // "gym",
    // "hairdressing_salon",
    // "hardware_store",
    // "home_goods_store",
    // "hospital",
    // "insurance_agency",
    // "jewelry_store",
    // "laundry",
    // "lawyer",
    // "library",
    // "liquor_store",
    // "locksmith",
    "lodging",
    // "mosque",
    "museum",
    "night_club",
    "park",
    // "parking",
    // "pet_store",
    "pharmacy",
    // "plumber",
    // "police_station",
    // "post_office",
    // "primary_school",
    // "rail_station",
    // "real_estate_agency",
    "restaurant",
    // "rv_park",
    // "school",
    // "secondary_school",
    // "shoe_store",
    "shopping_center",
    "spa",
    "stadium",
    // "storage",
    "store",
    // "subway_station",
    "supermarket",
    "synagogue",
    // "taxi_stand",
    // "temple",
    "tourist_attraction",
    "train_station",
    "transit_station",
    // "travel_agency",
    // "university",
    // "veterinarian",
    "zoo",
  ];
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onValueSelect(option);
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
                selectedOption === option && styles.selected,
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
