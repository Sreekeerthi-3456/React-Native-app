import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {textStyle} from '../primaryStyle';
import {liveContractSocket} from '../socket/socket';
import {Context} from '../Context/Context';
import axios from 'axios';
import {ip} from '../config';

const ClosePositionModal = ({
  setShowClosePosition,
  showClosePosition,
  item,
}) => {
  const [marketLastPrice, setMarketLastPrice] = useState(0);
  const [limitLastPrice, setLimitLastPrice] = useState(0);
  const [activeClose, setActiveClose] = useState('');
  const [quantity, setQuantity] = useState(Math.abs(item?.size));
  const [isLoading, setIsLoading] = useState(false);
  const {userToken} = useContext(Context);

  const activeCloseRef = useRef('');

  const calculateQuantityFromPercentage = percentage => {
    const calculatedQuantity = (percentage / 100) * Math.abs(item?.size);
    setQuantity(calculatedQuantity.toFixed(3));
  };

  async function closePosition() {
    try {
      setIsLoading(true);

      let data = {
        contractId: item.contractId,
        side: item.size > 0 ? 'short' : 'long',
        type: activeClose,
        quantity: quantity,
      };

      if (activeCloseRef.current == 'limit') {
        data.price = parseFloat(limitLastPrice).toFixed(4);
      }

      let result = await axios.post(`${ip}/api/contract/order`, data, {
        headers: {
          'Content-Type': 'application/json',
          token: userToken,
        },
      });

      Alert.alert('Success', result.data.message);
      setShowClosePosition(false);
    } catch (e) {
      console.log('position error', e?.response?.data?.message || e?.message);
      Alert.alert(
        'API Error Close Position',
        e?.response?.data?.message || e?.message,
      );
    } finally {
      setIsLoading(false);
    }
  }

  function calulateEsitmatedPnl() {
    let price;
    let qty;

    if (activeCloseRef.current == 'market') {
      price = marketLastPrice;
    } else {
      price = limitLastPrice;
    }

    if (item.size > 0) {
      qty = quantity;
    } else {
      qty = -1 * quantity;
    }

    qty = parseFloat(qty);

    let pnl = (price - item?.avgPrice) * qty;

    if (isNaN(pnl)) {
      return 'N/A';
    } else {
      return parseFloat(pnl).toFixed(4);
    }
  }

  useEffect(() => {
    setActiveClose('market');
    activeCloseRef.current = 'market';
    setMarketLastPrice(item.lastPrice);
    setLimitLastPrice(item.lastPrice);
  }, []);

  useEffect(() => {
    liveContractSocket.emit('lastPrice', {contractId: item?.contractId});

    liveContractSocket.on(`lastPrice_${item.contractId}`, data => {
      setMarketLastPrice(Math.abs(data?.lastPrice));

      if (activeCloseRef.current == 'market') {
        setLimitLastPrice(Math.abs(data?.lastPrice));
      }
    });
  }, [activeClose]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showClosePosition}
      onRequestClose={() => setShowClosePosition(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={'blue'} size={'large'} />
              <Text style={styles.loadingText}>Closing Position</Text>
            </View>
          ) : (
            <>
              <View style={styles.tabContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setActiveClose('market');
                      activeCloseRef.current = 'market';
                    }}>
                    <Text
                      style={[
                        styles.tabText,
                        activeClose === 'market' && styles.activeTabText,
                      ]}>
                      Market Close
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setActiveClose('limit');
                      activeCloseRef.current = 'limit';
                    }}>
                    <Text
                      style={[
                        styles.tabText,
                        activeClose === 'limit' && styles.activeTabText,
                      ]}>
                      Limit Close
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => setShowClosePosition(false)}>
                  <Image
                    source={require('../assets/cross.png')}
                    style={{width: 24, height: 24}}
                  />
                </TouchableOpacity>
              </View>

              {/* price */}
              <View style={styles.inputContainer}>
                {activeClose === 'market' ? (
                  <Text
                    style={[
                      styles.textStyle,
                      {textAlign: 'center', paddingBottom: 20},
                    ]}>
                    Price
                  </Text>
                ) : (
                  <TouchableOpacity
                    style={{width: '15%'}}
                    onPress={() =>
                      setLimitLastPrice(
                        (parseFloat(limitLastPrice) - 1).toString(),
                      )
                    }>
                    <Image
                      style={styles.iconMinius}
                      source={require('../assets/minus.png')}
                    />
                  </TouchableOpacity>
                )}
                {activeClose === 'market' ? (
                  <Text style={[textStyle, {color: 'rgba(86, 91, 103, 0.6)'}]}>
                    {parseFloat(limitLastPrice).toFixed(4)}
                  </Text>
                ) : (
                  <View style={styles.priceInputContainer}>
                    <Text
                      style={[
                        styles.textStyle,
                        {color: 'rgba(86, 91, 103, 0.5)', fontSize: 12},
                      ]}>
                      Price (BALL)
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      keyboardType="numeric"
                      onChangeText={text => {
                        setLimitLastPrice(text);
                      }}
                      value={limitLastPrice.toString()}
                    />
                  </View>
                )}
                {activeClose === 'market' ? (
                  <Text style={textStyle}>Market Price</Text>
                ) : (
                  <TouchableOpacity
                    style={{
                      width: '15%',
                      alignItems: 'center',
                    }}
                    onPress={() =>
                      setLimitLastPrice(
                        (parseFloat(limitLastPrice) + 1).toString(),
                      )
                    }>
                    <Image
                      style={styles.icon}
                      source={require('../assets/plus.png')}
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* quantity */}
              <View style={styles.inputContainer}>
                <TouchableOpacity
                  style={{width: '15%'}}
                  onPress={() =>
                    setQuantity((parseFloat(quantity) - 1).toString())
                  }>
                  <Image
                    style={styles.iconMinius}
                    source={require('../assets/minus.png')}
                  />
                </TouchableOpacity>
                <View style={styles.quantityInputContainer}>
                  <Text
                    style={[
                      styles.textStyle,
                      {color: 'rgba(86, 91, 103, 0.5)', fontSize: 12},
                    ]}>
                    Quantity (RCBMICOIN)
                  </Text>
                  <TextInput
                    style={[styles.textInput, textStyle]}
                    keyboardType="numeric"
                    onChangeText={text => setQuantity(text)}
                    value={quantity.toString()}
                  />
                </View>
                <TouchableOpacity
                  style={{width: '15%', alignItems: 'center'}}
                  onPress={() =>
                    setQuantity((parseFloat(quantity) + 1).toString())
                  }>
                  <Image
                    style={styles.icon}
                    source={require('../assets/plus.png')}
                  />
                </TouchableOpacity>
              </View>

              {/* percentage container */}
              <View style={styles.percentageContainer}>
                <TouchableOpacity
                  onPress={() => calculateQuantityFromPercentage(25)}
                  style={styles.percentageBox}>
                  <Text style={styles.percentageText}>25%</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => calculateQuantityFromPercentage(50)}
                  style={styles.percentageBox}>
                  <Text style={styles.percentageText}>50%</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => calculateQuantityFromPercentage(75)}
                  style={styles.percentageBox}>
                  <Text style={styles.percentageText}>75%</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => calculateQuantityFromPercentage(100)}
                  style={styles.percentageBox}>
                  <Text style={styles.percentageText}>100%</Text>
                </TouchableOpacity>
              </View>

              {/* estimated pnl */}
              <View style={styles.pnlContainer}>
                <Text
                  style={[
                    styles.pnltext,
                    {fontWeight: '400', color: 'rgba(109, 109, 109, 1)'},
                  ]}>
                  Estimated PNL:
                </Text>
                <Text
                  style={[
                    styles.pnltext,
                    {fontWeight: '700', color: 'rgba(37, 37, 37, 1)'},
                  ]}>
                  {calulateEsitmatedPnl()}
                  BALL
                </Text>
              </View>

              {/* close position button */}
              <TouchableOpacity
                onPress={closePosition}
                style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(84, 106, 147, 0.5)',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  modalContent: {
    paddingHorizontal: 30,
    paddingVertical: 30,
    paddingTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'white',
    width: '100%',
    gap: 20,
    height: '46%',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
  },

  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  tabText: {
    fontSize: 16,
    color: 'rgba(109, 109, 109, 1)',
    borderBottomWidth: 0,
  },
  activeTabText: {
    color: 'rgba(0, 33, 94, 1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 33, 94, 1)',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: 'rgba(230, 233, 239, 0.8)',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
    minHeight: 40,
  },
  textStyle: {
    ...textStyle,
    textAlign: 'center',
    top: 10,
  },
  priceInputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
  },
  textInput: {
    width: '100%',
    textAlign: 'center',
  },
  quantityInputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
  },
  icon: {
    height: 15,
    width: 15,
  },
  iconMinius: {
    height: 4,
    width: 20,
  },
  percentageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 2,
    width: '100%',
    justifyContent: 'space-between',
  },
  percentageBox: {
    width: 72,
    height: 30,
    backgroundColor: 'rgba(230, 233, 239, 1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pnlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    backgroundColor: 'rgba(0, 33, 94, 1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  confirmButtonText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white',
    height: 40,
  },
  percentageText: {
    color: 'rgba(86, 91, 103, 1)',
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
  pnltext: {
    fontFamily: 'Roboto',
    fontSize: 14,
  },
});

export default ClosePositionModal;
