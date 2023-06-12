import React, { Fragment, useState, useEffect } from "react";
import {
  Text,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";

import Row from "./Row";
import { ip } from "../../App";
export default function DetailsList() {
  const route = useRoute();
  const { dataList, id, attractionIndex, dayIndex } = route.params;
  const [list, setList] = useState(dataList);

  const handleButtonClick = async (item) => {
    let oneItem = {
      id: id,
      num: attractionIndex,
      attraction: item,
      dayIndex: dayIndex,
    };
    console.log("click!");
    console.log(id);
    try {
      await axios
        .post(`http://${ip}:4000/travel/update`, oneItem)
        .then((response) => {
          console.log(`updated!`);
        });
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.log(error.response.status);
        console.log(error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an error
        console.log("Error", error.message);
      }
    }
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
                key={item.place_id}
                title={item.name}
                image={item.photos}
                address={item.vicinity}
                rating={item.rating}
                businessStatus={item.business_status}
                type={item.types[0]}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleButtonClick(item)}
              >
                <Text style={styles.buttonText}>Update!</Text>
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
