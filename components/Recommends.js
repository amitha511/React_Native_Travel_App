import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import RowHome from "./Ui/RowHome";

function Recommends(props) {
  const recommends = props.dataApi;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={true}
        style={styles.scrollView}
        showsHorizontalScrollIndicator={false}
      >
        {recommends.map((item) => {
          return (
            <RowHome
              key={item.place_id}
              title={item.name}
              image={item.photos}
              address={item.vicinity}
              rating={item.rating}
              openingHours={item.opening_hours}
              type={item.types[0]}
            ></RowHome>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default Recommends;

const styles = StyleSheet.create({
  container: {
    margin: 5,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  scrollView: {
    margin: 5,
  },
  content: {
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
