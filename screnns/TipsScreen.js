import React, { useContext } from "react";
import { View, Text } from "react-native";
import { UserContext } from "../App";
import DetailsList from "../components/Ui/DetailsList";
function TipsScreen() {
  const { userConnect, setUserConnect } = useContext(UserContext);
  const obj = [
    {
      title: "sshi",
      image: require("../assets/background3.jpg"),
      phone: "052465",
      website: "sss",
      address: "ddfd 123",
    },
  ];
  return (
    <View>
      <Text>Tips page</Text>
      <DetailsList list={obj}></DetailsList>
    </View>
  );
}

export default TipsScreen;
