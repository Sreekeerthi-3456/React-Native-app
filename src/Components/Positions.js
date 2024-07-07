import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import axios from 'axios';

// components
import RenderPositionItem from './RenderPositionItem';

// primary text style
import {textStyle} from '../primaryStyle';

// context
import {Context} from '../Context/Context';
import {BeaconContext} from './OrderBookBottom';

// ip
import {ip} from '../config';
import {useFocusEffect} from '@react-navigation/native';

const Positions = ({route}) => {
  const {socket, userToken} = useContext(Context);

  const {setShowClosePosition, setCloseData} = useContext(BeaconContext);

  const [isLoading, setIsLoading] = useState(false);
  const [positions, setPositions] = useState({});

  async function getPostions() {
    try {
      setIsLoading(true);
      let contractId = route.params.contractId;

      let result = await axios.get(
        `${ip}/api/contract/${contractId}/positions`,
        {
          headers: {token: userToken},
        },
      );

      setPositions(result.data);
    } catch (e) {
      Alert.alert(
        'API Error get Positions',
        e?.response?.data?.message || e.message,
      );
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getPostions();

      socket.on('positions', data => {
        if (data.size == 0) {
          setPositions(null);
        } else {
          setPositions(data);
        }
      });
    }, []),
  );

  return (
    <View style={styles.canvas}>
      {isLoading ? (
        <View
          style={{
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" />
        </View>
      ) : Object.keys(positions || {}).length == 0 ? (
        <View
          style={{
            gap: 5,
            marginTop: '3%',
            alignItems: 'center',
          }}>
          <Image source={require('../assets/noData.png')} />
          <Text style={[styles.textStyle, {color: 'rgba(176, 186, 205, 1)'}]}>
            No Positions
          </Text>
        </View>
      ) : (
        <View>
          <RenderPositionItem
            from={'single-contract-position'}
            item={positions}
            setShowClosePosition={setShowClosePosition}
            setCloseData={setCloseData}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  canvas: {
    backgroundColor: 'white',
    height: '100%',
  },

  textStyle: {
    ...textStyle,
  },
});

export default Positions;
