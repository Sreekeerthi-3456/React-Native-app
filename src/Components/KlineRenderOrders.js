import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {textStyle} from '../primaryStyle';

const KlineSingleOrder = ({
  price,
  qty,
  orderSide,
  selectedOrderType,
  setOrderPrice,
}) => {
  return (
    <TouchableHighlight
      underlayColor="white"
      onPress={() => {
        if (selectedOrderType == 'limit') {
          setOrderPrice(parseFloat(price).toFixed(3));
        }
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
        }}>
        <Text
          style={[
            styles.textStyle,
            {
              color:
                orderSide === 'short'
                  ? 'rgba(242, 83, 81, 1)'
                  : 'rgba(18, 183, 106, 1)',
            },
          ]}>
          {parseFloat(price).toFixed(4)}
        </Text>
        <Text style={styles.textStyle}>{parseFloat(qty).toFixed(4)}</Text>
      </View>
    </TouchableHighlight>
  );
};

const KlineRenderOrders = ({
  orders,
  orderSide,
  selectedOrderType,
  setOrderPrice,
}) => {
  return (
    <View style={{gap: 5}}>
      {orders.map((el, index) => {
        return (
          <KlineSingleOrder
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
    color: 'rgba(159, 161, 174, 1)',
  },
});

export default KlineRenderOrders;
