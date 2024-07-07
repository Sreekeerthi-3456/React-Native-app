import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import KlineOrderBook from '../Components/KlineOrderBook';
import KlineChart from '../Components/KlineChart';
import {useNavigation} from '@react-navigation/native';
import {liveContractSocket} from '../socket/socket';

const RenderChart = ({route}) => {
  const navigation = useNavigation();
  const {contractId, contractName, lastPrice, markPrice} = route.params;
  const [klineData, setKlineData] = useState([]);
  const webViewRef = useRef(null);

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const updateKlineData = useCallback(
    debounce(data => {
      if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify(data));
      }
    }, 300),
    [],
  );
  useEffect(() => {
    liveContractSocket.emit('joinContractCandleRoom', {contractId});
  }, []);

  useEffect(() => {
    const fullDataOnConnect = fullData => {
      const formattedData = fullData.map(candle => ({
        x: new Date(candle.o),
        y: [candle.op, candle.hp, candle.lp, candle.cp],
      }));
      setKlineData(formattedData);
      updateKlineData(formattedData);
    };
    const newTrade = newTrade => {
      const formattedCandle = {
        x: new Date(newTrade.o),
        y: [newTrade.op, newTrade.hp, newTrade.lp, newTrade.cp],
      };
      setKlineData(prevData => {
        const updatedData = [...prevData];
        const existingIndex = updatedData.findIndex(
          candle => candle.x.getTime() === formattedCandle.x.getTime(),
        );
        if (existingIndex !== -1) {
          updatedData[existingIndex] = formattedCandle;
        } else {
          updatedData.push(formattedCandle);
        }
        const sortedData = updatedData.sort((a, b) => a.x - b.x);
        updateKlineData(sortedData);
        return sortedData;
      });
    };

    liveContractSocket.on('fullDataOnConnect', fullDataOnConnect);
    liveContractSocket.on('newTrade', newTrade);
  }, [contractId, updateKlineData]);

  return (
    <View style={styles.wrapper}>
      <ScrollView>
        <View style={styles.lastPriceContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ContractHome', {
                contractId,
                contractName,
                lastPrice,
              })
            }>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.lastPriceText}>Last Price</Text>
          <View style={styles.coinContainer}>
            <Text style={styles.coinText}>{contractName}</Text>
            <Text style={styles.coinPriceText}>
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
        <View style={styles.container}>
          <TouchableOpacity>
            <Text style={styles.textStyle}>Time</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[styles.textStyle, {color: '#515151'}]}>1m</Text>
          </TouchableOpacity>
        </View>
        <KlineChart klineData={klineData} webViewRef={webViewRef} />

        <KlineOrderBook
          contractId={contractId}
          contractName={contractName}
          lastPrice={lastPrice}
        />
      </ScrollView>
      <View style={{alignSelf: 'center', marginHorizontal: '6.3%'}}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ContractHome', {
                contractId,
                contractName,
                lastPrice,
              })
            }
            style={[styles.tradeButton, styles.buyButton]}>
            <Text style={styles.tradeButtonText}>Buy/Long</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ContractHome')}
            style={[styles.tradeButton, styles.sellButton]}>
            <Text style={styles.tradeButtonText}>Sell/Short</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: '3%',
    marginBottom: '5%',
  },
  textStyle: {
    fontSize: 14.5,
    fontWeight: '500',
    color: 'rgba(81, 81, 81, 0.5)',
    lineHeight: 15.6,
  },
  backButton: {
    position: 'absolute',
    top: 10,
  },
  backButtonText: {
    color: 'rgba(16, 16, 16, 1)',
    fontSize: 40,
    paddingBottom: 5,
  },
  lastPriceContainer: {
    marginBottom: 15,
    marginHorizontal: '4%',
  },
  lastPriceText: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: 'rgba(138, 153, 181, 1)',
  },
  coinContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  coinText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(37, 37, 37, 1)',
    textAlign: 'center',
  },
  coinPriceText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(16, 167, 96, 1)',
    textAlign: 'center',
  },
  tradeButton: {
    padding: 14,
    borderRadius: 5,
    marginBottom: 14,
    alignItems: 'center',
    width: '80%',
  },
  buyButton: {
    backgroundColor: 'rgba(18, 183, 106, 1)',
  },
  sellButton: {
    backgroundColor: 'rgba(240, 68, 56, 1)',
  },
  tradeButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  tradeButton: {
    padding: '4%',
    borderRadius: 5,
    marginBottom: 14,
    alignItems: 'center',
    width: '50%',
  },
  buyButton: {backgroundColor: 'rgba(18, 183, 106, 1)'},
  sellButton: {backgroundColor: 'rgba(240, 68, 56, 1)'},
  tradeButtonText: {fontSize: 16, color: '#fff'},
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    marginStart: 10,
    marginTop: 20,
  },
});

export default RenderChart;
