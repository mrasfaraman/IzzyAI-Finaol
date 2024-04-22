import React from 'react';
import {View, StyleSheet} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome';

const VideoPlayer = ({source}: any) => {
  return (
    <View style={styles.container}>
      <Video
        source={source}
        style={styles.video}
        controls={true}
        resizeMode="contain"
      />
      {/* <View style={styles.controls}>
        <Icon name="play" size={30} color="white" />
        <Icon name="pause" size={30} color="white" />
        <Icon name="volume-up" size={30} color="white" />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: 300,
    height: 200,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default VideoPlayer;
