import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

const WithdrawModal = ({isVisible, onClose}) => {
  return (
    <Modal animationType="none" transparent={true} visible={isVisible}>
      <View style={styles.blurBack}>
        <View
          style={{
            backgroundColor: 'white',
            width: 280,
            height: 150,
          }}>
          <TouchableOpacity onPress={onClose}>
            <Image
              style={{
                position: 'absolute',
                right: 10,
                width: 20,
                height: 20,
                margin: 5,
              }}
              source={require('../assets/cross.png')}
            />
          </TouchableOpacity>
          <View style={{marginVertical: '15%', marginHorizontal: 10}}>
            <Text style={{textAlign: 'center', paddingBottom: 15}}>
              Please entre your mobile number
            </Text>
            <View style={styles.amountContainer}>
              <TextInput placeholder="XXXXXXXX34" style={styles.inputAmount} />
              <TouchableOpacity style={{justifyContent: 'center'}}>
                <Text style={styles.maxText}>Verify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default WithdrawModal;

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(230, 233, 239, 0.5)',
    padding: 10,
    borderRadius: 3,
    marginBottom: 20,
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
  blurBack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(84, 106, 147, 0.5)',
  },
});
