import React, {useCallback, useContext, useEffect, useState} from 'react';
import {StyleSheet, View, FlatList, Image, Text, Alert} from 'react-native';
import axios from 'axios';

// components
import HistoryItem from '../Components/HistoryItem';

// ip
import {ip} from '../config';

// context
import {Context} from '../Context/Context';
import RenderOrderHistory from '../Components/RenderOrderHistory';
import {useFocusEffect} from '@react-navigation/native';

const OrdersHistoryTrades = () => {
  const {userToken} = useContext(Context);
  const [trades, setTrades] = useState([]);

  const fetchTrades = async () => {
    try {
      const response = await axios.get(`${ip}/api/users/orders`, {
        headers: {
          token: userToken,
        },
      });

      setTrades(response?.data);
    } catch (error) {
      console.log(
        'trades error',
        error?.response?.data?.message || error.message,
      );
      Alert.alert(
        'API Error OrdersHistoryTrades',
        error?.response?.data?.message || error.message,
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTrades();
    }, []),
  );

  return (
    <View style={styles.container}>
      {trades.length > 0 ? (
        <FlatList
          data={trades}
          keyExtractor={item => item._id}
          renderItem={({item}) => <RenderOrderHistory item={item} />}
          contentContainerStyle={{marginHorizontal: '5%'}}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Image
            source={require('../assets/noData.png')}
            style={styles.noDataImage}
          />
          <Text style={styles.noDataText}>No Order History</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  noDataImage: {
    width: 50,
    height: 58,
    resizeMode: 'contain',
  },
  noDataText: {
    color: 'rgba(176, 186, 205, 1)',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 13,
  },
});

export default OrdersHistoryTrades;
