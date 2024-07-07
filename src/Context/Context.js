import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const pkg = require('../../package.json');

// socket connection
import {connectSocket} from '../socket/socket';

// ip
import {ip} from '../config';
import {Alert} from 'react-native';
import {getSymbolIndexFromWallet, waitFor} from '../utils';

export const Context = createContext();

const ContextProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [updatAvailable, setUpdatAvailable] = useState(false);
  const [s3BaseUrl, setS3BaseUrl] = useState('');
  const [socket, setSocket] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [val, setVal] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [userBalance, setUserBalance] = useState(0);
  const [userId, setUserId] = useState(null);

  async function isUpdateAvailable() {
    try {
      let result = await axios.get(`${ip}/api/config`);

      setS3BaseUrl(result?.data?.s3_bucket_base_url);

      let app_version_number_from_config = parseFloat(
        result.data.app_version_number,
      );

      let local_app_version = parseFloat(pkg.version);

      console.log(
        'local_app_version',
        local_app_version,
        'app_version_number_from_config',
        app_version_number_from_config,
      );

      if (app_version_number_from_config > local_app_version) {
        setUpdatAvailable(true);
      } else {
        console.log('update available false');
        setUpdatAvailable(false);
      }
    } catch (e) {
      console.log(
        'update available check error',
        e?.response?.data?.message || e.message,
      );
    }
  }

  async function setUserDetails(newToken, userDetails) {
    // set the token in asyncStorage
    await AsyncStorage.setItem('token', newToken);

    // connectToSocket
    let socketInternal = connectSocket(newToken);
    setSocket(socketInternal);

    // set usertoken
    setUserToken(newToken);

    // get ball symbolIndex
    let symbolIndex = getSymbolIndexFromWallet(userDetails.wallet, 'BALL');
    if (symbolIndex == -1) {
      setUserBalance(0);
    } else {
      let balance = userDetails.wallet[symbolIndex].available;
      if (balance == null) {
        setUserBalance('--');
      }
      setUserBalance(balance);
    }

    setEmail(userDetails.email);
    setUserName(userDetails.userName);
    setUserId(userDetails._id);
    setIsLoggedIn(true);

    // set the context variable
    setIsLoggedIn(true);
  }

  const checkToken = async () => {
    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token from AsyncStorage', token);

      if (token) {
        const response = await axios.get(`${ip}/api/users`, {
          headers: {token: token},
        });

        if (response.status === 200) {
          setUserToken(token);

          let userData = response.data;

          // get ball symbolIndex
          let symbolIndex = getSymbolIndexFromWallet(userData.wallet, 'BALL');
          if (symbolIndex == -1) {
            setUserBalance(0);
          } else {
            let balance = userData.wallet[symbolIndex].available;
            if (balance == null) {
              setUserBalance('--');
            } else {
              setUserBalance(balance);
            }
          }

          setEmail(userData.email);
          setUserName(userData.userName);
          setUserId(userData._id);

          setIsLoggedIn(true);

          // connectToSocket
          let socketInternal = connectSocket(token);
          setSocket(socketInternal);
        } else {
          setUserToken(null);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log('Error checking token', error);
      Alert.alert(
        'API Error Config',
        error?.response?.data?.message || error.message,
      );
      setUserToken(null);
      setIsLoggedIn(false);
    } finally {
      await waitFor(2000);
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUserToken(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.log('Error during logout', error);
    }
  };

  useEffect(() => {
    isUpdateAvailable();
    checkToken();
  }, []);

  return (
    <Context.Provider
      value={{
        isLoading,
        updatAvailable,
        s3BaseUrl,
        userToken,
        isLoggedIn,
        setIsLoggedIn,
        setIsLoading,
        setUserToken,
        val,
        setVal,
        socket,
        setSocket,
        userName,
        email,
        userBalance,
        setUserDetails,
        setUserBalance,
        logout,
        userId,
      }}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
