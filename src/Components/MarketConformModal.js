import React from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';

const MarketConformModal = () => {
  return (
    <Modal>
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <View>
            <Text style={styles.titleText}>RCBMICOIN</Text>
            <Text style={styles.subTitleText}>Limit / buy</Text>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.row}>
              <Text style={styles.labelText}>Price</Text>
              <Text style={styles.valueText}>Market Price</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.labelText}>Amount</Text>
              <Text style={styles.valueText}>999.99 BALL</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.labelText}>Mark Price</Text>
              <Text style={styles.valueText}>522.22 BALL</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.labelText}>Cost</Text>
              <Text style={styles.valueText}>100 BALL</Text>
            </View>
          </View>
          <View style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MarketConformModal;

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: 'rgba(84, 106, 147, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 30,
    paddingTop: 20,
  },
  titleText: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
    color: 'rgba(37, 37, 37, 1)',
  },
  subTitleText: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 13,
    color: 'rgba(18, 183, 106, 1)',
  },
  infoContainer: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  labelText: {
    color: 'rgba(109, 109, 109, 1)',
    fontSize: 13,
    fontWeight: '400',
  },
  valueText: {
    color: 'rgba(81, 81, 81, 1)',
    fontSize: 13,
    fontWeight: '700',
  },
  confirmButton: {
    backgroundColor: 'rgba(0, 33, 94, 1)',
    height: 44,
    marginTop: 25,
    justifyContent: 'center',
    borderRadius: 5,
  },
  confirmButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});
