import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// context
import {Context} from '../Context/Context';

// ip
import {ip} from '../config';

// socketconnect
import {connectSocket} from '../socket/socket';
import {textStyle} from '../primaryStyle';

const UserName = () => {
  const {setUserDetails} = useContext(Context);

  const [userName, setUserName] = useState('');
  const [uniqueUserNameError, setUniqueUserNameError] = useState({
    display: false,
    message: '',
    isUnique: false,
  });
  const checkingRef = useRef(0);
  const [isLoading, setIsLoading] = useState(false);

  const createUser = async () => {
    try {
      setIsLoading(true);

      const tempToken = await AsyncStorage.getItem('temp-token');
      const response = await axios.post(
        `${ip}/api/users/signup`,
        {userName: userName},
        {headers: {token: tempToken}},
      );

      if (response.status === 200 || response.status === 201) {
        let token = response.headers.token;

        setUserDetails(token, response.data);
      }
    } catch (error) {
      console.error('Error', error.response.data.message);
      Alert.alert(
        'API Error signup',
        error?.response?.data?.message || error.message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  async function checkIsUserNameUnique() {
    try {
      const result = await axios.post(
        `${ip}/api/users/check/username/unique-username`,
        {
          userName: userName,
        },
      );

      if (!result.data?.message) {
        setUniqueUserNameError({
          display: true,
          message: 'userName already exists',
          isUnique: false,
        });
      } else {
        setUniqueUserNameError({
          display: false,
          message: '',
          isUnique: true,
        });
      }
    } catch (e) {
      if (e?.response?.status == 400) {
        setUniqueUserNameError({
          display: true,
          message: e?.response?.data?.message,
          isUnique: false,
        });
      } else {
        Alert.alert(
          'API Error checkIsUserNameUnique',
          e.response.data.message || e.message,
        );
      }
    }
  }

  useEffect(() => {
    if (checkingRef.current > 0) {
      checkIsUserNameUnique();
    }
  }, [userName]);

  return (
    <View style={styles.root}>
      {isLoading && (
        <Modal animationType="slide" transparent={true} visible={isLoading}>
          <View
            style={{
              backgroundColor: 'rgba(74, 81, 153, 0.9)',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}>
            <ActivityIndicator color={'white'} />
            <Text style={{color: 'white'}}>{'signing up...'}</Text>
          </View>
        </Modal>
      )}

      <View style={styles.container}>
        <View style={styles.header}>
          {/* <TouchableOpacity
            onPress={() => navigation.navigate('LoginScreen')}
            style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity> */}
          <Text style={styles.UserText}>User Name</Text>
          <Text style={styles.UserBelowText}>
            Please provide a unique username.
          </Text>
        </View>

        <View style={{paddingVertical: 5}}>
          <TextInput
            style={[styles.input, styles.textStyle]}
            placeholder="LunaLyric"
            placeholderTextColor="rgba(37, 37, 37, 0.5)"
            keyboardType="ascii-capable"
            value={userName}
            onChangeText={text => {
              setUserName(text);
              checkingRef.current = checkingRef.current + 1;
            }}
          />
          {uniqueUserNameError.display ? (
            <Text style={[styles.textStyle, {color: 'red'}]}>
              {uniqueUserNameError.message}
            </Text>
          ) : null}
        </View>

        {uniqueUserNameError.isUnique ? (
          <TouchableOpacity
            onPress={createUser}
            style={[styles.create, {backgroundColor: 'rgba(0, 33, 94, 1)'}]}>
            <Text style={styles.createText}>Create</Text>
          </TouchableOpacity>
        ) : (
          <View
            style={[styles.create, {backgroundColor: 'rgba(0, 33, 94, 0.5)'}]}>
            <Text style={styles.createText}>Create</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default UserName;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    marginTop: '10%',
    marginHorizontal: '5%',
    flex: 1,
  },
  header: {
    marginBottom: '18%',
  },
  backButton: {
    justifyContent: 'center',
  },
  backButtonText: {
    color: 'rgba(16, 16, 16, 1)',
    fontSize: 40,
    paddingBottom: 15,
    right: 5,
  },
  UserText: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 30,
    color: 'rgba(30, 35, 44, 1)',
    paddingBottom: 10,
  },
  textStyle: {
    ...textStyle,
  },
  UserBelowText: {
    color: 'rgba(109, 109, 109, 1)',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '400',
  },
  input: {
    height: 50,
    borderRadius: 4,
    backgroundColor: 'rgba(230, 233, 239, 0.5)',
    fontSize: 16,
    marginBottom: '2%',
    padding: 12,
  },
  create: {
    marginTop: 30,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 4,
  },
  createText: {
    color: 'rgba(230, 233, 239, 1)',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 16,
  },
});
