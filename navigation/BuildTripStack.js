import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import BuildTripScreen from "../screnns/BuildTripScreen";
import DetailsList from "../components/Ui/DetailsList";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const BuildTripStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={BuildTripScreen} />
      <Stack.Screen name="Details" component={DetailsList} />
    </Stack.Navigator>
  );
};
