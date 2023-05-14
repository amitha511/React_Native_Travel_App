import {
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import Row from "./Row";
import { Fragment, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { View } from "react-native-web";
import { Button } from "react-native";

export default function DetailsList() {
  const route = useRoute();
  const [list, setList] = useState(route.params);

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
        {console.log(list)}
        <ScrollView>
          {list.map((item, index) => (
            <Row
              key={index}
              title={item.name}
              image={require("../../assets/background3.jpg")}
              phone={item.phone_number}
              address={item.address}
              website={item.website}
            />
          ))}
          <Button
            title="Click Me"
            onPress={() => {
              // Add your onPress logic here
              console.log("Button Pressed");
            }}
          />
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
});
