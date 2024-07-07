import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import axios from 'axios';
import {Context} from '../Context/Context';
import {ip} from '../config';
import KlineRenderOrders from './KlineRenderOrders';

const KlineOrderBook = ({contractId}) => {
  const {socket, userToken} = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [shortOrders, setShortOrders] = useState([]);
  const [longOrders, setLongOrders] = useState([]);
  async function getOrderBook() {
    try {
      setIsLoading(true);
      let response = await axios.get(
        `${ip}/api/contract/${contractId}/order-book`,
        {headers: {token: userToken}},
      );
      setShortOrders(response?.data?.a);
      setLongOrders(response?.data?.b);
    } catch (e) {
      Alert.alert(
        'API Error getOrderBook',
        e?.response?.data?.message || e?.message,
      );
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    getOrderBook();
    socket.on('order-book', data => {
      setShortOrders(data?.a);
      setLongOrders(data?.b);
    });
  }, []);
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Order Book</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={styles.rowContainer}>
          <View style={styles.scrollContainer}>
            <View style={styles.columnContainer}>
              <View style={styles.headerContainer}>
                <Text style={[styles.headerText, styles.priceHeader]}>
                  Price (BALL)
                </Text>
                <Text style={[styles.headerText, styles.quantityHeader]}>
                  Quantity (RCBMICOIN)
                </Text>
              </View>
              <KlineRenderOrders orders={longOrders} orderSide={'long'} />
            </View>
          </View>
          <View style={styles.scrollContainer}>
            <View style={styles.columnContainer}>
              <View style={styles.headerContainer}>
                <Text style={[styles.headerText, styles.priceHeader]}>
                  Price (BALL)
                </Text>
                <Text style={[styles.headerText, styles.quantityHeader]}>
                  Quantity (RCBMICOIN)
                </Text>
              </View>
              <KlineRenderOrders orders={shortOrders} orderSide={'short'} />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginHorizontal: '6%',
    alignSelf: 'center',
    marginBottom: '15%',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: 'rgba(37, 37, 37, 1)',
    lineHeight: 15.67,
    paddingVertical: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  headerText: {fontSize: 10.5, fontWeight: 'bold'},
  priceHeader: {
    width: 39,
    textAlign: 'left',
    fontWeight: '500',
    color: 'rgba(82, 87, 99, 1)',
  },
  quantityHeader: {
    width: 88,
    textAlign: 'right',
    fontWeight: '500',
    color: 'rgba(82, 87, 99, 1)',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 50,
  },
  scrollContainer: {width: '45%'},
  columnContainer: {flexDirection: 'column'},
  bidAskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  priceText: {fontSize: 12, width: 90, textAlign: 'left', fontWeight: '700'},
  quantityText: {
    fontSize: 12,
    width: 60,
    textAlign: 'right',
    fontWeight: '700',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
export default KlineOrderBook;
