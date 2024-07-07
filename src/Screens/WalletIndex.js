import React, {useContext, useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Alert,
} from 'react-native';
import WalletTransactionItem from '../Components/WalletTransactionItem';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Context} from '../Context/Context';
import {ip} from '../config';
import axios from 'axios';
import {textStyle} from '../primaryStyle';
import {displayNumberUpToNDecimals, getSymbolIndexFromWallet} from '../utils';

const WalletIndex = () => {
  const navigation = useNavigation();
  const {userBalance, userToken, setUserBalance} = useContext(Context);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentBal, setCurrentBal] = useState(userBalance);

  const fetchWalletTransactions = async () => {
    try {
      const response = await axios.get(
        `${ip}/api/users/transactions?type=latest`,
        {
          headers: {
            token: userToken,
          },
        },
      );

      setTransactions(response.data);
    } catch (error) {
      console.log('WalletIndex error', error);
      Alert.alert(
        'API Error WalletIndex',
        error?.response?.data?.message || error?.message,
      );
    }
  };

  async function getUser() {
    try {
      let result = await axios.get(`${ip}/api/users`, {
        headers: {token: userToken},
      });

      let userData = result.data;
      let userWallet = userData.wallet;

      let symbolIndex = getSymbolIndexFromWallet(userWallet, 'BALL');
      if (symbolIndex == -1) {
        setUserBalance(0);
      } else {
        let funds = userWallet[symbolIndex].available;
        setUserBalance(funds);
        setCurrentBal(funds);
      }
    } catch (e) {
      throw e;
    }
  }

  async function refreshWallet() {
    try {
      setIsLoading(true);
      await fetchWalletTransactions();
      await getUser();
    } catch (e) {
      Alert.alert(
        'API Error refresh wallet',
        e.response.data.message || e.message,
      );
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      refreshWallet();
    }, []),
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/imageback.png')}
        style={styles.balanceContainer}>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 12,
              color: 'rgba(81, 81, 81, 1)',
              fontFamily: 'Roboto',
              fontWeight: '500',
            }}>
            Current Balance
          </Text>
          <Text
            style={{
              fontSize: 36,
              color: 'rgba(37, 37, 37, 1)',
              fontFamily: 'Roboto',
              fontWeight: '700',
            }}>
            {currentBal && displayNumberUpToNDecimals(currentBal, 4)}
          </Text>
        </View>
        <View style={styles.imageRow}>
          <View style={styles.imageContainer}>
            {/* <TouchableOpacity onPress={() => navigation.navigate('Withdraw')}> */}
            <View style={{opacity: 0.5}}>
              <Image
                source={require('../assets/arrowup.png')}
                style={styles.image}
              />
            </View>
            {/* </TouchableOpacity> */}
            <Text style={[styles.label, styles.textStyle]}>Withdraw</Text>
          </View>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Deposit')}>
              <Image
                source={require('../assets/arrowdown.png')}
                style={styles.image}
              />
            </TouchableOpacity>
            <Text style={[styles.label, styles.textStyle]}>Deposit</Text>
          </View>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Image
                source={require('../assets/history.png')}
                style={styles.image}
              />
            </TouchableOpacity>
            <Text style={[styles.label, styles.textStyle]}>History</Text>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.transactionsContainer}>
        <Text style={styles.recentTransactionsTitle}>Recent Transactions</Text>
      </View>
      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          renderItem={({item, index}) => (
            <WalletTransactionItem
              item={item}
              isFirst={index === 0}
              isLast={index === transactions.length - 1}
            />
          )}
          refreshing={isLoading}
          onRefresh={() => refreshWallet()}
          keyExtractor={item => item._id}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No Recent Transactions</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  balanceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 220,
    gap: 25,
  },
  balanceText: {
    fontSize: 12,
    color: 'rgba(81, 81, 81, 1)',
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 36,
    color: 'rgba(37, 37, 37, 1)',
    fontFamily: 'Roboto',
    fontWeight: '500',
  },

  textStyle: {
    ...textStyle,
    fontSize: 12,
  },

  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
  },
  label: {
    fontSize: 12,
    marginTop: 5,
  },
  transactionsContainer: {
    marginVertical: '5%',
    marginHorizontal: '5%',
  },
  recentTransactionsTitle: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: 'rgba(37, 37, 37, 1)',
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  noDataText: {
    color: 'rgba(176, 186, 205, 1)',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default WalletIndex;
