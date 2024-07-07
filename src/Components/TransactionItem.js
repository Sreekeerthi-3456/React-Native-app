import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {convertTimestampToDate, displayNumberUpToNDecimals} from '../utils';
import {textStyle} from '../primaryStyle';

const TransactionItem = ({item}) => {
  return (
    <View style={styles.orderContainer}>
      <View style={styles.header}>
        <Text style={[styles.textStyle, {fontSize: 16, fontWeight: '700'}]}>
          {item?.contractName}
        </Text>
      </View>
      <View style={{marginTop: 10}}>
        <View style={styles.orderDetail}>
          <Text style={styles.orderDetailTextLeft}>Type</Text>
          <Text
            style={[
              styles.orderDetailTextRight,
              {textTransform: 'capitalize'},
            ]}>
            {item?.comments}
          </Text>
        </View>

        <View style={styles.orderDetail}>
          <Text style={styles.orderDetailTextLeft}>Amount</Text>
          <Text style={styles.orderDetailTextRight}>
            {displayNumberUpToNDecimals(item?.amount, 4)}
          </Text>
        </View>

        <View style={[styles.orderDetail, {marginBottom: 5}]}>
          <Text style={styles.orderDetailTextLeft}>Date & Time</Text>
          <Text style={styles.orderDetailTextRight}>
            {convertTimestampToDate(item?.timestamp)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TransactionItem;

const styles = StyleSheet.create({
  orderContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(230, 233, 239, 1)',
    marginTop: '3%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  coinText: {
    fontSize: 20,
    fontFamily: 'Roboto',
    fontWeight: '700',
    color: 'rgba(37, 37, 37, 1)',
    lineHeight: 18.75,
  },
  textStyle: {
    ...textStyle,
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
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Roboto',
    color: 'rgba(109, 109, 109, 1)',
  },
  orderDetailTextRight: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: 'rgba(81, 81, 81, 1)',
    paddingVertical: 3,
  },
});
