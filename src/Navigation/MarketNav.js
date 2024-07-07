import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {StyleSheet} from 'react-native';
import Market from '../Components/Market';
import CompletedMarket from '../Components/CompletedMarket';

const MarketNav = () => {
  const Tab = createMaterialTopTabNavigator();

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
          backgroundColor: 'white',
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: 'center',
        },
      }}>
      <Tab.Screen name="Market" component={Market} />
      <Tab.Screen name="Completed Market" component={CompletedMarket} />
    </Tab.Navigator>
  );
};

export default MarketNav;

const styles = StyleSheet.create({});
