import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomHeader from '../../components/CustomHeader';
import ChevronDownWhite from '../../assets/ChevronDownWhite';
import GearIcon from '../../assets/GearIcon';

import GradientChevronRight from '../../assets/GradientChevronRight';
import UserBioIcon from '../../assets/UserBioIcon';
import QuestionMarkIcon from '../../assets/QuestionMarkIcon';
import LogoutIcon from '../../assets/LogoutIcon';
import {useDataContext} from '../../contexts/DataContext';
import {useState} from 'react';
import {CommonActions} from '@react-navigation/native';
import {Icon} from '@rneui/themed';

const DarkButton = ({navigation}: any) => {
  return (
    <TouchableOpacity
      // onPress={() => navigation.navigate('myProfilesPage')}
      style={styles.darkButton}>
      <Text style={styles.buttonText}>
        Switch account <ChevronDownWhite />
      </Text>
    </TouchableOpacity>
  );
};

function ProfilePage({navigation}: any) {
  const {userDetail, updateUserDetail} = useDataContext();
  console.log('User Detail ', userDetail);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const naviagteBack = () => {
    navigation.goBack();
  };

  const handleLogout = () => {
    updateUserDetail({});
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'signInPage'}],
      }),
    );
  };

  return (
    <SafeAreaView>
      <View style={{minHeight: '100%'}}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{
            alignItems: 'center',
          }}>
          <CustomHeader title="My Profile" goBack={naviagteBack} />
          <View style={{width: '85%'}}>
            <LinearGradient
              colors={['#0cc8e81f', '#2deeaa1f']}
              start={{x: 0.0, y: 0.0}}
              end={{x: 1.0, y: 0.0}}
              style={[styles.linearGradient, {marginTop: 40}]}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 15,
                  paddingVertical: 20,
                }}>
                <Image
                  source={{uri: userDetail.avatarUrl}}
                  style={{height: 80, width: '30%', borderRadius: 100}}
                  resizeMode="stretch"
                />
                <View style={{width: '55%'}}>
                  <Text
                    style={[
                      styles.base,
                      {
                        fontSize: 20,
                        fontWeight: '500',
                        left: 2,
                        flexWrap: 'nowrap',
                        width: '95%',
                      },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {userDetail.FullName}
                  </Text>
                  <Text
                    style={[
                      styles.base,
                      {
                        fontSize: 15,
                        fontWeight: '500',
                        left: 2,
                        width: '95%',
                      },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {userDetail.email}
                  </Text>
                  <DarkButton navigation={navigation} />
                </View>
              </View>
            </LinearGradient>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={showLogoutModal}
            onRequestClose={() => setShowLogoutModal(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  Are you sure you want to logout?
                </Text>
                <View style={styles.modalButtonsView}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowLogoutModal(false)}>
                    <Text style={styles.modalButtonText}>No</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleLogout}>
                    <Text style={styles.modalButtonText}>Yes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <View style={{width: '85%'}}>
            <LinearGradient
              colors={['#0cc8e81f', '#2deeaa1f']}
              start={{x: 0.0, y: 0.0}}
              end={{x: 1.0, y: 0.0}}
              style={[styles.linearGradient, {marginTop: 20}]}>
              <TouchableOpacity
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 20,
                }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <GearIcon />
                  <Text
                    style={[
                      styles.base,
                      {marginLeft: 10, fontSize: 15, fontWeight: '500'},
                    ]}>
                    Settings
                  </Text>
                </View>
                <GradientChevronRight />
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <View style={{width: '85%'}}>
            <LinearGradient
              colors={['#0cc8e81f', '#2deeaa1f']}
              start={{x: 0.0, y: 0.0}}
              end={{x: 1.0, y: 0.0}}
              style={[styles.linearGradient, {marginTop: 20}]}>
              <TouchableOpacity
                onPress={() => navigation.navigate('PaymentScreen')}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 20,
                }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="payment"
                    size={22}
                    color={'black'}
                    style={{top: 1}}
                  />
                  <Text
                    style={[
                      styles.base,
                      {marginLeft: 10, fontSize: 15, fontWeight: '500'},
                    ]}>
                    Payment
                  </Text>
                </View>
                <GradientChevronRight />
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <View style={{width: '85%'}}>
            <LinearGradient
              colors={['#0cc8e81f', '#2deeaa1f']}
              start={{x: 0.0, y: 0.0}}
              end={{x: 1.0, y: 0.0}}
              style={[styles.linearGradient, {marginTop: 20}]}>
              <TouchableOpacity
              onPress={()=>navigation.navigate('bioDataPage')}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 20,
                }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <UserBioIcon />
                  <Text
                    style={[
                      styles.base,
                      {marginLeft: 10, fontSize: 15, fontWeight: '500'},
                    ]}>
                    Bio Data
                  </Text>
                </View>
                <GradientChevronRight />
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <View style={{width: '85%'}}>
            <LinearGradient
              colors={['#0cc8e81f', '#2deeaa1f']}
              start={{x: 0.0, y: 0.0}}
              end={{x: 1.0, y: 0.0}}
              style={[styles.linearGradient, {marginTop: 20}]}>
              <TouchableOpacity
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 20,
                }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <QuestionMarkIcon />
                  <Text
                    style={[
                      styles.base,
                      {marginLeft: 10, fontSize: 15, fontWeight: '500'},
                    ]}>
                    About App
                  </Text>
                </View>
                <GradientChevronRight />
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <View style={{width: '85%'}}>
            <LinearGradient
              colors={['#0cc8e81f', '#2deeaa1f']}
              start={{x: 0.0, y: 0.0}}
              end={{x: 1.0, y: 0.0}}
              style={[styles.linearGradient, {marginTop: 20}]}>
              <TouchableOpacity
                onPress={() => setShowLogoutModal(true)}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 20,
                }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <LogoutIcon />
                  <Text
                    style={[
                      styles.base,
                      {marginLeft: 10, fontSize: 15, fontWeight: '500'},
                    ]}>
                    Logout
                  </Text>
                </View>
                <GradientChevronRight />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

var styles = StyleSheet.create({
  base: {
    fontFamily: 'SF-Pro-Display-Regular',
    color: '#111920',
  },
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '500',
    margin: 5,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  darkButton: {
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: '#111920',
    display: 'flex',
    // justifyContent: 'center',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    marginTop: 10,
    width: 150,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    gap: 20,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  modalButtonsView: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#0cc8e8',
    width: 80,
    alignItems: 'center',
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'red',
    width: 80,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProfilePage;
