import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import BuildTripScreen from "../screnns/BuildTripScreen";
import DetailsList from "../components/Ui/DetailsList";
import { useState } from "react";
import Recommends from "../components/Recommends";
import { ScheduleStack } from "./ScheduleStack";
const Stack = createStackNavigator();

export const BuildTripStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={BuildTripScreen} />
      {/* <Stack.Screen name="Details" component={DetailsList} />
      <Stack.Screen name="Schedule" component={Schedule} /> */}
    </Stack.Navigator>
  );
};
