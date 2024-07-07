import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import axios from 'axios';

// ip
import {ip} from '../config';

// context
import {Context} from '../Context/Context';
import {textStyle} from '../primaryStyle';
import OpenOrderComponent from './OpenOrderComponent';
import {useFocusEffect} from '@react-navigation/native';

const OpenOrders = ({route}) => {
  const {socket, userToken} = useContext(Context);

  const [isLoading, setIsLoading] = useState(false);
  const [openOrders, setOpenOrders] = useState([]);

  socket.on('open-orders', data => {
    let existingOpenOrders = openOrders;

    // check if data exists in orders
    let isExistingOrder = existingOpenOrders.find(el => el._id == data._id);
    if (isExistingOrder) {
      let index = existingOpenOrders
        .map(e => e._id.toString())
        .indexOf(data._id.toString());

      if (data.status === 'FILLED') {
        existingOpenOrders.splice(index, 1);
      } else {
        existingOpenOrders.splice(index, 1, data);
      }
    } else {
      if (data.status !== 'FILLED') {
        existingOpenOrders.unshift(data);
      }
    }

    setOpenOrders([...existingOpenOrders]);
  });

  async function getOpenOrders() {
    try {
      setIsLoading(true);
      let contractId = route.params.contractId;

      let result = await axios.get(
        `${ip}/api/contract/${contractId}/open-orders`,
        {
          headers: {token: userToken},
        },
      );

      setOpenOrders(result.data);
    } catch (e) {
      Alert.alert(
        'API Error getOpenOrders',
        e?.response?.data?.message || e.message,
      );
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getOpenOrders();
    }, []),
  );

  return (
    <View style={styles.canvas}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : openOrders.length ? (
        <ScrollView>
          <View style={styles.ordersContainer}>
            {openOrders.map((el, index) => {
              return (
                <OpenOrderComponent
                  key={index}
                  item={el}
                  functionToCall={getOpenOrders}
                />
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.noDataContainer}>
          <Image source={require('../assets/noData.png')} />
          <Text style={styles.noDataText}>No OpenOrders</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  canvas: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
  loadingContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  ordersContainer: {
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: 'white',
    flexGrow: 1,
    marginTop: '0%',
    marginBottom: 0,
    alignSelf: 'center',
  },
  noDataText: {
    ...textStyle,
    color: 'rgba(176, 186, 205, 1)',
  },
  textStyle: {
    ...textStyle,
  },
});

export default OpenOrders;
