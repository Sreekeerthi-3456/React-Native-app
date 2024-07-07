import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Alert, FlatList, Image, StyleSheet, Text, View} from 'react-native';
import TradeItem from '../Components/TradeItem';
import {ip} from '../config';
import {Context} from '../Context/Context';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';

const TradeHistory = () => {
  const {userToken} = useContext(Context);

  const [tradeHistoryData, setTradesData] = useState();

  const fetchTradesHistory = async () => {
    try {
      const response = await axios.get(`${ip}/api/users/trades`, {
        headers: {
          token: userToken,
        },
      });

      setTradesData(response.data);
    } catch (error) {
      console.log('fetchTradesHistory error', error);
      Alert.alert(
        'API Error fetchTradesHistory',
        error?.response?.data?.message || error?.message,
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTradesHistory();
    }, []),
  );

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      {tradeHistoryData?.length > 0 ? (
        <FlatList
          data={tradeHistoryData}
          keyExtractor={item => item._id}
          renderItem={({item}) => <TradeItem item={item} />}
          contentContainerStyle={{marginHorizontal: '5%'}}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Image
            source={require('../assets/noData.png')}
            style={styles.noDataImage}
          />
          <Text style={styles.noDataText}>No Trade History</Text>
        </View>
      )}
    </View>
  );
};
export default TradeHistory;

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
