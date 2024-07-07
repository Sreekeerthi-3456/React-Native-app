import React, {useContext, useRef, useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Context} from '../Context/Context';
import {ip} from '../config';

const Otp = () => {
  // get context variables
  const {setUserDetails} = useContext(Context);

  const [isMailSending, setIsMailSending] = useState(false);

  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const otpRef = useRef([]);
  const navigation = useNavigation();

  const handleBackFocus = (e, index) => {
    if (index === 0) return;

    if (e.nativeEvent.key === 'Backspace') {
      otpRef.current[index - 1].focus();
    }
  };

  async function sendMailAgain() {
    try {
      setIsMailSending(true);
      let existingEmail = await AsyncStorage.getItem('email');

      // api call
      const response = await axios.post(
        `${ip}/api/users/authenticate/send-mail`,
        {email: existingEmail},
      );

      // get response headers
      const token = response.headers.token;

      // set the response headers as temp-token
      await AsyncStorage.setItem('temp-token', token);
    } catch (e) {
      Alert.alert('API Error', e.response.data.message || e.message);
    } finally {
      setIsMailSending(false);
    }
  }

  const validateOtp = async () => {
    if (otp.includes('')) {
      setError('Please fill all the OTP fields');
      return;
    }

    try {
      // get the temp token
      const tempToken = await AsyncStorage.getItem('temp-token');

      // call the authenticate mail otp
      const response = await axios.post(
        `${ip}/api/users/authenticate/mail/otp`,
        {otp: otp.join('')},
        {headers: {token: tempToken}},
      );

      // get the token
      const newToken = response.headers.token;

      // set token to async storage
      await AsyncStorage.setItem('token', newToken);

      // set user details
      await setUserDetails(newToken, response.data);
    } catch (error) {
      console.log('Error', error);
      if (error.response.status == 400) {
        setError('Invalid OTP');
      } else if (error.response.status === 404) {
        await AsyncStorage.setItem('temp-token', error.response.headers.token);
        navigation.navigate('UserName');
      } else {
        Alert.alert('Error Internal Server Error');
      }
    } finally {
    }
  };

  return (
    <View style={styles.root}>
      {isMailSending && (
        <Modal animationType="slide" transparent={true} visible={isMailSending}>
          <View
            style={{
              backgroundColor: 'rgba(74, 81, 153, 0.9)',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}>
            <ActivityIndicator color={'white'} />
            <Text style={{color: 'white'}}>{'sending Mail again...'}</Text>
          </View>
        </Modal>
      )}
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('LoginScreen')}
            style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.titleBelow}>
            Enter the verification code we just sent on your email address.
          </Text>
        </View>
        <View style={styles.otpContainer}>
          {otp.map((_, index) => (
            <TextInput
              ref={el => (otpRef.current[index] = el)}
              key={index}
              style={[
                styles.otpBox,
                {color: 'black'},
                error ? {borderColor: 'red'} : null,
              ]}
              keyboardType="number-pad"
              maxLength={1}
              onKeyPress={e => handleBackFocus(e, index)}
              onChangeText={text => {
                const newOtp = [...otp];
                newOtp[index] = text;
                setOtp(newOtp);

                if (text.length >= 1 && index !== otpRef.current.length - 1) {
                  otpRef.current[index + 1].focus();
                } else if (text.length < 1 && index !== 0) {
                  otpRef.current[index - 1].focus();
                }
              }}
            />
          ))}
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={[
            styles.verify,
            otp.every(value => value !== '')
              ? {backgroundColor: 'rgba(0, 33, 94, 1)'}
              : {backgroundColor: 'rgba(0, 33, 94, 0.5)'},
          ]}
          onPress={validateOtp}>
          <Text style={styles.verifyText}>Verify</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text
            style={[
              styles.footerText,
              {color: 'rgba(30, 35, 44, 1)', fontWeight: '500'},
            ]}>
            Didn’t receive the code?
          </Text>
          <TouchableOpacity
            onPress={() => {
              sendMailAgain();
            }}>
            <Text
              style={[
                styles.footerText,
                {color: 'rgba(0, 14, 39, 1)', fontWeight: '800'},
              ]}>
              Resend
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Otp;

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    flex: 1,
  },
  container: {
    marginTop: '7%',
    marginHorizontal: '5%',
  },
  header: {
    marginBottom: '10%',
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
  title: {
    color: 'rgba(30, 35, 44, 1)',
    fontFamily: 'Roboto',
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 39,
    paddingBottom: 10,
  },
  titleBelow: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 16,
    color: 'rgba(109, 109, 109, 1)',
    lineHeight: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '7%',
    gap: 6,
  },
  otpBox: {
    width: 65,
    height: 50,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(176, 186, 205, 1)',
    textAlign: 'center',
    fontSize: 24,
  },
  verify: {
    backgroundColor: 'rgba(0, 33, 94, 1)',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 4,
    marginBottom: '5%',
  },
  verifyText: {
    color: 'rgba(230, 233, 239, 1)',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    alignSelf: 'center',
    gap: 5,
    flexDirection: 'row',
  },
  footerText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    lineHeight: 22.4,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
