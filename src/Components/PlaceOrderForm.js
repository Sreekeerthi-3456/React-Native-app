import React, {useCallback, useContext, useEffect, useState} from 'react';
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
import axios from 'axios';

// styles
import {textStyle} from '../primaryStyle';

// ip
import {ip} from '../config';

// context
import {Context} from '../Context/Context';
import {useFocusEffect} from '@react-navigation/native';

const PlaceOrderForm = ({
  availableBalanace,
  contractId,
  setOrderType,
  orderType,
  orderPrice,
  setOrderPrice,
  tokenSymbol,
}) => {
  const {userToken} = useContext(Context);

  const [qty, setQty] = useState(0);
  const [amount, setAmount] = useState(0);
  const [showDropDown, setShowDropDown] = useState(false);
  const [priceEditable, setPriceEditable] = useState(true);
  const [orderPlaceLoading, setOrderPlaceLoading] = useState(false);

  const percentages = [25, 50, 75, 100];

  function handlePriceChange(price) {
    if (orderType == 'limit') {
      setAmount(parseFloat(price * qty).toFixed(4));
    }
  }

  function handleQtyChange(qty) {
    if (orderType == 'limit') {
      setAmount(parseFloat(orderPrice * qty).toFixed(4));
    }
  }

  function handleAmountChange(amount) {
    if (orderType == 'limit') {
      if (qty == 0) {
        setOrderPrice(0);
      } else {
        let value = amount / qty;

        setOrderPrice(parseFloat(value).toFixed(4));
      }
    }
  }

  async function placeOrder(side) {
    try {
      setOrderPlaceLoading(true);

      let data = {
        contractId: contractId,
        side: side,
        type: orderType,
        quantity: qty,
      };

      if (orderType == 'limit') {
        data.price = orderPrice;
      }

      let response = await axios.post(`${ip}/api/contract/order`, data, {
        headers: {
          'Content-Type': 'application/json',
          token: userToken,
        },
      });

      Alert.alert('Success', `Order submitted,\n${response.data.message}`);
    } catch (e) {
      Alert.alert('Error Place Order', e?.response?.data?.message || e.message);
    } finally {
      setOrderPlaceLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (qty != 0) {
        handlePriceChange(orderPrice);
      }
    }, [orderPrice]),
  );

  useEffect(() => {
    if (orderType == 'market') {
      setOrderPrice('Market Price');
      setPriceEditable(false);
    } else {
      setOrderPrice(0);
      setPriceEditable(true);
    }
  }, [orderType]);

  return (
    <View style={styles.container}>
      {orderPlaceLoading && (
        <Modal
          animationType="none"
          transparent={true}
          visible={orderPlaceLoading}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(84, 106, 147, 0.5)',
            }}>
            <View style={{width: '80%', flexDirection: 'row'}}>
              <Text style={styles.textStyle}>Order is being Placed...</Text>
              <ActivityIndicator color={'blue'} size={'large'} />
            </View>
          </View>
        </Modal>
      )}
      <View style={styles.viewBalanceContainer}>
        <Text style={styles.textStyle}>Available BALL</Text>
        <Text style={styles.balanceStyle}>{availableBalanace}</Text>
      </View>

      <View style={styles.placeOrderForm}>
        {/* orderType */}
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowDropDown(!showDropDown)}>
          <Text style={[styles.dropdownText, {textTransform: 'capitalize'}]}>
            {orderType}
          </Text>
          <View style={styles.dropdownIcon}>
            <Text>▼</Text>
          </View>
        </TouchableOpacity>

        {showDropDown && (
          <View
            style={{
              width: '100%',
              position: 'absolute',
              top: '16%',
              zIndex: 1,
              backgroundColor: 'rgba(176, 186, 205, 1)',
              justifyContent: 'center',
              paddingHorizontal: 10,
              gap: 20,
            }}>
            <TouchableOpacity
              style={{width: '100%'}}
              onPress={() => {
                setOrderType('limit');
                setShowDropDown(false);
              }}>
              <Text style={[styles.textStyle, {color: 'white', fontSize: 16}]}>
                Limit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{width: '100%'}}
              onPress={() => {
                setOrderType('market');
                setShowDropDown(false);
              }}>
              <Text style={[styles.textStyle, {color: 'white', fontSize: 16}]}>
                Market
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* price */}
        <View style={[styles.priceContainer, {marginBottom: 10}]}>
          {orderType == 'limit' && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (orderType != 'market') {
                  let newPrice = parseFloat(orderPrice) - 1;
                  if (newPrice < 0) {
                  } else {
                    setOrderPrice(newPrice);
                    handlePriceChange(newPrice);
                  }
                }
              }}>
              <Image
                style={{width: 15}}
                source={require('../assets/minus.png')}
              />
            </TouchableOpacity>
          )}

          <View style={{flex: 1}}>
            <Text
              style={[
                styles.textStyle,
                {position: 'absolute', left: '30%', textAlign: 'center'},
              ]}>
              Price (BALL)
            </Text>
            <TextInput
              placeholderTextColor={'rgba(86, 91, 103, 1)'}
              style={{
                fontSize: 18,
                textAlign: 'center',
                height: 50,
                color: 'black',
                top: 5,
              }}
              value={orderPrice.toString()}
              onChangeText={text => {
                if (parseFloat(text) < 0) {
                } else {
                  setOrderPrice(text);
                  handlePriceChange(text);
                }
              }}
              keyboardType="numeric"
              editable={priceEditable}
            />
          </View>

          {orderType == 'limit' && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (orderType != 'market') {
                  let newPrice = parseFloat(orderPrice) + 1;
                  setOrderPrice(newPrice);
                  handlePriceChange(newPrice);
                }
              }}>
              <Image
                style={{height: 15, width: 15}}
                source={require('../assets/plus.png')}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* quantity */}

        <View style={[styles.priceContainer, {marginBottom: 10}]}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              let newQty = parseFloat(qty) - 1;
              if (newQty < 0) {
              } else {
                setQty(newQty);
                handleQtyChange(newQty);
              }
            }}>
            <Image
              style={{width: 15}}
              source={require('../assets/minus.png')}
            />
          </TouchableOpacity>

          <View style={{flex: 1}}>
            <Text
              style={[
                styles.textStyle,
                {position: 'absolute', left: '10%', textAlign: 'center'},
              ]}>
              Quantity ({`${tokenSymbol?.slice(0, -4)}`})
            </Text>
            <TextInput
              placeholderTextColor={'rgba(86, 91, 103, 1)'}
              style={{
                fontSize: 18,
                textAlign: 'center',
                height: 50,
                color: 'black',
                top: 5,
              }}
              value={qty.toString()}
              onChangeText={text => {
                if (parseFloat(text) < 0) {
                } else {
                  setQty(parseFloat(text));
                  handleQtyChange(parseFloat(text));
                }
              }}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              let newQty = parseFloat(qty) + 1;
              setQty(newQty);
              handleQtyChange(newQty);
            }}>
            <Image
              style={{height: 15, width: 15}}
              source={require('../assets/plus.png')}
            />
          </TouchableOpacity>
        </View>

        {/* amount */}
        {orderType == 'limit' && (
          <>
            <View style={[styles.priceContainer, {marginBottom: 10}]}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  let newAmount = parseFloat(amount) - 1;
                  if (newAmount >= 0) {
                    setAmount(newAmount);
                    handleAmountChange(newAmount);
                  }
                }}>
                <Image
                  style={{width: 15}}
                  source={require('../assets/minus.png')}
                />
              </TouchableOpacity>

              <View style={{flex: 1}}>
                <Text
                  style={[
                    styles.textStyle,
                    {position: 'absolute', left: '26%', textAlign: 'center'},
                  ]}>
                  Amount (BALL)
                </Text>
                <TextInput
                  placeholderTextColor={'rgba(86, 91, 103, 1)'}
                  style={{
                    fontSize: 18,
                    textAlign: 'center',
                    height: 50,
                    color: 'black',
                    top: 5,
                  }}
                  value={amount.toString()}
                  onChangeText={text => {
                    if (parseFloat(text) < 0) {
                    } else {
                      setAmount(text);
                      handleAmountChange(text);
                    }
                  }}
                  maxLength={6}
                  keyboardType="numeric"
                  editable={priceEditable}
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  let newAmount = parseFloat(amount) + 1;
                  setAmount(newAmount);
                  handleAmountChange(newAmount);
                }}>
                <Image
                  style={{height: 15, width: 15}}
                  source={require('../assets/plus.png')}
                />
              </TouchableOpacity>
            </View>

            {/* percenatge boxes */}
            <View style={{flexDirection: 'row', gap: 8}}>
              {percentages.map((el, index) => {
                return (
                  <View style={{width: '22%'}} key={index}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: 'rgba(230, 233, 239, 1)',
                        gap: 1,
                        borderRadius: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 25,
                      }}
                      onPress={() => {
                        setAmount(el * 0.01 * availableBalanace);
                      }}>
                      <Text style={[styles.textStyle, {textAlign: 'center'}]}>
                        {el}%
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </>
        )}

        <View style={styles.submitButtons}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              {backgroundColor: 'rgba(18, 183, 106, 1)'},
            ]}
            onPress={() => {
              placeOrder('long');
            }}>
            <Text style={styles.submitButtonText}>Buy/Long</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              {backgroundColor: 'rgba(240, 68, 56, 1)'},
            ]}
            onPress={() => {
              placeOrder('short');
            }}>
            <Text style={styles.submitButtonText}>Sell/Short</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    paddingEnd: 10,
    paddingVertical: 20,
  },

  viewBalanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  textStyle: {
    ...textStyle,
    color: 'rgba(138, 153, 181, 1)',
    fontSize: 10,
  },

  balanceStyle: {
    ...textStyle,
    fontWeight: '600',
  },

  textInput: {
    width: '80%',
    height: 50,
    fontSize: 20,
    textAlign: 'center',
  },

  negativefontSize: {
    fontSize: 50,
  },

  positiveFontSize: {
    fontSize: 35,
  },

  placeOrderForm: {
    marginTop: 10,
    gap: 10,
    height: '75%',
  },

  dropdown: {
    backgroundColor: 'rgba(230, 233, 239, 1)',
    borderRadius: 4,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },

  dropdownText: {
    fontSize: 16,
    color: 'rgba(81, 81, 81, 1)',
  },

  dropdownIcon: {
    position: 'absolute',
    right: '5%',
    fontSize: 16,
    color: 'rgba(176, 186, 205, 1)',
  },

  inputGroup: {
    marginBottom: 10,
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(230, 233, 239, 1)',
    borderRadius: 4,
    overflow: 'hidden',
    height: 50,
  },

  button: {
    padding: 10,
    backgroundColor: 'rgba(230, 233, 239, 1)',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 20,
    color: 'rgba(86, 91, 103, 1)',
  },

  priceInput: {
    fontSize: 18,
    color: 'rgba(37, 37, 37, 1)',
    textAlign: 'center',
    paddingVertical: 10,
  },

  textInputView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(230, 233, 239, 1)',
    borderRadius: 5,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  submitButtons: {
    marginTop: 10,
    gap: 10,
  },

  submitButton: {
    height: 33,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },

  submitButtonText: {
    ...textStyle,
    color: 'white',
  },
});

export default PlaceOrderForm;
