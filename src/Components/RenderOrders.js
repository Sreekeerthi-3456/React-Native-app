import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {textStyle} from '../primaryStyle';

const SingleOrderStrip = ({
  price,
  qty,
  orderSide,
  selectedOrderType,
  setOrderPrice,
}) => {
  return (
    <TouchableHighlight
      underlayColor="rgba(84, 106, 147, 0.5)"
      onPress={() => {
        if (selectedOrderType == 'limit') {
          setOrderPrice(parseFloat(price).toFixed(4));
        }
      }}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <Text
          style={[
            styles.textStyle,
            {
              color:
                orderSide === 'short'
                  ? 'rgba(242, 83, 81, 1)'
                  : 'rgba(18, 183, 106, 1)',

              width: '50%',
              textAlign: 'left',
              fontSize: 13,
            },
          ]}>
          {parseFloat(price).toFixed(4)}
        </Text>
        <Text
          style={[
            styles.textStyle,
            {
              width: '50%',
              textAlign: 'center',
              color: 'rgba(159, 161, 174, 1)',
              fontSize: 13,
            },
          ]}>
          {parseFloat(qty).toFixed(4)}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

const RenderOrders = ({
  orders,
  orderSide,
  selectedOrderType,
  setOrderPrice,
}) => {
  return (
    <View style={{gap: 5}}>
      {orders.map((el, index) => {
        return (
          <SingleOrderStrip
            key={index}
            price={el[0]}
            qty={el[1]}
            orderSide={orderSide}
            selectedOrderType={selectedOrderType}
            setOrderPrice={setOrderPrice}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    ...textStyle,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default RenderOrders;
