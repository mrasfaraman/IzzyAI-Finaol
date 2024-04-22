import {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {FlatList} from 'react-native';
import CustomHeader from '../components/CustomHeader';
import SearchIcon from '../assets/SearchIcon';
import VerticalThreeDots from '../assets/VerticalThreeDots';
import profile1 from '../assets/images/profiles_1.png';
import profile2 from '../assets/images/profiles_2.png';
import profile3 from '../assets/images/profiles_3.png';
import profile4 from '../assets/images/profiles_4.png';
import profile5 from '../assets/images/profiles_5.png';
import GradientCheckBox from '../assets/GradientCheckBox';
import BaseURL from '../components/ApiCreds';

const ProfileCard = ({
  img,
  backgroundColor,
  checked,
  name,
  setSelectedProfile,
  id,
}: any) => {
  return (
    <View style={{margin: 10}}>
      <TouchableOpacity
        onPress={() => setSelectedProfile(id)}
        style={[
          {
            borderWidth: 2,
            borderRadius: 16,
            padding: 5,
            borderColor: '#e5e7eb',
          },
          checked && {
            borderColor: '#0CC8E8',
            borderWidth: 2,
          },
        ]}>
        <ImageBackground
          style={{
            // maxHeight: 160,
            // maxWidth: 160,
            height: 160,
            width: 140,
            backgroundColor: backgroundColor,
            borderRadius: 14,
          }}
          source={img}>
          <View
            style={{
              marginTop: 10,
              display: 'flex',
              alignItems: 'flex-end',
              paddingRight: 10,
            }}>
            {checked && <GradientCheckBox />}
          </View>
        </ImageBackground>
      </TouchableOpacity>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <Text style={[styles.base]}>{name}</Text>
        <TouchableOpacity>
          <VerticalThreeDots />
        </TouchableOpacity>
      </View>
    </View>
  );
};

function MyProfilesPage({navigation}: any) {
  const [selectedProfile, setSelectedProfile] = useState(1);

  const naviagteBack = () => {
    navigation.goBack();
  };

  const data = [
    {
      id: 1,
      name: 'James',
      backgroundColor: '#FFCD66',
      img: profile1,
    },
    {
      id: 2,
      name: 'Anna',
      backgroundColor: '#FFE5BB',
      img: profile2,
    },
    {
      id: 3,
      name: 'Alex',
      backgroundColor: '#D6D8C0',
      img: profile3,
    },
    {
      id: 4,
      name: 'Mathew',
      backgroundColor: '#E2E3DD',
      img: profile4,
    },
    {
      id: 5,
      name: 'Sarah',
      backgroundColor: '#A5A7FF',
      img: profile5,
    },
  ];

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <CustomHeader title="My Profiles" goBack={naviagteBack} />

          <View style={styles.textInputContainer}>
            <View style={styles.inputContainer}>
              <SearchIcon />
              <TextInput
                style={styles.textInput}
                placeholder="Search"
                placeholderTextColor={'#D6D8C0'}
              />
            </View>
          </View>

          <View style={{marginTop: 20, marginBottom: 50}}>
            <FlatList
              numColumns={2}
              scrollEnabled={false}
              horizontal={false}
              data={data}
              renderItem={({item}) => (
                <ProfileCard
                  img={item.img}
                  backgroundColor={item.backgroundColor}
                  checked={item.id == selectedProfile}
                  id={item.id}
                  name={item.name}
                  setSelectedProfile={setSelectedProfile}
                />
              )}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'SF-Pro-Display-Regular',
    color: '#111920',
  },
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: '100%',
  },
  heading: {
    fontSize: 22,
    fontWeight: '500',
  },
  para: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  textInputContainer: {
    marginTop: 45,
    width: '100%',
    paddingHorizontal: 25,
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: '#0CC8E8',
    borderRadius: 16,
    padding: 14,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginTop: 30,
  },
  cardContainer2: {
    borderWidth: 1,
    borderColor: '#0CC8E8',
    borderRadius: 16,
    padding: 14,
    // display: 'flex',
    // flexDirection: 'row',
    // alignItems: 'center',
    width: '90%',
    marginTop: 30,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  textInput: {
    backgroundColor: '#F8F8F8',
    paddingLeft: 4,
    color: '#111920',
    fontSize: 16,
    width: '80%',
    margin: 5,
    // marginRight: 'auto',
  },
  darkButton: {
    marginLeft: 'auto',
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: '#111920',
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 24,
    paddingRight: 24,
  },
  redButton: {
    marginLeft: 'auto',
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: '#FC4343',
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 24,
    paddingRight: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  text: {
    fontSize: 16,
  },
  bold: {
    fontWeight: '700',
  },
});

export default MyProfilesPage;
