import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import HomeIcon from '../assets/HomeIcon';
import FileIcon from '../assets/FileIcon';
import BrainIcon from '../assets/BrainIcon';
import UserIcon2 from '../assets/UserIcon2';

const getIcon = (name: string) => {
  switch (name) {
    case 'home':
      return HomeIcon;
    case 'assessments':
      return FileIcon;
    case 'therapists':
      return BrainIcon;
    case 'profile':
      return UserIcon2;
    default:
      return HomeIcon;
  }
};

const BottomNavigation = ({state, descriptors, navigation}: any) => {
  // const currentScreenName =
  //   navigation.getState().routes[navigation.getState().index].name;
  // console.log('My Screen Name ==> ', currentScreenName);

  return (
    <View style={styles.menuUpperWrapper}>
      <View style={styles.menuContainer}>
        {/* <TouchableOpacity
          style={[styles.bottomTabWrapper]}
          onPress={() => navigation.navigate('MainPage')}>
          <HomeIcon active={true} />
          <Text
            style={[styles.base, {color: `${true ? '#111920' : '#888C90'}`}]}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bottomTabWrapper]}
          onPress={() => navigation.navigate('TransactionRecordScreen')}>
          <FileIcon />
          <Text
            style={[styles.base, {color: `${false ? '#111920' : '#888C90'}`}]}>
            Assessments
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomTabWrapper]}>
          <BrainIcon />
          <Text
            style={[styles.base, {color: `${false ? '#111920' : '#888C90'}`}]}>
            Therapists
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bottomTabWrapper]}
          onPress={() => navigation.navigate('SettingsScreen')}>
          <UserIcon2 />
          <Text
            style={[styles.base, {color: `${false ? '#111920' : '#888C90'}`}]}>
            Profile
          </Text>
        </TouchableOpacity> */}
        {state.routes.map((route: any, index: any) => {
          // console.log(route)
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const Icon = getIcon(route.name);

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.bottomTabWrapper}>
              <Icon active={isFocused} />
              <Text
                style={[
                  styles.base,
                  {color: `${isFocused ? '#111920' : '#888C90'}`},
                ]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
export default BottomNavigation;
const styles = StyleSheet.create({
  base: {
    fontFamily: 'SF-Pro-Display-Regular',
    // color: '#111920',
  },
  menuUpperWrapper: {
    marginBottom: 10,
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 10,
  },
  bottomTabWrapper: {
    height: 40,
    padding: 8,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
