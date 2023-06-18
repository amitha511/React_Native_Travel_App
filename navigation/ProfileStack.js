import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../screnns/Profile";
const Stack = createStackNavigator();

export const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile1"
        options={{
          headerShown: false,
        }}
        component={Profile}
      />
    </Stack.Navigator>
  );
};
