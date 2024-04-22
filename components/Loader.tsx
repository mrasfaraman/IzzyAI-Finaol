import React from 'react';
import {Modal, View, ActivityIndicator, StyleSheet} from 'react-native';

const Loader = ({loading}) => {
  return (
    <Modal transparent={true} animationType={'none'} visible={loading}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size="large" color="black" animating={loading} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default Loader;
