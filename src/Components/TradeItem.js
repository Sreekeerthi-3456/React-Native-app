import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {convertTimestampToDate} from '../utils';

const TradeItem = ({item}) => {
  return (
    <View style={styles.orderContainer}>
      <View style={styles.header}>
        <Text style={styles.coinText}>{item?.symbol}</Text>
      </View>
      <View style={styles.tradeDetails}>
        <View style={styles.tradeTypeContainer}>
          <Text
            style={[
              styles.tradeType,
              {
                color:
                  item.side == 'long'
                    ? 'rgba(18, 183, 106, 1)'
                    : 'rgba(240, 68, 56, 1)',
              },
            ]}>
            {item?.type} / {item?.side}
          </Text>
        </View>
      </View>
      <View style={{marginTop: 10}}>
        <View style={styles.orderDetail}>
          <Text style={styles.orderDetailTextLeft}>Price</Text>
          <Text style={styles.orderDetailTextRight}>
            {item?.executedPrice?.toFixed(4)}
          </Text>
        </View>
        <View style={styles.orderDetail}>
          <Text style={styles.orderDetailTextLeft}>Filled(BALL)</Text>
          <Text style={styles.orderDetailTextRight}>
            {item?.executedQuantity?.toFixed(4)}
          </Text>
        </View>
        <View style={styles.orderDetail}>
          <Text style={styles.orderDetailTextLeft}>Quote Quantity</Text>
          <Text style={styles.orderDetailTextRight}>
            {item?.quoteQuantity?.toFixed(4)}
          </Text>
        </View>
        <View style={styles.orderDetail}>
          <Text style={styles.orderDetailTextLeft}>Realized PNL (BALL)</Text>
          <Text style={styles.orderDetailTextRight}>
            {item?.realizedPnl?.toFixed(4)}
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

const styles = StyleSheet.create({
  orderContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(230, 233, 239, 1)',
    marginTop: '3%',
    paddingHorizontal: 10,
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
  orderDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

export default TradeItem;
