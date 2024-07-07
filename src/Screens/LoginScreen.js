import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
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
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {ip} from '../config';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const sendMail = async () => {
    try {
      setIsLoading(true);

      await AsyncStorage.setItem('email', email);

      // api call
      const response = await axios.post(
        `${ip}/api/users/authenticate/send-mail`,
        {email: email},
      );

      // get response headers
      const token = response.headers.token;

      // set the response headers as temp-token
      await AsyncStorage.setItem('temp-token', token);

      // navigate to opt screen
      navigation.navigate('Otp');
    } catch (error) {
      console.log('Error', error.message);
      Alert.alert(
        'API Error Login',
        error?.response?.data?.message || error.message,
      );
    } finally {
      setIsLoading(false);
    }
  };

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
            <Text style={{color: 'white'}}>{'sending Mail...'}</Text>
          </View>
        </Modal>
      )}
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.loginText}>login</Text>
          <Text style={styles.loginBelowText}>
            Please login with your Gmail address
          </Text>
        </View>
        <TextInput
          style={[styles.input, {color: 'black'}]}
          placeholder="example@gmail.com"
          placeholderTextColor="rgba(37, 37, 37, 0.5)"
          keyboardType="ascii-capable"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity style={styles.otp} onPress={sendMail}>
          <Text style={styles.otpText}>GET OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    marginTop: '15%',
    marginHorizontal: '5%',
    flex: 1,
  },
  header: {
    marginBottom: '18%',
  },
  loginText: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 30,
    color: 'rgba(30, 35, 44, 1)',
    paddingBottom: 10,
  },
  loginBelowText: {
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
    marginBottom: '7%',
    padding: 12,
  },
  otp: {
    backgroundColor: 'rgba(0, 33, 94, 1)',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 4,
  },
  otpText: {
    color: 'rgba(230, 233, 239, 1)',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
