import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {convertTimestampToDate} from '../utils';

const CompletedMarketItem = ({item}) => {
  return (
    <View style={styles.root}>
      <View style={styles.tableRow}>
        {/* name */}
        <Text style={[styles.tableText, {textAlign: 'left', width: '30%'}]}>
          {item?.contractName}
        </Text>

        {/* lastPrice */}
        <Text style={[styles.tableText, {width: '30%', textAlign: 'center'}]}>
          {isNaN(parseFloat(item?.lastPrice).toFixed(3))
            ? '--'
            : parseFloat(item?.lastPrice).toFixed(3)}
        </Text>

        {/* expiredDate */}
        <View style={[styles.dateTimeContainer, {width: '30%'}]}>
          <Text style={styles.tableText}>
            {convertTimestampToDate(item?.timestamp).split(',')[0]}
          </Text>
          <Text style={styles.timeText}>
            {convertTimestampToDate(item?.timestamp).split(',')[1]}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CompletedMarketItem;

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '5%',
    borderBottomColor: 'rgba(230, 233, 239, 1)',
    borderBottomWidth: 1,
    paddingBottom: '3%',
    alignItems: 'flex-start',
    paddingHorizontal: '3%',
  },

  tableText: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: 'rgba(81, 81, 81, 1)',
  },

  dateTimeContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 10,
    fontFamily: 'Roboto',
    color: 'rgba(81, 81, 81, 1)',
    textAlign: 'right',
  },
});
