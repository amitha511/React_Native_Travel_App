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

export default function DetailsList() {
  const route = useRoute();
  const [list, setList] = useState(route.params);

  return (
    <Fragment>
      {console.log(list)}
      <ScrollView>
        {list.map((item, index) => (
          <Row
            key={index}
            title={item.name}
            // image={item.image}
            image={require("../../assets/background3.jpg")}
            phone={item.phone_number}
            address={item.address}
            website={item.website}
          />
        ))}
      </ScrollView>
    </Fragment>
  );
}
