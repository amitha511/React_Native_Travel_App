import React, { useContext } from "react";
import { View, Text } from "react-native";
import { UserContext } from "../App";

function TipsScreen() {
  const { userConnect, setUserConnect } = useContext(UserContext);
  return (
    <View>
      <Text>Tips page</Text>
    </View>
  );
}

export default TipsScreen;
