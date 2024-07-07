import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Context} from '../Context/Context';
import WithdrawModal from './WithdrawModal';

const Withdraw = () => {
  const navigation = useNavigation();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const {userBalance} = useContext(Context);
  const [widthDrawModal, setWidthDrawModal] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  const toggleWithDrawModal = () => {
    // setWidthDrawModal(!widthDrawModal);
    Alert.alert('Withdraw not enabled', 'Currently Withdraw is not Avaliable');
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.navigate('WalletIndex')}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>Withdraw</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.label}>Address</Text>
            <TextInput placeholder="Long press to paste" style={styles.input} />
            <Text style={styles.label}>Network</Text>
            <View style={styles.networkContainer}>
              <Text style={styles.inputNetwork}>BNB Smart Chain (BEP20)</Text>
            </View>
            <Text style={styles.label}>Withdrawal Amount</Text>
            <View style={styles.amountContainer}>
              <TextInput
                placeholder="Minimum"
                style={styles.inputAmount}
                value={withdrawalAmount}
                onChangeText={setWithdrawalAmount}
              />
              <TouchableOpacity
                style={{justifyContent: 'center'}}
                onPress={() => setWithdrawalAmount(userBalance?.toFixed(3))}>
                <Text style={styles.maxText}>Max</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.availableContainer}>
              <Text style={styles.availableText}>Available</Text>
              <Text style={styles.availableAmount}>
                {userBalance?.toFixed(3)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      {!keyboardVisible && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryText}>Receive Amount</Text>
            <Text style={styles.summaryValue}>
              0.00
              <Text style={styles.currency}> BALL</Text>
            </Text>
            <View style={styles.networkFeeContainer}>
              <Text style={styles.summaryText}>Network Fee</Text>
              <Text style={styles.networkFeeValue}>1 BALL</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={toggleWithDrawModal}
            style={[styles.withdrawButton, {opacity: 0.5}]}>
            <Text style={styles.withdrawButtonText}>Withdraw</Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '10%',
    marginHorizontal: '5%',
    marginBottom: '5%',
  },
  backArrow: {
    fontSize: 30,
    paddingBottom: 15,
    color: 'black',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 10,
    fontFamily: 'Roboto',
    color: 'black',
  },
  content: {
    marginHorizontal: '5%',
  },
  label: {
    padding: 3,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: 'black',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(230, 233, 239, 0.5)',
    padding: 10,
    borderRadius: 3,
    marginBottom: 20,
  },
  networkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputNetwork: {
    flex: 1,
    height: 50,
    backgroundColor: 'rgba(230, 233, 239, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 3,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputAmount: {
    flex: 1,
    height: 50,
    backgroundColor: 'rgba(230, 233, 239, 0.5)',
    padding: 10,
    borderRadius: 3,
  },
  maxText: {
    position: 'absolute',
    right: 10,
    color: 'rgba(0, 33, 94, 1)',
    fontSize: 12,
  },
  availableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  availableText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Roboto',
    color: 'rgba(81, 81, 81, 1)',
  },
  availableAmount: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: 'black',
  },
  summaryContainer: {
    position: 'absolute',
    bottom: 20,
    left: '5%',
    right: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryText: {
    fontSize: 12,
    color: 'rgba(109, 109, 109, 1)',
    fontFamily: 'Roboto',
    fontWeight: '400',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  currency: {
    fontSize: 12,
    color: 'black',
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
  networkFeeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  networkFeeValue: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '500',
    color: 'black',
  },
  withdrawButton: {
    width: 115,
    height: 44,
    backgroundColor: 'rgba(0, 33, 94, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  withdrawButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
});

export default Withdraw;
