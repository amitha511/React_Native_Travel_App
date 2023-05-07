import React, { useContext } from "react";
import { View, Text } from "react-native";
import { UserContext } from "../App";

function HomeScreen() {
  const { userConnect, setUserConnect } = useContext(UserContext);
  return (
    <View>
      <Text>home page</Text>
      <Text>email user connect : {userConnect}</Text>
    </View>
  );
}

export default HomeScreen;
