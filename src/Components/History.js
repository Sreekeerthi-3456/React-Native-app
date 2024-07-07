import React, {useContext, useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import axios from 'axios';

import WalletHistoryItem from './WalletHistoryItem';

import {Context} from '../Context/Context';
import {ip} from '../config';

const History = () => {
  const navigation = useNavigation();
  const {userToken} = useContext(Context);

  const [historyData, setHistoryData] = useState([]);

  const fetchWalletTransactionsHistory = async () => {
    try {
      const response = await axios.get(`${ip}/api/users/transactions`, {
        headers: {
          token: userToken,
        },
      });

      setHistoryData(response.data);
    } catch (error) {
      console.log('fetchWalletTransactionsHistory error ', error);
      Alert.alert(
        'API Error fetchWalletTransactionsHistory',
        error?.response?.data?.message || error?.message,
      );
    }
  };

  useEffect(() => {
    fetchWalletTransactionsHistory();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('WalletIndex')}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>History</Text>
      </View>
      {historyData.length > 0 ? (
        <FlatList
          data={historyData}
          renderItem={({item, index}) => (
            <WalletHistoryItem
              item={item}
              isFirst={index === 0}
              isLast={index === historyData.length - 1}
            />
          )}
          keyExtractor={item => item._id}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No Recent Transactions</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '5%',
    marginHorizontal: '5%',
    marginTop: '5%',
  },
  backArrow: {
    fontSize: 30,
    color: 'rgba(16, 16, 16, 1)',
    paddingBottom: 15,
  },
  headerText: {
    fontSize: 18,
    marginLeft: 10,
    fontFamily: 'Roboto',
    color: 'rgba(37, 37, 37, 1)',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: 'lightgrey',
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  noDataText: {
    color: 'rgba(176, 186, 205, 1)',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default History;
