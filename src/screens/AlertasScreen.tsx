import React from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar } from 'react-native';

interface Alerta {
  id: number;
  mensagem: string;
  hora: string;
  gravidade?: 'baixa' | 'media' | 'alta';
}

const alertas: Alerta[] = [
  { id: 1, mensagem: 'Risco de alagamento no bairro Centro', hora: '10:32', gravidade: 'alta' },
  { id: 2, mensagem: 'Nível do rio acima do normal - Zona Sul', hora: '09:45', gravidade: 'media' },
  { id: 3, mensagem: 'Chuvas fortes na região leste', hora: '08:15', gravidade: 'baixa' },
  { id: 4, mensagem: 'Ruas alagadas em Vila Velha', hora: '07:00', gravidade: 'alta' },
  { id: 5, mensagem: 'Rio Capibaribe subindo rapidamente', hora: '06:30', gravidade: 'media' },
];

export default function AlertasScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={styles.container.backgroundColor} />

      <Text style={styles.title}>Alertas Ativos</Text>
      {alertas.length === 0 ? (
        <View style={styles.noAlertsContainer}>
          <Text style={styles.noAlertsText}>Nenhum alerta ativo no momento.</Text>
          <Text style={styles.noAlertsSubText}>Fique atento às notificações!</Text>
        </View>
      ) : (
        <FlatList
          data={alertas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.card, item.gravidade ? styles[`card_${item.gravidade}`] : {}]}>
              <Text style={styles.cardMessage}>{item.mensagem}</Text>
              <Text style={styles.cardTime}>{item.hora}</Text>
            </View>
          )}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#e0f2f7',
    padding: 20, 
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#074ca9',
    marginBottom: 20,
    textAlign: 'center',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardMessage: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  cardTime: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  card_baixa: {
    borderColor: '#28a745',
  },
  card_media: {
    borderColor: '#ffc107',
  },
  card_alta: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    borderColor: '#dc3545',
  },
  noAlertsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noAlertsText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  noAlertsSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});