import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
} from 'react-native';
import axios from 'axios';
import Clipboard from '@react-native-clipboard/clipboard';
import QRCode from 'react-native-qrcode-svg';

// ip
import {ip} from '../config';

// context
import {Context} from '../Context/Context';

const Deposit = () => {
  const navigation = useNavigation();
  const {userToken} = useContext(Context);
  const [pubKey, setPubKey] = useState('');

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${ip}/api/users`, {
        headers: {
          token: userToken,
        },
      });

      setPubKey(response.data.pubKey);
    } catch (error) {
      console.log('Error while fetching', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const copyToClipboard = () => {
    Clipboard.setString(`${pubKey}`);
    Alert.alert(
      'Copied to Clipboard',
      'Public key has been copied to clipboard.',
    );
  };

  const shareAddress = async () => {
    try {
      const result = await Share.share({
        message: pubKey,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        }
      } else result.action === Share.dismissedAction;
    } catch (error) {
      Alert.alert(
        'Error',
        'An error occurred while trying to share the address.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={{marginHorizontal: '5%', flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Deposit</Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '10%',
          }}>
          {pubKey ? (
            <QRCode
              value={`${pubKey}`}
              size={160}
              color="rgba(0, 33, 94, 1)"
              backgroundColor="white"
            />
          ) : (
            <Text>Currenlty dcouldn't display publicAddress QR code.</Text>
          )}
          <Image
            source={require('../assets/line.png')}
            style={{width: '70%', marginTop: '10%', backgroundColor: 'white'}}
          />
        </View>
        <View style={styles.networkContainer}>
          <Text style={[styles.inputNetwork, {fontSize: 14}]}>{pubKey}</Text>
          <TouchableOpacity
            style={[
              styles.copyIconContainer,
              {
                backgroundColor: 'white',
                height: 45,
                width: '10%',
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
            onPress={copyToClipboard}>
            <Image
              source={require('../assets/copy.png')}
              style={{
                width: 13,
                height: 15,
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.networkContainer}>
          <Text style={[styles.inputNetwork, {fontSize: 16}]}>
            BNB smart chain (BEP20)
          </Text>
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <TouchableOpacity style={styles.share} onPress={() => shareAddress()}>
            <Text style={styles.shareText}>Share Address</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Deposit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '10%',
    marginBottom: '5%',
  },
  backArrow: {
    fontSize: 30,
    paddingBottom: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 10,
    fontFamily: 'Roboto',
    color: 'rgba(37, 37, 37, 1)',
  },
  networkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  inputNetwork: {
    flex: 1,
    height: 50,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 4,
    borderColor: 'rgba(230, 233, 239, 1)',
    borderWidth: 1,
    color: 'rgba(81, 81, 81, 1)',
  },
  copyIconContainer: {
    position: 'absolute',
    right: 2,
  },
  share: {
    height: 50,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 33, 94, 1)',
    justifyContent: 'center',
    marginBottom: '20%',
  },
  shareText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
});
