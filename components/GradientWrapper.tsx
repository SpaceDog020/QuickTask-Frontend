import React, { ReactNode, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Animated, Easing } from 'react-native';

interface GradientWrapperProps {
  children: ReactNode;
}

const GradientWrapper: React.FC<GradientWrapperProps> = ({ children }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.quad,
        useNativeDriver: false,
      })
    ).start();
  }, [animatedValue]);

  const linearGradientColors = ['#0093E9', '#80D0C7', '#97eefd'];

  const interpolatedColors = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [linearGradientColors[0], linearGradientColors[2]],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: interpolatedColors }]}>
      <LinearGradient
        colors={linearGradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
});

export default GradientWrapper;
