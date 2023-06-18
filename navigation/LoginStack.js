import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screnns/LoginScreen";
import RegisterScreen from "../screnns/RegisterScreen";
import WelcomeScreen from "../screnns/WelcomeScreen";
const Stack = createStackNavigator();

export const LoginStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};
