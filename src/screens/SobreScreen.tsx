import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function SobreScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContentContainer}>
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Sobre o Projeto AquaSense</Text>
        <Text style={styles.text}>O AquaSense visa desenvolver uma solução tecnológica robusta para momonitoramento automatizado e alerta antecipado de enchentes ealagamentos em áreas urbanas críticas.</Text>
        <Text style={styles.text}>Utiliza sensores IoT, imagens de satélite, dados meteorológicos e modelos hidrológicos para alimentar algoritmos de IA, que analisamriscos e emitem alertas georreferenciados.</Text>
        <Text style={styles.text}>A plataforma é acessível via web e mobile, com interfaces distintas para órgãos públicos e população, promovendo prevenção e respostacoordenada a eventos extremos.</Text>
        <Text style={styles.additionalPhraseText}>
          Projeto GlobalSolution proposto pela{" "}
          <Text style={styles.fiapHighlight}>FIAP</Text>
        </Text>
        <Text style={styles.developmentStatusText}>Este projeto ainda está em desenvolvimento.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContentContainer: {
    flexGrow: 1,
    backgroundColor: "#074ca9",
  },
  contentWrapper: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  additionalPhraseText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    lineHeight: 24,
    marginTop: 20,
  },
  fiapHighlight: {
    fontWeight: "bold",
    color: "#c2e0ff",
  },
  developmentStatusText: {
    fontSize: 14,
    color: "#c2e0ff",
    textAlign: "center",
    marginTop: 30,
    fontStyle: "italic",
  },
});