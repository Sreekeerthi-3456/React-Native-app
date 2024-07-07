import React, {useContext, useEffect, useRef, useState} from 'react';
import {AppState, Image, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

import MarketScreen from '../Screens/MarketScreen';
import WalletScreen from '../Screens/WalletScreen';
import MyTradesScreen from '../Screens/MyTradesScreen';

// context
import {Context} from '../Context/Context';

// socket connect
import {connectSocket, liveContractSocket, adminSocket} from '../socket/socket';

const Tab = createBottomTabNavigator();

function getTabBarVisibility(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomeScreen';
  if (
    routeName === 'TimmerScreen' ||
    routeName === 'Withdraw' ||
    routeName === 'Deposit' ||
    routeName === 'History'
  ) {
    return 'none';
  }
  return 'flex';
}

function HomeNav() {
  const {userToken, setSocket, socket} = useContext(Context);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log('nex', nextAppState, nextAppState == 'background');
      if (nextAppState == 'background') {
        socket.emit('disconnect-user');
        socket.disconnect();

        // disconnect to liveContracts
        liveContractSocket.disconnect();

        // disconnect to adminSocket
        adminSocket.disconnect();
      } else {
        // connectToSocket
        let socketInternal = connectSocket(userToken);
        setSocket(socketInternal);

        // connect to liveContracts
        liveContractSocket.connect();
        liveContractSocket.emit('liveContracts', {});

        // connect candleStick socket
        adminSocket.connect();
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState2', appState.current, appStateVisible);
    });
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        animation: 'none',
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 80,
          display: getTabBarVisibility(route),
        },
        tabBarLabelStyle: {
          textTransform: 'capitalize',
          fontSize: 13.5,
          fontFamily: 'Roboto',
          fontWeight: '500',
          textAlign: 'center',
          bottom: 15,
        },
        tabBarActiveTintColor: 'rgba(0, 33, 94, 1)',
        tabBarInactiveTintColor: 'rgba(0, 33, 94, 0.5)',
      })}>
      <Tab.Screen
        name="Market"
        component={MarketScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={require('../assets/market.png')}
                style={{width: 25, height: 15, opacity: focused ? 1 : 0.5}}
              />
            </View>
          ),
          tabBarLabel: 'Market',
        }}
      />
      <Tab.Screen
        name="My Trades"
        component={MyTradesScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={require('../assets/mytrades.png')}
                style={{width: 15, height: 20, opacity: focused ? 1 : 0.5}}
              />
            </View>
          ),
          tabBarLabel: 'My Trades',
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={require('../assets/wallet.png')}
                style={{width: 20, height: 20, opacity: focused ? 1 : 0.5}}
              />
            </View>
          ),
          tabBarLabel: 'Wallet',
        }}
      />
    </Tab.Navigator>
  );
}

export default HomeNav;
