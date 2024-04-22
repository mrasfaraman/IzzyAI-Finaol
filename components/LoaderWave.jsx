import React, {useState, useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, TouchableOpacity, Text} from 'react-native';

const LoaderWave = ({isAnimation, isDark}) => {
   const animations = useRef(
      new Array(30).fill(null).map(() => new Animated.Value(1)),
   ).current;
   const [isAnimating, setIsAnimating] = useState(false);
   const animationLoops = useRef(animations.map(() => null)).current;

   const startAnimation = (animation, delay, index) => {
      animationLoops[index] = Animated.loop(
         Animated.sequence([
            Animated.timing(animation, {
               toValue: 0.3,
               duration: 500,
               useNativeDriver: true,
            }),
            Animated.timing(animation, {
               toValue: 1,
               duration: 500,
               useNativeDriver: true,
            }),
         ]),
         {
            delay: delay,
         },
      );
      animationLoops[index].start();
   };

   const stopAnimation = () => {
      animationLoops.forEach(loop => loop && loop.stop());
      // Reset animations to initial value
      animations.forEach(animation => animation.setValue(1));
   };

   useEffect(() => {
      if (isAnimating) {
         // Start animations for each line with staggered delays
         animations.forEach((anim, index) => {
            startAnimation(anim, index * 150, index);
         });
      } else {
         stopAnimation();
      }

      // Cleanup function to stop animations when component unmounts or stops animating
      return () => stopAnimation();
   }, [isAnimating, animations]);

   const toggleAnimation = () => {
      setIsAnimating(!isAnimating);
   };

   useEffect(() => {
      setIsAnimating(isAnimation);
   }, [isAnimation]);

   const renderLine = (animation, index) => (
      <Animated.View
         key={index}
         style={[
            styles.line,
            {backgroundColor: isDark ? '#000' : '#fff'},
            {height: isAnimating ? 40 : 5},
            {
               transform: [{scaleY: animation}],
            },
         ]}
      />
   );

   return (
      <View style={styles.container}>
         <View style={styles.loader}>
            {animations.map((anim, index) => renderLine(anim, index))}
         </View>
         {/* <TouchableOpacity style={styles.button} onPress={toggleAnimation}>
                <Text style={styles.buttonText}>{isAnimating ? 'Stop' : 'Start'} Animation</Text>
            </TouchableOpacity> */}
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      marginTop: 20,
      alignItems: 'center',
      justifyContent: 'center',
      height: 70,
   },
   loader: {
      flexDirection: 'row',
      width: '100%', // Adjust based on your needs
      justifyContent: 'space-between',
   },
   line: {
      // backgroundColor: '#fff',
      width: 2, // Line thickness
      // Line height
   },
   button: {
      marginTop: 20,
      backgroundColor: '#4caf50',
      padding: 10,
      borderRadius: 5,
   },
   buttonText: {
      color: '#fff',
      fontSize: 16,
   },
});

export default LoaderWave;
