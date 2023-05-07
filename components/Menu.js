import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

const Menu = ({ onValueSelect }) => {
  const options = [
    "bar",
    "beauty_salon",
    "bicycle_store",
    "book_store",
    "bowling",
    "bus_station",
    "cafe",
    "campground",
    "car_dealer",
    "car_rental",
    "car_repair",
    "car_wash",
    "casino",
    "cemetery",
    "church",
    "cinema",
    "city_hall",
    "clothing_store",
    "convenience_store",
    "courthouse",
    "dentist",
    "department_store",
    "doctor",
    "electrician",
    "electronics_store",
    "embassy",
    "fire_station",
    "flowers_store",
    "funeral_service",
    "furniture_store",
    "gas_station",
    "government_office",
    "grocery_store",
    "gym",
    "hairdressing_salon",
    "hardware_store",
    "home_goods_store",
    "hospital",
    "insurance_agency",
    "jewelry_store",
    "laundry",
    "lawyer",
    "library",
    "liquor_store",
    "locksmith",
    "lodging",
    "mosque",
    "museum",
    "night_club",
    "park",
    "parking",
    "pet_store",
    "pharmacy",
    "plumber",
    "police_station",
    "post_office",
    "primary_school",
    "rail_station",
    "real_estate_agency",
    "restaurant",
    "rv_park",
    "school",
    "secondary_school",
    "shoe_store",
    "shopping_center",
    "spa",
    "stadium",
    "storage",
    "store",
    "subway_station",
    "supermarket",
    "synagogue",
    "taxi_stand",
    "temple",
    "tourist_attraction",
    "train_station",
    "transit_station",
    "travel_agency",
    "university",
    "veterinarian",
    "zoo",
  ];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setIsMenuOpen(false);
    setSelectedOption(option);

    onValueSelect(option);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    setSelectedOption(null);
  };

  const handleMenuClose = () => {
    if (selectedOption) {
      handleCloseMenu();
    }
  };

  return (
    <View>
      {!isMenuOpen ? (
        <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
          <Text>Select an option:</Text>
          <Text style={{ fontWeight: "bold" }}>
            {selectedOption || "Click to open menu"}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={{ maxHeight: 200 }}>
          <ScrollView>
            <TouchableOpacity onPress={handleCloseMenu}>
              <Text>Close menu</Text>
            </TouchableOpacity>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => handleOptionSelect(option)}
                style={{
                  cursor: "pointer",
                  marginTop: 10,
                  paddingVertical: 5,
                }}
              >
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      {selectedOption && (
        <TouchableOpacity onPress={handleCloseMenu}>
          <Text>Close menu</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Menu;
