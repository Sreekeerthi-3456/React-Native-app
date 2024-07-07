import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';

import axios from 'axios';

// components
import RenderOrders from './RenderOrders';

// styles
import {textStyle} from '../primaryStyle';

// context
import {Context} from '../Context/Context';

// ip
import {ip} from '../config';

const OrderBook = ({
  tokenSymbol,
  contractId,
  orderType,
  setOrderPrice,
  lastPrice,
  priceDirection,
  markPrice,
}) => {
  const {socket, userToken} = useContext(Context);

  const [isLoading, setIsLoading] = useState(false);
  const [shortOrders, setShortOrders] = useState([]);
  const [longOrders, setLongOrders] = useState([]);

  async function getOrderBook() {
    try {
      setIsLoading(true);

      let response = await axios.get(
        `${ip}/api/contract/${contractId}/order-book`,
        {
          headers: {token: userToken},
        },
      );

      setShortOrders(response.data?.a);
      setLongOrders(response.data?.b);
    } catch (e) {
      Alert.alert(
        'API Error getOrderBook',
        e?.response?.data?.message || e.message,
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getOrderBook();

    socket.on('order-book', data => {
      setShortOrders(data.a);
      setLongOrders(data.b);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.viewBalanceContainer}>
        <View>
          <Text
            style={[
              styles.textStyle,
              {
                textAlign: 'left',
                flexWrap: 'wrap',
                fontSize: 12,
                color: 'rgba(82, 87, 99, 1)',
              },
            ]}>
            Price
          </Text>
          <Text
            tyle={[
              styles.textStyle,
              {
                textAlign: 'left',
                flexWrap: 'wrap',
                fontSize: 12,
                color: 'rgba(82, 87, 99, 1)',
              },
            ]}>
            (BALL)
          </Text>
        </View>
        <View
          style={{justifyContent: 'flex-end', position: 'absolute', right: 20}}>
          <Text
            style={[
              styles.textStyle,
              {
                textAlign: 'right',
                flexWrap: 'nowrap',
                overflow: 'hidden',
                fontSize: 12,
                color: 'rgba(82, 87, 99, 1)',
              },
            ]}>
            Quantity
          </Text>
          <Text
            style={[
              styles.textStyle,
              {
                textAlign: 'right',
                flexWrap: 'wrap',
                fontSize: 12,
                color: 'rgba(82, 87, 99, 1)',
              },
            ]}>
            {`(${tokenSymbol?.slice(0, -4)})`}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={styles.orderBook}>
          {/* shortOrders */}
          <View
            style={{
              height: '45%',
              overflow: 'scroll',
              justifyContent: 'flex-end',
            }}>
            <RenderOrders
              orders={shortOrders}
              orderSide={'short'}
              selectedOrderType={orderType}
              setOrderPrice={setOrderPrice}
            />
          </View>

          {/* lastPrice */}
          <View
            style={{
              height: '10%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* lastPrice */}
            <Text
              style={{
                color:
                  priceDirection === 'positive'
                    ? 'rgba(16, 167, 96, 1)'
                    : priceDirection === 'negative'
                    ? 'rgba(240, 68, 56, 1)'
                    : 'black',
              }}>
              {isNaN(parseFloat(lastPrice).toFixed(4))
                ? '--'
                : parseFloat(lastPrice).toFixed(4)}
            </Text>
            {/* markPrice */}
            <Text style={[{color: 'grey'}, styles.textStyle]}>
              {isNaN(parseFloat(markPrice).toFixed(4))
                ? '--'
                : parseFloat(markPrice).toFixed(4)}
            </Text>
          </View>

          {/* longOrders */}
          <View
            style={{
              height: '45%',
              overflow: 'hidden',
            }}>
            <RenderOrders
              orders={longOrders}
              orderSide={'long'}
              selectedOrderType={orderType}
              setOrderPrice={setOrderPrice}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'space-between',
    // paddingVertical: 30,
  },

  viewBalanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  textStyle: {
    ...textStyle,
    fontWeight: '600',
  },

  orderBook: {
    paddingHorizontal: 5,
    flex: 1,
  },
});

export default OrderBook;
