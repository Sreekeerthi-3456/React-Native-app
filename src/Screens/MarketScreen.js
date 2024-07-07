import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import TimmerScreen from './TimmerScreen';
import ContractHome from './ContractHome';
import Deposit from '../Components/Deposit';
import RenderChart from './RenderChart';

const Stack = createStackNavigator();

function MarketScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="TimmerScreen" component={TimmerScreen} />
      <Stack.Screen name="ContractHome" component={ContractHome} />
      <Stack.Screen name="RenderChart" component={RenderChart} />
      <Stack.Screen name="Deposit" component={Deposit} />
    </Stack.Navigator>
  );
}
export default MarketScreen;
