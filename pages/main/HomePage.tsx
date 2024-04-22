import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
} from 'react-native';
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import {LinearProgress} from '@rneui/themed';
import ChevronDownIcon from '../../assets/ChevronDown';
import BellIcon from '../../assets/BellIcon';
import MicButton from '../../assets/MicButton';
import BottomNavigation from '../../components/BottomNavigation';
import {useDataContext} from '../../contexts/DataContext';
import BaseURL from '../../components/ApiCreds';

const GradientText = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={58}
    height={17}
    fill="none"
    {...props}>
    <Path
      fill="url(#a)"
      d="M3.008 2.36v3.85H5.28c1.282 0 2.024-.71 2.024-1.929 0-1.187-.79-1.922-2.063-1.922H3.008Zm0 5.398V12H.992V.727H5.47c2.437 0 3.898 1.351 3.898 3.507 0 1.493-.781 2.735-2.125 3.22L9.703 12H7.406L5.188 7.758h-2.18ZM14.32 5.055c-1.093 0-1.883.836-1.96 1.992h3.867c-.04-1.172-.79-1.992-1.907-1.992Zm1.914 4.468h1.82c-.25 1.563-1.702 2.641-3.663 2.641-2.485 0-3.985-1.633-3.985-4.273 0-2.618 1.516-4.344 3.906-4.344 2.352 0 3.82 1.633 3.82 4.148v.633h-5.788v.117c0 1.328.812 2.22 2.086 2.22.906 0 1.593-.454 1.804-1.142Zm3.008-3.43c0-1.515 1.336-2.546 3.352-2.546 1.945 0 3.265 1.047 3.312 2.578h-1.812c-.063-.71-.633-1.148-1.54-1.148-.859 0-1.421.406-1.421 1.007 0 .47.375.782 1.187.977l1.477.328c1.656.39 2.305 1.031 2.305 2.258 0 1.562-1.446 2.617-3.54 2.617-2.078 0-3.398-1.031-3.53-2.601h1.913c.117.757.703 1.18 1.688 1.18.945 0 1.531-.384 1.531-1 0-.485-.305-.743-1.11-.946l-1.507-.352c-1.531-.36-2.305-1.156-2.305-2.351ZM34.687 3.72V12h-1.874v-1.438h-.04c-.437 1.008-1.273 1.586-2.53 1.586-1.798 0-2.938-1.164-2.938-3.078V3.72h1.945v4.96c0 1.188.578 1.829 1.672 1.829 1.125 0 1.82-.797 1.82-2v-4.79h1.946ZM36.282 12V3.719h1.867v1.437h.04c.359-.96 1.234-1.593 2.359-1.593 1.172 0 2.008.601 2.312 1.664h.047c.399-1.024 1.383-1.665 2.578-1.665 1.633 0 2.703 1.102 2.703 2.758V12h-1.945V6.797c0-1.016-.531-1.594-1.484-1.594-.938 0-1.578.688-1.578 1.68V12h-1.89V6.695c0-.922-.563-1.492-1.47-1.492-.937 0-1.593.727-1.593 1.727V12H36.28Zm17.04-6.945c-1.094 0-1.883.836-1.962 1.992h3.868c-.04-1.172-.79-1.992-1.907-1.992Zm1.913 4.468h1.82c-.25 1.563-1.702 2.641-3.663 2.641-2.485 0-3.985-1.633-3.985-4.273 0-2.618 1.516-4.344 3.907-4.344 2.351 0 3.82 1.633 3.82 4.148v.633h-5.79v.117c0 1.328.813 2.22 2.087 2.22.906 0 1.593-.454 1.804-1.142Z"
    />
    <Path fill="url(#b)" d="M0 14.914h57.586v1.29H0v-1.29Z" />
    <Defs>
      <LinearGradient
        id="a"
        x1={1.339}
        x2={15.809}
        y1={-4.344}
        y2={33.265}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#0CC8E8" />
        <Stop offset={1} stopColor="#2DEEAA" />
      </LinearGradient>
      <LinearGradient
        id="b"
        x1={1.339}
        x2={15.809}
        y1={-4.344}
        y2={33.265}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#0CC8E8" />
        <Stop offset={1} stopColor="#2DEEAA" />
      </LinearGradient>
    </Defs>
  </Svg>
);

function HomePage({navigation, route}: any) {
  const [progress, setProgress] = useState(0);
  const {userId} = useDataContext();
  const [userData, setUserData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const [weightages, setWeightages] = useState(null);
  console.log('profile', route.params);

  const {updateUserDetail} = useDataContext();

  useEffect(() => {
    const fetchWeightages = async () => {
      console.log('userId', userId);

      try {
        const response = await fetch(
          `${BaseURL}/calculate_weightages/${userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        const data = await response.json();
        console.log('Response from server: ', data);

        if (data) {
          console.log('Weight', data);
          const overallWeightedScore = data['Overall Weighted Score'];

          setWeightages(overallWeightedScore);
        }
      } catch (error) {
        console.error('Error fetching weightages:', error);
      }
    };

    fetchWeightages();
  }, []);

  console.log('profile', route.params);

  useEffect(() => {
    let subs = true;
    if (progress < 1 && progress !== 0) {
      setTimeout(() => {
        if (subs) {
          setProgress(progress + 0.1);
        }
      }, 100);
    }
    return () => {
      subs = false;
    };
  }, [progress]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BaseURL}/get_user_profile/${userId}`);
        const userData = await response.json();
        console.log('User data from API:', userData);
        updateUserDetail(userData);

        // Save user data in state
        setUserData(userData);

        // Fetch avatar URL if userData contains AvatarId
        if (userData?.AvatarID) {
          const avatarId = userData.AvatarID; // Use optional chaining to safely access AvatarId
          const response = await fetch(`${BaseURL}/get_avatar/${avatarId}`);
          const avatarData = await response.json();
          if (avatarData && avatarData.AvatarURL) {
            console.log('asd', avatarData);
            updateUserDetail({avatarUrl: `${BaseURL}${avatarData.AvatarURL}`});

            setAvatarUrl(avatarData.AvatarURL);
            console.log(avatarData.avatarURL);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const avatarUrlNew = `${BaseURL}${avatarUrl}`;
  console.log(avatarUrlNew);

  if (!userData) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView>
      <View style={{minHeight: '100%'}}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
          }}>
          <View
            style={{
              minWidth: '85%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 30,
            }}>
            <Image
              style={{
                height: 48,
                width: 48,
                borderRadius: 1000,
                backgroundColor: '#FFE5BB',
              }}
              resizeMode="stretch"
              source={{uri: avatarUrlNew}}
            />
            <View style={{marginLeft: 10}}>
              <Text style={[styles.base]}>Logged in as</Text>

              <Text style={[styles.base, {fontSize: 16, fontWeight: '500'}]}>
                {userData.FullName}
              </Text>
            </View>
            <View style={{marginLeft: 'auto'}}>{/* <BellIcon /> */}</View>
          </View>

          <View
            style={{
              marginTop: 30,
              maxWidth: '85%',
            }}>
            {/* <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={[styles.base, {fontSize: 16, fontWeight: '500'}]}>
                My Progress
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate('speechArticulationPage')}>
                <GradientText />
              </TouchableOpacity>
            </View> */}

            {/* <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
                gap: 8,
              }}>
              <LinearProgress
                style={{
                  borderRadius: 16,
                  height: 7,
                  width: '88%',
                  top: 2,
                }}
                value={weightages !== null ? weightages / 100 : 0}
                variant="determinate"
                color="#71D860"
              />

              <Text style={[styles.base, {fontSize: 14, fontWeight: '500'}]}>
                {weightages > 100 ? `100%` : `${weightages}%`}
              </Text>
            </View> */}

            <TouchableOpacity
              onPress={() => navigation.navigate('assessmentPage')}
              style={styles.cardContainer}>
              <View>
                <Text style={[styles.base, styles.heading]}>Assessment</Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <Text style={[styles.base, styles.para]}>
                    Improve your speaking skills with our AI Exercises
                  </Text>
                </View>
              </View>
              <Image source={require('../../assets/images/home1.png')} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('exercisePage')}
              style={styles.cardContainer}>
              <View>
                <Text style={[styles.base, styles.heading]}>Exercises</Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <Text style={[styles.base, styles.para]}>
                    Improve your speaking skills with our AI Therapist
                  </Text>
                </View>
              </View>
              <Image source={require('../../assets/images/home2.png')} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cardContainer}
              onPress={() => navigation.navigate('reportsPage')}>
              <View>
                <Text style={[styles.base, styles.heading]}>Reports</Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <Text style={[styles.base, styles.para]}>
                    View your progress and improvement
                  </Text>
                </View>
              </View>
              <Image source={require('../../assets/images/home3.png')} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'SF-Pro-Display-Regular',
    color: '#111920',
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: '#0CC8E8',
    borderRadius: 16,
    padding: 14,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  heading: {
    fontSize: 20,
    fontWeight: '500',
  },
  para: {
    fontSize: 14,
    fontWeight: '400',
    maxWidth: 180,
  },
  // heading: {
  //   paddingTop: 50,
  //   fontSize: 32,
  //   fontWeight: '500',
  // },
  // para: {
  //   paddingTop: 5,
  //   fontSize: 16,
  //   paddingHorizontal: 30,
  //   textAlign: 'center',
  //   fontWeight: '400',
  // },
  // svgContainer: {
  //   display: 'flex',
  //   flexDirection: 'row',
  //   paddingTop: 20,
  //   fontSize: 16,
  //   paddingHorizontal: 30,
  //   textAlign: 'center',
  //   fontWeight: '400',
  // },
  // baseDot: {
  //   marginHorizontal: 3,
  // },
  // secondContainer: {
  //   marginTop: 40,
  //   paddingHorizontal: 30,
  //   display: 'flex',
  //   flexDirection: 'row',
  // },
  // micContainer: {
  //   display: 'flex',
  //   justifyContent: 'center',
  // },
  // micText: {
  //   textAlign: 'center',
  // },
  // para2: {
  //   paddingTop: 5,
  //   fontSize: 14,
  //   paddingHorizontal: 30,
  //   fontWeight: '400',
  //   marginTop: 10,
  // },
  // img: {
  //   marginTop: 10,
  // },
  // btnContainer: {
  //   marginTop: 'auto',
  // },
});

export default HomePage;
