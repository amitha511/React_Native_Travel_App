import React, { useContext } from "react";
import { View, Text } from "react-native";
import { UserContext } from "../App";
function HomeScreen() {
  //const { userConnect, setUserConnect } = useContext(UserContext);

  return (
    <View>
      <View></View>
      <Text>home page</Text>
      {/* <Text>email user connect : {userConnect}</Text> */}
      <Text>email user connect :</Text>
    </View>
  );
}

export default HomeScreen;
