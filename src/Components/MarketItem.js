import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const MarketItem = ({market}) => {
  const navigation = useNavigation();

  function decideNavigation() {
    if (Date.now() > market.startDate) {
      return navigation.navigate('ContractHome', {
        contractId: market._id,
        contractName: market.contractName,
        cricBuzzMatchId: market.cricBuzzMatchId,
        startDate: market.startDate,
      });
    } else {
      return navigation.navigate('TimmerScreen', {
        contractId: market._id,
        contractName: market.contractName,
        startDate: market.startDate,
        cricBuzzMatchId: market.cricBuzzMatchId,
      });
    }
  }

  return (
    <TouchableOpacity onPress={() => decideNavigation()} style={styles.root}>
      <View style={styles.tableRow}>
        <Text style={[styles.tableText, {width: '30%'}]}>
          {market?.contractName}
        </Text>
        <Text style={[styles.tableText, {textAlign: 'center', width: '30%'}]}>
          {isNaN(parseFloat(market?.lastPrice).toFixed(3))
            ? '--'
            : parseFloat(market?.lastPrice).toFixed(4)}
        </Text>
        <View
          style={[
            styles.changeContainer,
            {
              backgroundColor:
                market?.pnl5min > 0
                  ? 'green'
                  : market?.pnl5min < 0
                  ? 'red'
                  : 'black',
            },
          ]}>
          <Text style={styles.changeText}>
            {parseFloat(market.pnl5min).toFixed(3)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MarketItem;

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    flex: 1,
  },

  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '5%',
    borderBottomColor: 'rgba(230, 233, 239, 1)',
    borderBottomWidth: 1,
    paddingBottom: '3%',
    paddingHorizontal: '3%',
  },
  tableText: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '650',
    color: 'rgba(81, 81, 81, 1)',
  },
  changeContainer: {
    paddingHorizontal: 35,
    paddingVertical: 8,
    borderRadius: 3,
  },
  changeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
});
