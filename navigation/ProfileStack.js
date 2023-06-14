import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../screnns/Profile";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        // options={{

        //   title: "My Profile",
        //   headerStyle: {
        //     backgroundColor: "#f4511e",
        //   },
        //   headerTintColor: "#fff",
        //   headerTitleStyle: {
        //     fontWeight: "bold",
        //   },
        // }}

        component={Profile}
      />
      {/* <Stack.Screen name="trip" component={DetailsList} /> */}
    </Stack.Navigator>
  );
};
