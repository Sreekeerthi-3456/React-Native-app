import React, {useCallback, useContext, useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';

import RenderPositionItem from '../Components/RenderPositionItem';
import ClosePositionModal from '../Components/ClosePositionModal';

// ip
import {ip} from '../config';

// context
import {Context} from '../Context/Context';

const PositionsHistory = () => {
  const [positionsData, setPositionsData] = useState([]);
  const {userToken} = useContext(Context);

  const [showClosePosition, setShowClosePosition] = useState(false);
  const [closeData, setCloseData] = useState({});

  const fetchPositions = async () => {
    try {
      const response = await axios.get(`${ip}/api/users/positions`, {
        headers: {
          token: userToken,
        },
      });

      setPositionsData(response.data);
    } catch (error) {
      console.log('Error at', error.data);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPositions();
    }, []),
  );

  return showClosePosition ? (
    <ClosePositionModal
      setShowClosePosition={setShowClosePosition}
      showClosePosition={showClosePosition}
      item={closeData}
    />
  ) : (
    <View style={{backgroundColor: 'white', flex: 1}}>
      {positionsData?.length > 0 ? (
        <FlatList
          data={positionsData}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <RenderPositionItem
              item={item}
              setShowClosePosition={setShowClosePosition}
              setCloseData={setCloseData}
            />
          )}
          contentContainerStyle={{marginHorizontal: '5%'}}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Image
            source={require('../assets/noData.png')}
            style={styles.noDataImage}
          />
          <Text style={styles.noDataText}>No Positions</Text>
        </View>
      )}
    </View>
  );
};
export default PositionsHistory;

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
