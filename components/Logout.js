import React, { useEffect } from "react";
import { View, Text } from "react-native";

const LogoutScreen = ({ navigation }) => {
  useEffect(() => {
    // Perform logout actions (e.g., clear tokens, remove session data)
    // ...

    // Navigate to a different screen after logout (optional)
    navigation.navigate("Login");
  }, []);

  return (
    <View>
      <Text>Logging out...</Text>
    </View>
  );
};

export default LogoutScreen;
