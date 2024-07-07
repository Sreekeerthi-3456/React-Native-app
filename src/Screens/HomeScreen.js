import React, {useContext, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MarketNav from '../Navigation/MarketNav';
import {useNavigation} from '@react-navigation/native';
import {Context} from '../Context/Context';
import LogoutModal from '../Components/LogoutModal';
import axios from 'axios';
import {ip} from '../config';
import {
  displayNumberUpToNDecimals,
  getSymbolIndexFromWallet,
  waitFor,
} from '../utils';

const HomeScreen = () => {
  const navigation = useNavigation();

  const {userName, email, userBalance, socket, userToken, setUserBalance} =
    useContext(Context);

  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [balanceUpdating, setBalanceUpdating] = useState(false);

  const firstLetter = userName?.split('')[0]?.toUpperCase();

  socket.on('error', data => {
    console.log('error', data);
    Alert.alert(
      'Socket error',
      `${data?.message || data}-${data?.stack || '--'}`,
    );
  });

  async function setUserBalanceFn() {
    try {
      setBalanceUpdating(true);

      let result = await axios.get(`${ip}/api/users`, {
        headers: {token: userToken},
      });

      let userData = result.data;
      let symbolIndex = getSymbolIndexFromWallet(userData.wallet, 'BALL');
      if (symbolIndex == -1) {
        setUserBalance(0);
      } else {
        setUserBalance(userData.wallet[symbolIndex].available);
      }
    } catch (e) {
      Alert.alert(
        'API Error setUserBalance',
        e.response.data.message || e.message,
      );
    } finally {
      await waitFor(1000);
      setBalanceUpdating(false);
    }
  }

  const toggleLogoutModal = () => {
    setIsLogoutModalVisible(!isLogoutModalVisible);
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <View style={styles.userContainer}>
          <View style={styles.mainContainer}>
            <Text style={styles.userLetterText}>{firstLetter}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>{email}</Text>
          </View>
          <TouchableOpacity
            onPress={toggleLogoutModal}
            style={{position: 'absolute', right: 0}}>
            <Image
              style={{width: 21, height: 21}}
              source={require('../assets/logout.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.balanceContainer}>
          <View>
            <Text style={styles.balanceLabel}>Available balance</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <Text style={styles.balanceAmount}>
                {userBalance && displayNumberUpToNDecimals(userBalance, 3)}
              </Text>

              {balanceUpdating ? (
                <ActivityIndicator color="rgba(0, 33, 94, 1)" />
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setUserBalanceFn();
                  }}
                  style={{
                    width: '18%',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{
                      tintColor: 'rgba(0, 33, 94, 1)',
                      height: 20,
                      width: 20,
                    }}
                    source={require('../assets/refresh.png')}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Deposit')}
            style={styles.depositButton}>
            <Text style={styles.depositText}>Deposit</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.marketNavContainer}>
        <MarketNav />
      </View>
      <LogoutModal
        isVisible={isLogoutModalVisible}
        onClose={toggleLogoutModal}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    flex: 1,
  },
  container: {
    marginHorizontal: '5%',
    marginTop: '10%',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '3%',
    gap: 10,
  },
  mainContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderColor: 'rgba(0, 33, 94, 1)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userLetterText: {
    fontSize: 24,
    color: 'rgba(0, 33, 94, 1)',
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
  userName: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16,
    color: 'rgba(0, 33, 94, 1)',
  },
  userEmail: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(138, 153, 181, 1)',
  },
  notification: {
    position: 'absolute',
    right: 0,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(109, 109, 109, 1)',
    fontFamily: 'Roboto',
  },
  balanceAmount: {
    fontFamily: 'Roboto',
    fontSize: 24,
    color: 'rgba(0, 33, 94, 1)',
    fontWeight: '600',
  },
  depositButton: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 33, 94, 1)',
    borderRadius: 3,
    position: 'absolute',
    right: 0,
  },
  depositText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
  marketNavContainer: {
    flex: 1,
    marginTop: '5%',
  },
});
