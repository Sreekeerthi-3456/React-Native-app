import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import {textStyle} from '../primaryStyle';

const TransactionComponent = ({route}) => {
  const navigation = useNavigation();

  async function navigateToOnchainTxHash(txHash) {
    await Linking.openURL(`https://bscscan.com/tx/${txHash}`);
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <Text style={[styles.header, {textTransform: 'capitalize'}]}>
            {route.params.item.comments}
          </Text>
        </View>

        <Text style={styles.label}>Transaction ID</Text>
        <Text style={styles.value}>{route.params?.item?._id}</Text>

        <Text style={styles.label}>You Received Money from</Text>
        <Text style={styles.value}>{route.params?.item?.from}</Text>

        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>
          {route.params?.item?.amount} {route.params?.item?.symbol}
        </Text>

        <Text style={styles.label}>Network Fee:</Text>
        <Text style={styles.value}>
          {route.params?.item?.networkfee
            ? `${route.params?.item?.networkfee} BALL`
            : '--'}
        </Text>

        <Text style={styles.label}>Transaction Hash:</Text>
        {route.params?.item?.transactionHash ? (
          <TouchableOpacity
            style={[styles.value]}
            onPress={() =>
              navigateToOnchainTxHash(route.params?.item?.transactionHash)
            }>
            <Text style={[styles.textStyle, styles.hash]}>
              {route.params?.item?.transactionHash}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text>--</Text>
        )}

        <Text style={styles.label}>Status:</Text>
        <Text
          style={[
            styles.status,
            {color: route.params?.item?.status === 'failed' ? 'red' : 'green'},
          ]}>
          {route.params?.item?.status === 'failed' ? 'failed' : 'success'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    marginHorizontal: '5%',
    marginTop: '5%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 30,
    textAlign: 'center',
    paddingBottom: 15,
    color: 'rgba(16, 16, 16, 1)',
  },
  header: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
    color: 'rgba(37, 37, 37, 1)',
    fontFamily: 'Roboto',
  },
  label: {
    fontSize: 13,
    color: 'rgba(81, 81, 81, 0.5)',
    marginTop: 10,
    fontWeight: '400',
    fontFamily: 'Roboto',
  },
  value: {
    fontSize: 14.5,
    color: 'rgba(81, 81, 81, 1)',
    fontWeight: '400',
    fontFamily: 'Roboto',
  },
  hash: {
    color: 'rgba(240, 68, 56, 1)',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(240, 68, 56, 1)',
    width: '100%',
  },
  status: {
    fontSize: 14,
    color: 'rgba(18, 183, 106, 1)',
  },
  textStyle: {
    ...textStyle,
  },
});

export default TransactionComponent;
