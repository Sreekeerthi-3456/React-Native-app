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

// components
import RenderOrderHistory from './RenderOrderHistory';

// context
import {Context} from '../Context/Context';

// ip
import {ip} from '../config';
import {useFocusEffect} from '@react-navigation/native';

const OrderHistory = ({route}) => {
  const {userToken} = useContext(Context);

  const [isLoading, setIsLoading] = useState(false);
  const [orderhistory, setOrderhistory] = useState([]);

  async function getOrderHistory() {
    try {
      setIsLoading(true);
      let contractId = route.params.contractId;

      let result = await axios.get(
        `${ip}/api/contract/${contractId}/order-history`,
        {
          headers: {token: userToken},
        },
      );

      setOrderhistory(result.data);
    } catch (e) {
      console.log(e);
      Alert.alert('API Error getOpenOrders', e.message);
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getOrderHistory();
    }, []),
  );

  return (
    <View style={styles.canvas}>
      {isLoading ? (
        <View
          style={{
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" />
        </View>
      ) : !orderhistory.length ? (
        <View
          style={{
            gap: 5,
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}>
          <Image source={require('../assets/noData.png')} />
          <Text style={[styles.textStyle, {color: 'rgba(176, 186, 205, 1)'}]}>
            No Order History
          </Text>
        </View>
      ) : (
        <ScrollView>
          <View style={{paddingBottom: 20}}>
            {orderhistory?.map((el, index) => {
              return <RenderOrderHistory key={index} item={el} />;
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  canvas: {
    backgroundColor: 'white',
    height: '100%',
  },
});

export default OrderHistory;
