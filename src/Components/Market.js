import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import MarketItem from './MarketItem';
import {liveContractSocket} from '../socket/socket';
import {textStyle} from '../primaryStyle';
import {useFocusEffect} from '@react-navigation/native';

const Market = () => {
  const [markets, setMarkets] = useState([]);

  const [lastSocketUpdateTime, setLastSocketUpdateTime] = useState(Date.now());

  if (Date.now() / 1000 - lastSocketUpdateTime / 1000 >= 10) {
    console.log('it is been more than 10 seconds');
    liveContractSocket.emit('liveContracts', {});
  }

  useFocusEffect(
    useCallback(() => {
      liveContractSocket.on('liveContracts', data => {
        setLastSocketUpdateTime(Date.now());
        setMarkets(data);
      });
    }, []),
  );

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View style={styles.headerRow}>
        <Text style={[styles.textStyle, {width: '20%'}]}>Name</Text>
        <Text style={[styles.textStyle, {width: '35%'}]}>Last Price(BALL)</Text>
        <Text style={[styles.textStyle, {width: '20%'}]}>5m Chg%</Text>
      </View>
      {markets.length > 0 ? (
        <View style={{flex: 1}}>
          <FlatList
            data={markets}
            keyExtractor={item => item._id}
            renderItem={({item}) => <MarketItem market={item} />}
          />
        </View>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No Active Markets Available</Text>
        </View>
      )}
    </View>
  );
};

export default Market;

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
    paddingVertical: 15,
    borderBottomColor: 'rgba(230, 233, 239, 1)',
    borderBottomWidth: 1,
    paddingHorizontal: '3%',
  },

  textStyle: {
    ...textStyle,
    textAlign: 'center',
    color: 'rgba(155, 155, 155, 1)',
  },

  headerText: {
    fontSize: 10,
    fontFamily: 'Roboto',
    textAlign: 'center',
    color: 'rgba(155, 155, 155, 1)',
    fontWeight: '500',
    paddingBottom: 5,
  },
});
