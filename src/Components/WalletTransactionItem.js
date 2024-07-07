import {useNavigation} from '@react-navigation/native';
import React, {useContext} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {convertTimestampToDate, displayNumberUpToNDecimals} from '../utils';
import {Context} from '../Context/Context';

const WalletTransactionItem = ({item, isFirst, isLast}) => {
  const {userId} = useContext(Context);
  const navigation = useNavigation();

  function getTxColor(item) {
    if (item?.status && item?.status === 'failed') {
      return 'rgba(240, 68, 56, 1)';
    } else if (item.from?.toString() === userId.toString()) {
      return 'rgba(240, 68, 56, 1)';
    } else if (
      (item.to?.toString() === userId.toString() && item.amount > 0) ||
      item?.type === 'deposit'
    ) {
      return 'rgba(18, 183, 106, 1)';
    } else if (
      (item.to?.toString() === userId.toString() && item.amount < 0) ||
      item?.type === 'withdraw'
    ) {
      return 'rgba(240, 68, 56, 1)';
    } else {
      return 'black';
    }
  }

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('TransactionComponent', {item: item})}>
      <View
        style={[
          styles.transactionContainer,
          !isFirst && styles.topBorder,
          !isLast && styles.bottomBorder,
        ]}>
        <Image source={require('../assets/ball.png')} style={styles.icon} />
        <View style={styles.detailsContainer}>
          <Text style={styles.itemTitle}>{item?.symbol}</Text>
          <Text style={styles.itemType}>{item?.comments}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text
            style={[
              styles.amount,
              {
                color: getTxColor(item),
              },
            ]}>
            {item?.amount && displayNumberUpToNDecimals(item?.amount, 6)}
          </Text>
          <Text style={styles.date}>
            {convertTimestampToDate(item?.timestamp)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  transactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    marginHorizontal: 0,
  },
  topBorder: {
    borderTopColor: 'lightgrey',
    borderTopWidth: 0.5,
  },
  bottomBorder: {
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 0.5,
  },
  icon: {
    width: 40,
    height: 40,
    marginLeft: '5%',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
  },
  itemTitle: {
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Roboto',
    color: 'rgba(37, 37, 37, 1)',
  },
  itemType: {
    fontWeight: '500',
    fontSize: 10,
    fontFamily: 'Roboto',
    color: 'rgba(81, 81, 81, 1)',
  },
  amountContainer: {
    alignItems: 'flex-end',
    marginRight: '5%',
  },
  amount: {
    fontWeight: '500',
    fontSize: 18,
    fontFamily: 'Roboto',
  },
  date: {
    fontWeight: '500',
    fontSize: 10,
    fontFamily: 'Roboto',
    color: 'rgba(81, 81, 81, 1)',
  },
});

export default WalletTransactionItem;
