import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

// screens
import LoginScreen from '../Screens/LoginScreen';
import Otp from '../Screens/Otp';
import UserName from '../Screens/UserName';
import {StatusBar} from 'react-native';

function AuthNav() {
  return (
    <>
      <StatusBar backgroundColor="white" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="Otp" component={Otp} />
        <Stack.Screen name="UserName" component={UserName} />
      </Stack.Navigator>
    </>
  );
}

export default AuthNav;
