import React, { useRef, useEffect } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const WAVE_WIDTH = 1000;
const WAVE_HEIGHT = 100;
const waveImage = require('../../assets/img/wave.png');

// Função para criar uma animação de loop para uma única onda
const createWaveAnimation = (
  duration: number,
  delay: number,
  reverse: boolean
) => {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateWave = () => {
      translateX.setValue(reverse ? -WAVE_WIDTH : 0);
      Animated.loop(
        Animated.timing(translateX, {
          toValue: reverse ? 0 : -WAVE_WIDTH,
          duration,
          easing: t => t,
          useNativeDriver: true,
        })
      ).start();
    };

    const timer = setTimeout(animateWave, delay);

    return () => clearTimeout(timer);
  }, [translateX, duration, delay, reverse]);

  return translateX;
};

const Waves = () => {
  const wave1TranslateX = createWaveAnimation(30000, 0, false);
  const wave2TranslateX = createWaveAnimation(15000, 4000, true); 
  const wave3TranslateX = createWaveAnimation(15000, 2000, true);
  const wave4TranslateX = createWaveAnimation(5000, 1000, true); 

  const renderWave = (
    translateX: Animated.Value,
    style: any,
    key: string
  ) => (
    <Animated.View
      key={key}
      style={[
        styles.waveContainer,
        style,
        {
          transform: [{ translateX }],
        },
      ]}>
      {/* Duplica a imagem da onda para criar um efeito contínuo */}
      <Image source={waveImage} style={styles.waveImage} />
      <Image source={waveImage} style={styles.waveImage} />
    </Animated.View>
  );

  return (
    <View style={styles.wavesWrapper}>
      {renderWave(wave1TranslateX, styles.wave1, 'wave1')}
      {renderWave(wave2TranslateX, styles.wave2, 'wave2')}
      {renderWave(wave3TranslateX, styles.wave3, 'wave3')}
      {renderWave(wave4TranslateX, styles.wave4, 'wave4')}
    </View>
  );
};

const styles = StyleSheet.create({
  wavesWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: WAVE_HEIGHT + 20,
    overflow: 'hidden',
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    width: WAVE_WIDTH * 2,
    height: WAVE_HEIGHT,
    flexDirection: 'row',
    left: 0,
  },
  waveImage: {
    width: WAVE_WIDTH,
    height: WAVE_HEIGHT,
    resizeMode: 'stretch',
  },
  wave1: {
    zIndex: 1000,
    opacity: 1,
    bottom: 0,
  },
  wave2: {
    zIndex: 999,
    opacity: 0.5,
    bottom: 10,
  },
  wave3: {
    zIndex: 998,
    opacity: 0.2,
    bottom: 15,
  },
  wave4: {
    zIndex: 997,
    opacity: 0.7,
    bottom: 20,
  },
});

export default Waves;