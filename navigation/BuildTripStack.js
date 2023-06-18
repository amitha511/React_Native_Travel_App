import { createStackNavigator } from "@react-navigation/stack";
import BuildTripScreen from "../screnns/BuildTripScreen";
const Stack = createStackNavigator();

export const BuildTripStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="NewTrip" component={BuildTripScreen} />
    </Stack.Navigator>
  );
};
