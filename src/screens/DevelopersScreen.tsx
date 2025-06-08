import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import DevCard from '../components/DevCard';

export default function Developers() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DevCard
        name="Nicolas Dobbeck"
        image={require('../../assets/img/nicolas (1).jpg')}
        github="https://github.com/NicolasDobbeck"
      />
      <DevCard
        name="José Bezerra"
        image={require('../../assets/img/jose (1).jpg')}
        github="https://github.com/jjosebastos"
      />
      <DevCard
        name="Thiago Henry"
        image={require('../../assets/img/thiago (1).png')}
        github="https://github.com/lavithiluan"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    paddingTop: 80,
  },
});