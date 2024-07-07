import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Alert,
  RefreshControl,
  Modal,
  BackHandler,
  Platform,
} from 'react-native';
import axios from 'axios';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {textStyle} from '../primaryStyle';

// components
import UserOrderHistoryDetails from '../Components/OrderBookBottom';
import PlaceOrderForm from '../Components/PlaceOrderForm';
import OrderBook from '../Components/OrderBook';

// context
import {Context} from '../Context/Context';

// ip
import {ip} from '../config';

// liveContractSocket
import {liveContractSocket, adminSocket} from '../socket/socket';
import ClosePositionModal from '../Components/ClosePositionModal';
import {displayNumberUpToNDecimals} from '../utils';

const DisplayMarketNotOpenModal = ({marketNotOpen, ballsCount}) => {
  const navigation = useNavigation();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={marketNotOpen}
      onRequestClose={() => navigation.navigate('HomeScreen')}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(84, 106, 147, 0.5)',
        }}>
        <View style={{backgroundColor: 'white', width: '80%', height: 150}}>
          <Text
            style={[
              {textAlign: 'center', paddingTop: 20},
              textStyle,
              {fontSize: 18},
            ]}>
            Trade will start after 5 overs
          </Text>

          <Text
            style={{
              textAlign: 'center',
              paddingTop: 10,
              color: 'rgba(37, 37, 37, 1)',
              fontSize: 18,
            }}>
            {30 - ballsCount} BALLS Left
          </Text>

          <TouchableOpacity
            style={{
              width: '40%',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 33, 94, 1)',
              marginTop: 10,
              height: 30,
            }}
            onPress={() => navigation.navigate('HomeScreen')}>
            <Text style={{color: 'white', textAlignVertical: 'center'}}>
              Okay
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const ContractHome = ({route}) => {
  const navigation = useNavigation();

  const {socket, userToken, setUserBalance} = useContext(Context);

  const [showClosePosition, setShowClosePosition] = useState(false);
  const [closeData, setCloseData] = useState({});

  let contractName = route.params?.contractName;
  let contractId = route.params?.contractId;

  const [marketNotOpen, setMarketNotOpen] = useState(false);
  const [ballsCount, setBallCount] = useState(0);
  const [keyboardShown, setKeyboardShown] = useState(false);
  const [orderType, setOrderType] = useState('limit');
  const [orderPrice, setOrderPrice] = useState(0);
  const [lastPrice, setLastPrice] = useState('--');
  const [userBal, setUserBal] = useState(0);
  const [priceDirection, setPriceDirection] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  const [markPrice, setMarkPrice] = useState(0);

  const getSymbolIndexFromWallet = (wallet, symbol) => {
    var index = -1;
    for (var i = 0; i < wallet.length; ++i) {
      if (wallet[i].symbol == symbol) {
        index = i;
        break;
      }
    }

    return index;
  };

  const backAction = () => {
    if (route.name == 'ContractHome') {
      navigation.navigate('Market');
    }
  };

  async function getUserBalance() {
    try {
      let result = await axios.get(`${ip}/api/users`, {
        headers: {token: userToken},
      });

      let userData = result.data;

      // get ball symbolIndex
      let symbolIndex = getSymbolIndexFromWallet(userData.wallet, 'BALL');
      if (symbolIndex == -1) {
        setUserBal(0);
      } else {
        let balance = userData.wallet[symbolIndex].available;
        setUserBal(balance);
        setUserBalance(balance);
      }
    } catch (e) {
      console.log('error', e);
      Alert.alert(
        'API Error getUserBalance',
        e?.response?.data?.message || e.message,
      );
    }
  }

  const onRefresh = useCallback(async () => {
    // setRefresh to true
    try {
      setRefreshing(true);
      await getUserBalance();
    } catch (e) {
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardShown(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardShown(false);
      },
    );

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    // join the socket room
    // so that we can get positions, openOrders data
    socket.emit('join-room', {contractId: route.params?.contractId});

    // emit the lastPrice
    liveContractSocket.emit(`lastPrice`, {
      contractId: route.params?.contractId,
    });

    // on lastPrice
    liveContractSocket.on(`lastPrice_${route.params?.contractId}`, data => {
      setLastPrice(Math.abs(data.lastPrice));

      if (data.lastPrice > 0) {
        setPriceDirection('positive');
      } else {
        setPriceDirection('negative');
      }
    });

    // join in getBall socket
    adminSocket.emit('joinRoom', {roomName: route.params?.contractId});

    // on newBall
    adminSocket.on(`ball_${route.params?.contractId}`, data => {
      if (data?.markPrice != null) {
        setMarkPrice(data?.markPrice);
      }

      // console.log('data', data);

      if (!data?.marketOpen) {
        if (!marketNotOpen) {
          setMarketNotOpen(true);
        }
      }

      if (data.marketOpen) {
        setMarketNotOpen(false);
      }

      setBallCount(data.balls);
    });

    getUserBalance();

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();

      backHandler.remove();

      // disconnect socket
      socket.emit('disconnect-user-contract', {
        contractId: route.params?.contractId,
      });

      // @TODO disconnect liveContractSocket (below)
    };
  }, []);

  return showClosePosition ? (
    <ClosePositionModal
      item={closeData}
      setShowClosePosition={setShowClosePosition}
      showClosePosition={showClosePosition}
    />
  ) : (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, backgroundColor: 'white'}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.canvas}>
        {marketNotOpen && (
          <DisplayMarketNotOpenModal
            marketNotOpen={marketNotOpen}
            ballsCount={ballsCount}
          />
        )}

        <View style={styles.content}>
          {/* backButton on the top */}
          <View style={styles.backButtonContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('HomeScreen');
              }}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
          </View>

          {/* headerData */}
          <View style={styles.headerData}>
            <View>
              <Text style={styles.lastPriceText}>Last Price</Text>
              <View style={{flexDirection: 'row', gap: 8}}>
                <Text style={styles.contractName}>{contractName}</Text>
                <Text
                  style={[
                    styles.contractName,
                    {
                      color:
                        priceDirection === 'positive'
                          ? 'rgba(16, 167, 96, 1)'
                          : priceDirection === 'negative'
                          ? 'rgba(240, 68, 56, 1)'
                          : 'black',
                    },
                  ]}>
                  {isNaN(parseFloat(lastPrice).toFixed(4))
                    ? '--'
                    : parseFloat(lastPrice).toFixed(4)}
                </Text>
              </View>
              <View style={{flexDirection: 'row', gap: 5}}>
                <Text
                  style={{
                    color: 'rgba(81, 81, 81, 1)',
                    fontSize: 14,
                    fontWeight: '400',
                  }}>
                  Mark Price
                </Text>
                <Text
                  style={{
                    color: 'rgba(81, 81, 81, 1)',
                    fontSize: 14,
                    fontWeight: '500',
                  }}>
                  {markPrice.toFixed(2)}
                </Text>
              </View>
            </View>

            <View>
              <TouchableOpacity
                style={{
                  height: 50,
                  width: 50,
                  justifyContent: 'center',
                }}
                onPress={() =>
                  navigation.navigate('RenderChart', {
                    contractId,
                    contractName,
                    lastPrice,
                    markPrice,
                  })
                }>
                <Image
                  style={{alignSelf: 'center'}}
                  source={require('../assets/candleStick.png')}
                />
              </TouchableOpacity>
            </View>
          </View>

          <KeyboardAwareScrollView
            contentContainerStyle={{flexGrow: 1, backgroundColor: 'white'}}
            behavior={'height'}>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'flex-start',
              }}>
              <View style={styles.orderBookAndPlaceOrderForm}>
                <View style={styles.placeOrderForm}>
                  <PlaceOrderForm
                    availableBalanace={
                      userBal && displayNumberUpToNDecimals(userBal, 4)
                    }
                    tokenSymbol={contractName}
                    contractId={contractId}
                    orderType={orderType}
                    setOrderType={setOrderType}
                    orderPrice={orderPrice}
                    setOrderPrice={setOrderPrice}
                  />
                </View>
                <View style={styles.orderBook}>
                  <OrderBook
                    tokenSymbol={contractName}
                    contractId={contractId}
                    orderType={orderType}
                    setOrderPrice={setOrderPrice}
                    lastPrice={lastPrice}
                    priceDirection={priceDirection}
                    markPrice={markPrice}
                  />
                </View>
              </View>
            </ScrollView>
          </KeyboardAwareScrollView>

          {/* {!keyboardShown && ( */}
          <UserOrderHistoryDetails
            contractId={contractId}
            setShowClosePosition={setShowClosePosition}
            setCloseData={setCloseData}
          />
          {/* )} */}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  canvas: {
    backgroundColor: 'white',
    // height: '100%',
  },

  content: {
    marginHorizontal: '4%',
    height: '100%',
  },

  backButtonContainer: {
    height: 50,
  },

  backButtonText: {
    color: 'rgba(16, 16, 16, 1)',
    fontSize: 40,
  },

  headerData: {
    marginTop: '5%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },

  lastPriceText: {
    ...textStyle,
    color: 'rgba(138, 153, 181, 1)',
  },

  contractName: {
    ...textStyle,
    fontWeight: '700',
    color: 'black',
    fontSize: 20,
  },

  candleStickImage: {
    width: 25,
    height: 25,
  },

  orderBookAndPlaceOrderForm: {
    marginTop: 10,
    height: 470,
    flexDirection: 'row',
    overflow: 'hidden',
  },

  placeOrderForm: {
    height: '90%',
    width: '58%',
  },

  orderBook: {
    height: '95%',
    width: '42%',
  },
});

export default ContractHome;
