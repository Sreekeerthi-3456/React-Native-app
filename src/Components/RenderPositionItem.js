import React, {useEffect, useState} from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

// liveContractSocket
import {liveContractSocket, adminSocket} from '../socket/socket';

const RenderPositionItem = ({
  from,
  item,
  setShowClosePosition,
  setCloseData,
}) => {
  const [lastPrice, setLastPrice] = useState(0);
  const [markPrice, setMarkPrice] = useState(0);

  function connectSocket() {
    liveContractSocket.emit('lastPrice', {contractId: item?.contractId});

    liveContractSocket.on(`lastPrice_${item?.contractId}`, data => {
      setLastPrice(Math.abs(data.lastPrice));
    });
  }

  useEffect(() => {
    // join in getBall socket
    adminSocket.emit('joinRoom', {roomName: item?.contractId});

    adminSocket.on(`ball_${item?.dataToSend}`, data => {
      if (data?.markPrice != null) {
        setMarkPrice(data?.markPrice);
      }
    });

    connectSocket();
  }, []);

  return (
    <View
      style={{
        paddingHorizontal: 5,
        gap: 10,
        paddingVertical: 15,
        borderBottomWidth: 0.5,
      }}>
      {/* Token symbol and cancel button */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
          style={{gap: 3, flexDirection: 'row', alignItems: 'center', gap: 5}}>
          <View
            style={{
              height: 10,
              width: 10,
              backgroundColor:
                item.size > 0
                  ? 'rgba(18, 183, 106, 1)'
                  : 'rgba(240, 68, 56, 1)',
            }}></View>
          <Text
            style={[
              styles.textStyle,
              {
                color: 'rgba(37, 37, 37, 1)',
                fontSize: 20,
                fontWeight: '700',
              },
            ]}>
            {item?.symbol || '--'}
          </Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(138, 153, 181, 1)',
            width: '15%',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            height: 25,
          }}
          onPress={() => {
            setShowClosePosition(true);
            item.lastPrice = lastPrice;
            setCloseData(item);
          }}>
          <Text style={[styles.textStyle, {color: 'white', fontSize: 12}]}>
            Close
          </Text>
        </TouchableOpacity>
      </View>

      {/* size */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={[
            styles.textStyle,
            {color: 'rgba(109, 109, 109, 1)', fontSize: 16},
          ]}>
          Size
        </Text>
        <Text
          style={[
            styles.textStyle,
            {color: 'rgba(109, 109, 109, 1)', fontSize: 16},
          ]}>
          {Math.abs(item?.size)}
        </Text>
      </View>

      {/* unRealized pnl*/}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={[
            styles.textStyle,
            {color: 'rgba(109, 109, 109, 1)', fontSize: 16},
          ]}>
          UnRealized Pnl
        </Text>
        <Text
          style={[
            styles.textStyle,
            {
              color:
                (lastPrice - item?.avgPrice) * item?.size >= 0
                  ? 'rgba(18, 183, 106, 1)'
                  : 'rgba(240, 68, 56, 1)',
              fontSize: 16,
            },
          ]}>
          {((lastPrice - item?.avgPrice) * item?.size).toFixed(4)}
        </Text>
      </View>

      {/* ROI */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={[
            styles.textStyle,
            {color: 'rgba(109, 109, 109, 1)', fontSize: 16},
          ]}>
          ROI
        </Text>
        <Text
          style={[
            styles.textStyle,
            {
              color:
                ((lastPrice - item?.avgPrice) * 100 * item?.size) /
                  Math.abs(item?.size) /
                  item?.avgPrice >=
                0
                  ? 'rgba(18, 183, 106, 1)'
                  : 'rgba(240, 68, 56, 1)',
              fontSize: 16,
            },
          ]}>
          {(
            ((lastPrice - item?.avgPrice) * 100 * item?.size) /
            Math.abs(item?.size) /
            item?.avgPrice
          ).toFixed(4)}
          %
        </Text>
      </View>

      {/* margin */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={[
            styles.textStyle,
            {color: 'rgba(109, 109, 109, 1)', fontSize: 16},
          ]}>
          Margin
        </Text>
        <Text
          style={[
            styles.textStyle,
            {color: 'rgba(81, 81, 81, 1)', fontSize: 16},
          ]}>
          {parseFloat(item?.margin).toFixed(4)}
        </Text>
      </View>

      {/* entry price */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={[
            styles.textStyle,
            {color: 'rgba(109, 109, 109, 1)', fontSize: 16},
          ]}>
          Entry Price
        </Text>
        <Text
          style={[
            styles.textStyle,
            {color: 'rgba(81, 81, 81, 1)', fontSize: 16},
          ]}>
          {item?.avgPrice?.toFixed(4)}
        </Text>
      </View>

      {/* liquidation price */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={[
            styles.textStyle,
            {color: 'rgba(109, 109, 109, 1)', fontSize: 16},
          ]}>
          Liq Price
        </Text>
        <Text
          style={[
            styles.textStyle,
            {color: 'rgba(81, 81, 81, 1)', fontSize: 16},
          ]}>
          {item?.liqPrice?.toFixed(4)}
        </Text>
      </View>

      {/* last price */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={[
            styles.textStyle,
            {color: 'rgba(109, 109, 109, 1)', fontSize: 16},
          ]}>
          Last Price
        </Text>
        <Text
          style={[
            styles.textStyle,
            {color: 'rgba(81, 81, 81, 1)', fontSize: 16},
          ]}>
          {parseFloat(lastPrice).toFixed(4)}
        </Text>
      </View>

      {/* mark price */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={[
            styles.textStyle,
            {color: 'rgba(109, 109, 109, 1)', fontSize: 16},
          ]}>
          Mark Price
        </Text>
        <Text
          style={[
            styles.textStyle,
            {color: 'rgba(81, 81, 81, 1)', fontSize: 16},
          ]}>
          {isNaN(parseFloat(markPrice).toFixed(4))
            ? '--'
            : parseFloat(markPrice).toFixed(4)}
        </Text>
      </View>
    </View>
  );
};

export default RenderPositionItem;

const styles = StyleSheet.create({});
