import React, {useContext, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {convertTimestampToDate} from '../utils';

import axios from 'axios';

import {textStyle} from '../primaryStyle';
import OpenOrderCloseModal from './OpenOrderCloseModal';

import {ip} from '../config';

import {Context} from '../Context/Context';

const OpenOrderComponent = ({item, functionToCall}) => {
  const {userToken} = useContext(Context);

  const [cancelOpenOrder, setCancelOpenOrder] = useState(false);

  async function cancelOrder() {
    try {
      let result = await axios.patch(
        `${ip}/api/contract/order/cancel/${item._id}`,
        {},
        {
          headers: {token: userToken},
        },
      );

      console.log(result.data);
    } catch (e) {
      console.log('Error in cancel Order');
      Alert.alert(
        'API Error cancelOrder',
        e.response.data.message || e.message,
      );
    } finally {
      functionToCall();
      setCancelOpenOrder(false);
    }
  }

  if (cancelOpenOrder) {
    return (
      <OpenOrderCloseModal
        cancelOpenOrder={cancelOpenOrder}
        setCancelOpenOrder={setCancelOpenOrder}
        cancelOrder={cancelOrder}
      />
    );
  }

  return (
    <View
      style={{
        paddingHorizontal: 5,
        gap: 10,
        paddingVertical: 15,
        borderBottomWidth: 0.5,
      }}>
      {/* Token symbol and cancel button */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{gap: 3}}>
          <Text
            style={[
              styles.textStyle,
              {color: 'rgba(37, 37, 37, 1)', fontSize: 20, fontWeight: '700'},
            ]}>
            {item?.symbol}
          </Text>
          <View style={{flexDirection: 'row', gap: 10}}>
            <Text
              style={{
                color:
                  item?.side === 'short'
                    ? 'rgba(242, 83, 81, 1)'
                    : 'rgba(18, 183, 106, 1)',
                textTransform: 'capitalize',
              }}>
              {item?.type} / {item?.side}
            </Text>
            <Text>{convertTimestampToDate(item?.timestamp)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(230, 233, 239, 1)',
            width: '15%',
            alignItems: 'center',
            borderRadius: 5,
            height: 25,
            justifyContent: 'center',
          }}
          onPress={() => setCancelOpenOrder(true)}>
          <Text style={[styles.textStyle, {fontSize: 12}]}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* price */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.textStyle}>Price</Text>
        <Text
          style={[
            styles.textStyle,
            {fontWeight: '700', color: 'rgba(81, 81, 81, 1)'},
          ]}>
          {parseFloat(item?.price).toFixed(4)}
        </Text>
      </View>

      {/* Quantity */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.textStyle}>Quantity</Text>
        <Text
          style={[
            styles.textStyle,
            {fontWeight: '700', color: 'rgba(81, 81, 81, 1)'},
          ]}>
          {parseFloat(item?.quantity).toFixed(4)}
        </Text>
      </View>

      {/* Filled */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row', gap: 5}}>
          <Text style={styles.textStyle}>Filled</Text>
          <View
            style={{
              backgroundColor: 'rgba(84, 106, 147, 0.2)',
              borderRadius: 30,
              width: 'auto',
              alignItems: 'center',
            }}>
            <Text style={[styles.textStyle, {paddingHorizontal: 5}]}>
              {parseFloat(
                (item?.executedQuantity * 100) / item?.quantity,
              ).toFixed(1)}
              %
            </Text>
          </View>
        </View>
        <Text
          style={[
            styles.textStyle,
            {fontWeight: '700', color: 'rgba(81, 81, 81, 1)'},
          ]}>
          {parseFloat(item?.executedQuantity).toFixed(4)}
        </Text>
      </View>
    </View>
  );
};

export default OpenOrderComponent;

const styles = StyleSheet.create({
  textStyle: {
    ...textStyle,
    color: 'rgba(109, 109, 109, 1)',
  },
});
