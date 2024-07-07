import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {convertTimestampToDate} from '../utils';

const HistoryItem = ({item}) => {
  // const tradeType = item?.side === 'short' ? 'Limit/short' : 'Limit/long';
  // const isFilled = item?.status === 'FILLED' ? 'Filled' : 'Pending';
  // const circleColor =
  //   isFilled === 'Filled' ? 'rgba(18, 183, 106, 1)' : 'rgba(109, 109, 109, 1)';

  return (
    <View style={styles.orderContainer}>
      <View style={styles.header}>
        <Text style={styles.coinText}>{item?.symbol}</Text>
        <TouchableOpacity style={styles.cancelButton}>
          <View
            style={{
              backgroundColor: circleColor,
              width: 8,
              height: 8,
              borderRadius: 4,
            }}
          />
          <Text style={styles.cancelButtonText}>{isFilled}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tradeDetails}>
        <View style={styles.tradeTypeContainer}>
          <Text
            style={[
              styles.tradeType,
              {
                color: tradeType.includes('Buy')
                  ? 'rgba(18, 183, 106, 1)'
                  : 'rgba(240, 68, 56, 1)',
              },
            ]}>
            {tradeType}
          </Text>
        </View>
      </View>
      <View style={{marginTop: 10}}>
        <View style={styles.orderDetail}>
          <Text style={styles.orderDetailTextLeft}>Executed / Amount</Text>
          <Text style={styles.orderDetailTextRight}>
            {item?.executedQuantity} / {item?.quantity}
          </Text>
        </View>
        <View style={styles.orderDetail}>
          <Text style={styles.orderDetailTextLeft}>Average / Price</Text>
          <Text style={styles.orderDetailTextRight}>
            {item?.executedPrice.toFixed(2)}
          </Text>
        </View>
        <View style={[styles.orderDetail, {marginBottom: 5}]}>
          <Text style={styles.orderDetailTextLeft}>Date & Time</Text>
          <Text style={styles.orderDetailTextRight}>
            {convertTimestampToDate(item?.date)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default HistoryItem;

const styles = StyleSheet.create({
  orderContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(230, 233, 239, 1)',
    marginTop: '5%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  coinText: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: 'rgba(37, 37, 37, 1)',
    lineHeight: 18.75,
  },
  cancelButton: {
    borderRadius: 3,
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: 'rgba(81, 81, 81, 1)',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  tradeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tradeTypeContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  tradeType: {
    fontFamily: 'Roboto',
    fontSize: 13,
    fontWeight: '400',
  },
  tradeDate: {
    color: 'rgba(152, 152, 154, 1)',
    fontFamily: 'Roboto',
    fontSize: 13,
    fontWeight: '400',
  },
  orderDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filledContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filledPercentage: {
    width: 29,
    height: 13,
    backgroundColor: 'rgba(84, 106, 147, 0.2)',
    borderRadius: 39,
    marginLeft: 5,
    justifyContent: 'center',
  },
  filledText: {
    fontFamily: 'Roboto',
    fontSize: 10,
    fontWeight: '400',
    color: 'rgba(0, 14, 39, 1)',
    textAlign: 'center',
  },
  orderDetailTextLeft: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Roboto',
    color: 'rgba(109, 109, 109, 1)',
  },
  orderDetailTextRight: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: 'rgba(81, 81, 81, 1)',
    paddingVertical: 3,
  },
});
