import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Waves from '../components/Waves';

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Bem-vindo à AquaSense!</Text>
        <Text style={styles.subtitle}>Tecnologia que navega rumo à segurança.</Text>
        <Text style={styles.additionalPhraseText}>
          Projeto GlobalSolution proposto pela <Text style={styles.fiapHighlight}>FIAP</Text>
        </Text>
      </View>
      <Waves />
    </View>
  );
};

const WAVE_HEIGHT_ADJUSTMENT = 120;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#074ca9',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: WAVE_HEIGHT_ADJUSTMENT,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  additionalPhraseText: { 
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
  },
  fiapHighlight: {
    fontWeight: 'bold',
    color: '#c2e0ff',
  },
});

export default HomeScreen;