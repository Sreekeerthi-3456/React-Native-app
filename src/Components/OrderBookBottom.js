import React, {createContext} from 'react';
import {StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

// components
import OpenOrders from './OpenOrders';
import Positions from './Positions';
import OrderHistory from './OrderHistory';

export const BeaconContext = createContext();

const Tab = createMaterialTopTabNavigator();

const UserOrderHistoryDetails = ({
  contractId,
  setShowClosePosition,
  setCloseData,
}) => {
  return (
    <BeaconContext.Provider value={{setShowClosePosition, setCloseData}}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: 'rgba(255, 255, 255, 1)',
            borderBottomWidth: 0.5,
            elevation: 0,
          },
          tabBarLabelStyle: {
            textTransform: 'none',
            fontSize: 15,
          },
          tabBarActiveTintColor: 'rgba(0, 33, 94, 1)',
          tabBarIndicatorStyle: {backgroundColor: 'rgba(0, 33, 94, 1)'},
          tabBarScrollEnabled: true,
        }}>
        <Tab.Screen
          name="Open Orders"
          component={OpenOrders}
          initialParams={{
            contractId: contractId,
          }}
        />
        <Tab.Screen
          name="Positions"
          component={Positions}
          initialParams={{
            contractId: contractId,
          }}
        />
        <Tab.Screen
          name="Order History"
          component={OrderHistory}
          initialParams={{
            contractId: contractId,
          }}
        />
      </Tab.Navigator>
    </BeaconContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
  },
  containerText: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 16.41,
    color: 'rgba(81, 81, 81, 1)',
    fontFamily: 'Roboto',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  selectedTab: {
    color: 'rgba(0, 33, 94, 1)',
    borderBottomColor: 'rgba(0, 33, 94, 1)',
    borderBottomWidth: 1,
  },
  cancelAllContainer: {
    alignSelf: 'flex-end',
    marginHorizontal: '5%',
    marginTop: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'grey',
  },
  cancelAllText: {
    color: 'rgba(0, 33, 94, 1)',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
  orderContainer: {
    marginHorizontal: '5%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(230, 233, 239, 1)',
  },
});

export default UserOrderHistoryDetails;
