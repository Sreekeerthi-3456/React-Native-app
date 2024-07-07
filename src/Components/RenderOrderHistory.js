import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {convertTimestampToDate, getColor} from '../utils';
import {textStyle} from '../primaryStyle';

const RenderOrderHistory = ({item}) => {
  return (
    <View
      style={{
        paddingHorizontal: 10,
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
              {fontSize: 20, color: 'black', fontWeight: '700'},
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
            <Text></Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: getColor(item),
              width: 15,
              alignItems: 'center',
              borderRadius: 50,
              height: 15,
            }}></View>
          <Text style={styles.textStyle}>{item?.status}</Text>
        </View>
      </View>

      {/* quantity */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.textStyle}>Executed Quantity / Total Quantity</Text>
        <Text
          style={[
            styles.textStyle,
            {fontWeight: '700', color: 'rgba(37, 37, 37, 1)'},
          ]}>
          {item?.executedQuantity} / {item?.quantity}
        </Text>
      </View>

      {/* price */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.textStyle}>Price / Executed Price</Text>
        <Text
          style={[
            styles.textStyle,
            {fontWeight: '700', color: 'rgba(37, 37, 37, 1)'},
          ]}>
          {isNaN(parseFloat(item?.price)?.toFixed(3))
            ? '--'
            : parseFloat(item?.price)?.toFixed(3)}{' '}
          /{' '}
          {isNaN(parseFloat(item?.executedPrice).toFixed(3))
            ? '--'
            : parseFloat(item?.executedPrice).toFixed(3)}
        </Text>
      </View>

      {/* timestamp */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.textStyle}>Date & Time</Text>
        <Text
          style={[
            styles.textStyle,
            {fontWeight: '700', color: 'rgba(37, 37, 37, 1)'},
          ]}>
          {item?.updatedTimestamp
            ? convertTimestampToDate(item?.updatedTimestamp)
            : convertTimestampToDate(item?.timestamp)}
        </Text>
      </View>
    </View>
  );
};

export default RenderOrderHistory;

const styles = StyleSheet.create({
  textStyle: {
    ...textStyle,
    color: 'rgba(109, 109, 109, 1)',
  },
});
