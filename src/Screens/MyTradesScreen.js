import * as React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import OpenOrdersTrades from './OpenOrdersTrades';
import PositionsHistory from './PositionsHistory';
import OrdersHistoryTrades from './OrdersHistoryTrades';
import TradeHistory from './TradeHistory';
import TradeTransactions from './TradeTransactions';

const Tab = createMaterialTopTabNavigator();

function MyTradesScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          textTransform: 'capitalize',
          fontSize: 14,
          fontFamily: 'Roboto',
          fontWeight: '500',
        },
        tabBarIndicatorStyle: {
          backgroundColor: 'rgba(0, 33, 94, 1)',
        },
        tabBarActiveTintColor: 'rgba(0, 33, 94, 1)',
        tabBarInactiveTintColor: 'rgba(109, 109, 109, 1)',
        tabBarStyle: {
          justifyContent: 'center',
          backgroundColor: 'white',
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: 'center',
          width: 'auto',
          height: 60,
        },
        tabBarScrollEnabled: true,
      }}>
      <Tab.Screen name="Open Orders" component={OpenOrdersTrades} />
      <Tab.Screen name="Positions History " component={PositionsHistory} />
      <Tab.Screen name="Orders History" component={OrdersHistoryTrades} />
      <Tab.Screen name="Trade History" component={TradeHistory} />
      <Tab.Screen name="Transaction History" component={TradeTransactions} />
    </Tab.Navigator>
  );
}

export default MyTradesScreen;
