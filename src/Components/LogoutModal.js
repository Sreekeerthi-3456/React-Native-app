import React, {useContext} from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Context} from '../Context/Context';

const LogoutModal = ({isVisible, onClose}) => {
  const {logout} = useContext(Context);
  async function logoutApp() {
    await logout();
  }
  return (
    <Modal animationType="none" transparent={true} visible={isVisible}>
      <View style={styles.blurBack}>
        <View style={styles.container}>
          <View>
            <Text style={styles.textStyle}>Are You Sure You Want</Text>
            <Text style={styles.textStyle}>To Logout?</Text>
          </View>

          <View style={{flexDirection: 'row', gap: 20, marginTop: '8%'}}>
            <TouchableOpacity style={styles.button} onPress={() => logoutApp()}>
              <Text
                style={[styles.buttonTextStyle, {color: 'rgba(0, 33, 94, 1)'}]}>
                Logout
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, {backgroundColor: 'rgba(0, 33, 94, 1)'}]}
              onPress={onClose}>
              <Text style={[styles.buttonTextStyle, {color: '#FFFF'}]}>No</Text>
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
    fontFamily: 'Poppins',
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

export default LogoutModal;
