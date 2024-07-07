import React, {useCallback, useContext, useState} from 'react';
import {FlatList, StyleSheet, Text, View, Alert} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';

// component
import CompletedMarketItem from './CompletedMarketItem';

//
import {Context} from '../Context/Context';
import {ip} from '../config';

const CompletedMarket = () => {
  const {userToken} = useContext(Context);
  const [markets, setMarkets] = useState([]);

  const fetchCompletedMarketTransactions = async () => {
    try {
      const response = await axios.get(`${ip}/api/contract?status=completed`, {
        headers: {
          token: userToken,
        },
      });
      setMarkets(response.data);
    } catch (error) {
      console.log('fetchCompletedMarketTransactions error', error);
      Alert.alert(
        'API Error fetchCompletedMarketTransactions',
        error?.response?.data?.message || error?.message,
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCompletedMarketTransactions();
    }, []),
  );

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerText, {textAlign: 'left', width: '20%'}]}>
          Name
        </Text>
        <Text style={[styles.headerText, {textAlign: 'center', width: '35%'}]}>
          Last Price(BALL)
        </Text>
        <Text style={[styles.headerText, {textAlign: 'right', width: '30%'}]}>
          Expired Date
        </Text>
      </View>
      {markets.length > 0 ? (
        <View style={{flex: 1}}>
          <FlatList
            data={markets}
            keyExtractor={item => item._id}
            renderItem={({item}) => <CompletedMarketItem item={item} />}
          />
        </View>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No Completed Markets Available</Text>
        </View>
      )}
    </View>
  );
};

export default CompletedMarket;

const styles = StyleSheet.create({
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: 'gray',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '5%',
    borderBottomColor: 'rgba(230, 233, 239, 1)',
    borderBottomWidth: 1,
    paddingHorizontal: '3%',
  },
  headerText: {
    fontSize: 14,
    fontFamily: 'Roboto',
    textAlign: 'center',
    color: 'rgba(155, 155, 155, 1)',
    fontWeight: '500',
    paddingBottom: 15,
  },
});
