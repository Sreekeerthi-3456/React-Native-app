import {StackActions, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {textStyle} from '../primaryStyle';

const TimmerScreen = ({route}) => {
  const navigation = useNavigation();

  const [day, setDay] = useState('0');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');

  const [deadlineFinished, setDeadlineFinished] = useState(false);

  function getTime(deadLine) {
    const time = deadLine - Date.now();

    if (time < 0) {
      setDeadlineFinished(true);

      return navigation.dispatch(
        StackActions.replace('ContractHome', {
          contractId: route.params?.contractId,
          contractName: route.params?.contractName,
          cricBuzzMatchId: route.params.cricBuzzMatchId,
          startDate: route.params?.startDate,
        }),
      );
    }

    setDay(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  }

  useEffect(() => {
    const interval = setInterval(() => getTime(route.params.startDate), 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('HomeScreen')}
          style={styles.backArrowContainer}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.coinContainer}>
        <Text style={styles.coinLabel}>Coin</Text>

        <Text style={[styles.coinName, textStyle]}>
          {route.params.contractName}
        </Text>
      </View>
      {deadlineFinished ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '20%',
          }}>
          <Text style={styles.textStyle}>
            DeadLine is Finished Go back and come again to refresh
          </Text>
        </View>
      ) : (
        <View style={styles.container}>
          <Image
            style={{width: 120, height: 110, marginBottom: '5%'}}
            source={require('../assets/clockimage.png')}
          />
          <Text style={styles.tradingText}>Trading Will Open In Few Hours</Text>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>DAYS</Text>
            <Text style={styles.labelText}>HOURS</Text>
            <Text style={styles.labelText}>MINUTES</Text>
            <Text style={styles.labelText}>SECONDS</Text>
          </View>
          <View style={styles.timeContainer}>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>{day}</Text>
            </View>
            <Text style={styles.colon}>:</Text>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>{hours}</Text>
            </View>
            <Text style={styles.colon}>:</Text>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>{minutes}</Text>
            </View>
            <Text style={styles.colon}>:</Text>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>{seconds}</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.noteContainer}>
        <Text style={styles.noteTitle}>Note</Text>
        <Text style={styles.noteText}>• Trade Will Start After 5 Overs</Text>
      </View>
    </View>
  );
};

export default TimmerScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '3%',
    marginTop: '8%',
  },
  backArrowContainer: {
    flex: 1,
  },
  backArrow: {
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: 'rgba(16, 16, 16, 1)',
  },
  userContainer: {
    backgroundColor: 'orange',
    padding: 5,
    borderRadius: 5,
  },

  textStyle: {
    ...textStyle,
  },
  userName: {
    color: 'white',
    fontWeight: 'bold',
  },
  coinContainer: {
    marginHorizontal: '5%',
    marginTop: 20,
    alignItems: 'flex-start',
  },
  coinLabel: {
    fontSize: 12,
    color: 'rgba(138, 153, 181, 1)',
    fontWeight: '400',
    fontFamily: 'Roboto',
  },
  coinName: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(37, 37, 37, 1)',
    fontFamily: 'Roboto',
  },
  container: {
    alignItems: 'center',
    marginTop: '25%',
  },
  clockImage: {
    width: 120,
    height: 110,
    marginBottom: 20,
  },
  tradingText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(37, 37, 37, 1)',
    marginBottom: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '45%',
    marginBottom: 10,
  },
  labelText: {
    fontSize: 8,
    color: 'rgba(81, 81, 81, 1)',
    fontFamily: 'Roboto',
    fontWeight: '400',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeBox: {
    borderWidth: 1,
    borderColor: 'rgba(0, 33, 94, 1)',
    borderStyle: 'dotted',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  timeText: {
    fontSize: 22.07,
    color: 'rgba(0, 33, 94, 1)',
    fontWeight: '400',
  },
  colon: {
    fontSize: 24,
    color: 'rgba(0, 33, 94, 1)',
    marginHorizontal: 5,
    fontWeight: '700',
  },
  noteContainer: {
    marginHorizontal: '5%',
    marginTop: '50%',
  },
  noteTitle: {
    fontSize: 12,
    color: 'rgba(109, 109, 109, 1)',
    fontFamily: 'Roboto',
    fontWeight: '400',
  },
  noteText: {
    fontSize: 12,
    color: 'rgba(109, 109, 109, 1)',
    marginTop: 5,
    paddingLeft: 10,
    fontFamily: 'Roboto',
    fontWeight: '400',
  },
});
