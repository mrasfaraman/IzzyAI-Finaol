import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import ArrowLeft from '../assets/ArrowLeft';

const CustomHeader = (props: any) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => props.goBack()}>
        <ArrowLeft />
      </TouchableOpacity>
      <Text style={[styles.base, styles.text]}>{props.title}</Text>
      <View style={{marginLeft: 'auto'}}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: 'SF-Pro-Display-Regular',
    color: '#111920',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 'auto',
    marginRight: 35,
  },
  container: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    // marginHorizontal: '',
    width: '100%',
  },
});

export default CustomHeader;
