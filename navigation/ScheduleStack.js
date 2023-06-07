import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import BuildTripScreen from "../screnns/BuildTripScreen";
import DetailsList from "../components/Ui/DetailsList";
import { useState } from "react";
import Recommends from "../components/Recommends";
import Schedule from "../screnns/ScheduleScreen";
import ChangeAttraction from "../components/ChangeAttraction";
import ChangeMobility from "../components/ChangeMobility";
const Stack = createStackNavigator();

export const ScheduleStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Schedule" component={Schedule} />
      <Stack.Screen name="Change" component={ChangeAttraction} />
      <Stack.Screen name="Details" component={DetailsList} />
      <Stack.Screen name="Mobility" component={ChangeMobility} />
    </Stack.Navigator>
  );
};
