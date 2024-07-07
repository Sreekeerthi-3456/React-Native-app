import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Alert, FlatList, Image, StyleSheet, Text, View} from 'react-native';
import TransactionItem from '../Components/TransactionItem';
import {ip} from '../config';
import {Context} from '../Context/Context';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';

const TradeTransactions = () => {
  const {userToken} = useContext(Context);

  const [transactionData, setTransactionData] = useState([]);
  const fetchTranssactionHistory = async () => {
    try {
      const response = await axios.get(
        `${ip}/api/users/transactions?type=trades`,
        {
          headers: {
            token: userToken,
          },
        },
      );

      setTransactionData(response.data);
    } catch (error) {
      console.log('TransactionHistory error', error);
      Alert.alert(
        'API Error TransactionHistory',
        error?.response?.data?.message || error?.message,
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTranssactionHistory();
    }, []),
  );

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      {transactionData.length > 0 ? (
        <FlatList
          data={transactionData}
          keyExtractor={item => item._id}
          renderItem={({item}) => <TransactionItem item={item} />}
          contentContainerStyle={{marginHorizontal: '5%'}}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Image
            source={require('../assets/noData.png')}
            style={styles.noDataImage}
          />
          <Text style={styles.noDataText}>No Transaction History</Text>
        </View>
      )}
    </View>
  );
};

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

export default TradeTransactions;
