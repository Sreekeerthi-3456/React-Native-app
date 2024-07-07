import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const OpenOrderCloseModal = ({
  cancelOpenOrder,
  setCancelOpenOrder,
  cancelOrder,
}) => {
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={cancelOpenOrder}
      onRequestClose={() => setCancelOpenOrder(false)}>
      <View style={styles.blurBack}>
        <View style={styles.container}>
          <View>
            <Text style={styles.textStyle}>Are You Sure You Want</Text>
            <Text style={styles.textStyle}>To Cancel?</Text>
          </View>
          <View style={{flexDirection: 'row', gap: 20, marginTop: '8%'}}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setCancelOpenOrder(false)}>
              <Text
                style={[styles.buttonTextStyle, {color: 'rgba(0, 33, 94, 1)'}]}>
                No
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: 'rgba(0, 33, 94, 1)'}]}
              onPress={() => {
                cancelOrder();
              }}>
              <Text style={[styles.buttonTextStyle, {color: '#FFFF'}]}>
                Yes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurBack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(84, 106, 147, 0.5)',
  },
  container: {
    width: 300,
    height: 140,
    backgroundColor: 'white',
    borderRadius: 5,
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: 15,
  },
  textStyle: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center',
    color: 'rgba(109, 109, 109, 1)',
  },
  button: {
    width: 120,
    height: 40,
    borderRadius: 5,
    borderColor: 'rgba(74, 81, 153, 1)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextStyle: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
});

export default OpenOrderCloseModal;
