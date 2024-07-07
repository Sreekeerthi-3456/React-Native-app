import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Alert, FlatList, Image, StyleSheet, Text, View} from 'react-native';
import axios from 'axios';

// components
import OpenOrderComponent from '../Components/OpenOrderComponent';

// ip
import {ip} from '../config';

// context
import {Context} from '../Context/Context';
import {useFocusEffect} from '@react-navigation/native';

const OpenOrdersTrades = () => {
  const {userToken} = useContext(Context);
  const [orders, setOrders] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${ip}/api/users/open-orders`, {
        headers: {
          token: userToken,
        },
      });

      setOrders(response.data);
    } catch (error) {
      Alert.alert(
        'API Error OpenOrdersTrades',
        error?.response?.data?.message || error?.message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, []),
  );

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      {orders?.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <OpenOrderComponent item={item} functionToCall={fetchOrders} />
          )}
          contentContainerStyle={{marginHorizontal: '5%'}}
          onRefresh={() => fetchOrders()}
          refreshing={isloading}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Image
            source={require('../assets/noData.png')}
            style={styles.noDataImage}
          />
          <Text style={styles.noDataText}>No Open Orders</Text>
        </View>
      )}
    </View>
  );
};

export default OpenOrdersTrades;

const styles = StyleSheet.create({
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
