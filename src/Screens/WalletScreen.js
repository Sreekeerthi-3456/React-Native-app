import {StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import WalletIndex from './WalletIndex';
import Withdraw from '../Components/Withdraw';
import Deposit from '../Components/Deposit';
import History from '../Components/History';
import TransactionComponent from '../Components/TransactionComponent';

const Stack = createStackNavigator();

const WalletNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}>
      <Stack.Screen name="WalletIndex" component={WalletIndex} />
      <Stack.Screen name="Withdraw" component={Withdraw} />
      <Stack.Screen name="Deposit" component={Deposit} />
      <Stack.Screen name="History" component={History} />
      <Stack.Screen
        name="TransactionComponent"
        component={TransactionComponent}
      />
    </Stack.Navigator>
  );
};

export default WalletNav;

const styles = StyleSheet.create({});
