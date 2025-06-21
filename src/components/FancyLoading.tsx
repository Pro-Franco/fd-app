import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FancyLoading() {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true
        }),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true
          })
        ])
      ])
    ).start();
  }, [rotateAnim, scaleAnim]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.loaderCircle,
          {
            transform: [{ rotate: rotateInterpolate }, { scale: scaleAnim }]
          }
        ]}
      >
        <Ionicons name="refresh" size={36} color="#fff" />
      </Animated.View>
      <Text style={styles.loadingText}>Carregando dados...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef1f6',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loaderCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#6200ea',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#6200ea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginBottom: 24
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    letterSpacing: 0.5
  }
});
