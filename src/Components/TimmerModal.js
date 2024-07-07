import React, {useContext} from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const TimmerModal = ({isVisible, onClose}) => {
  return (
    <Modal animationType="none" transparent={true} visible={isVisible}>
      <View style={styles.blurBack}>
        <View style={styles.container}>
          <View>
            <Text style={[styles.textStyle, {fontSize: 14}]}>
              Trade Will Start After 5 Overs
            </Text>
            <Text style={[styles.textStyle, {paddingTop: 15, fontSize: 20}]}>
              30 BALL Left
            </Text>
          </View>
          <View style={{marginTop: '6%'}}>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: 'rgba(0, 33, 94, 1)'}]}
              onPress={onClose}>
              <Text style={[styles.buttonTextStyle, {color: '#FFFF'}]}>
                Okay
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
    width: 280,
    height: 140,
    backgroundColor: 'white',
    borderRadius: 5,
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: 15,
  },
  textStyle: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    textAlign: 'center',
    color: 'rgba(37, 37, 37, 1)',
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

export default TimmerModal;
