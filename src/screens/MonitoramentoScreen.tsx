import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { createLocalizacao, getAllLocalizacoes, updateLocalizacao, deleteLocalizacao } from '../api/locationService';
import { loginUser, registerUser, logoutUser, getToken, getUsername } from '../api/authService';
import { LocalizacaoPayload, LocalizacaoResponse } from '../api/types';

export default function MonitoramentoScreen() {
  const [localizacoes, setLocalizacoes] = useState<LocalizacaoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);

  // Estados para o formulário de login/registro
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Estados para o formulário de localização (CRUD)
  const [nomeLocal, setNomeLocal] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [statusLocalizacao, setStatusLocalizacao] = useState<'ATIVA' | 'INATIVA' | 'PENDENTE' | 'REMOVIDA' | 'BLOQUEADA'>('ATIVA');
  const [editingId, setEditingId] = useState<number | null>(null);

  // --- Funções de Autenticação ---
  const checkAuthentication = useCallback(async () => {
    setLoading(true);
    const token = await getToken();
    const username = await getUsername();
    if (token && username) {
      setIsAuthenticated(true);
      setLoggedInUsername(username);
      await fetchLocalizacoes();
    } else {
      setIsAuthenticated(false);
      setLoggedInUsername(null);
      setLocalizacoes([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser({ username: loginUsername, password: loginPassword });
      setIsAuthenticated(true);
      setLoggedInUsername(response.username);
      Alert.alert('Sucesso', `Bem-vindo, ${response.username}!`);
      setLoginUsername('');
      setLoginPassword('');
      await fetchLocalizacoes();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login. Credenciais inválidas?');
      Alert.alert('Erro no Login', err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      await registerUser({ email: registerEmail, username: registerUsername, password: registerPassword });
      Alert.alert('Sucesso', 'Usuário registrado com sucesso! Agora você pode fazer login.');
      setIsRegisterMode(false);
      setLoginUsername(registerUsername);
      setRegisterEmail('');
      setRegisterUsername('');
      setRegisterPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao registrar usuário. Tente novamente.');
      Alert.alert('Erro no Registro', err.response?.data?.message || 'Erro ao registrar usuário. Verifique se o username/email já existe.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await logoutUser();
    setIsAuthenticated(false);
    setLoggedInUsername(null);
    setLocalizacoes([]);
    setLoading(false);
    Alert.alert('Deslogado', 'Você foi desconectado com sucesso.');
  };

  // --- Funções do CRUD de Localização ---
  const fetchLocalizacoes = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getAllLocalizacoes();
      setLocalizacoes(data);
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        Alert.alert('Sessão Expirada', 'Sua sessão expirou. Por favor, faça login novamente.');
        await logoutUser();
      } else {
        setError('Erro ao carregar localizações. Verifique o console.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!nomeLocal || !latitude || !longitude) {
      Alert.alert('Erro', 'Por favor, preencha o Nome do Local, Latitude e Longitude.');
      return;
    }
    if (!isAuthenticated) {
      Alert.alert('Erro', 'Você precisa estar logado para realizar esta operação.');
      return;
    }

    const locData: LocalizacaoPayload = {
      nome: nomeLocal,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      status: statusLocalizacao,
    };

    setLoading(true);
    setError(null);
    try {
      if (editingId) {
        await updateLocalizacao(editingId, locData);
        Alert.alert('Sucesso', 'Localização atualizada!');
      } else {
        await createLocalizacao(locData);
        Alert.alert('Sucesso', 'Localização criada!');
      }
      resetForm();
      await fetchLocalizacoes();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar localização. Verifique o console.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!isAuthenticated) {
      Alert.alert('Erro', 'Você precisa estar logado para realizar esta operação.');
      return;
    }
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta localização?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            setLoading(true);
            setError(null);
            try {
              await deleteLocalizacao(id);
              Alert.alert('Sucesso', 'Localização excluída!');
              await fetchLocalizacoes();
            } catch (err: any) {
              setError(err.response?.data?.message || 'Erro ao excluir localização. Verifique o console.');
              console.error(err);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEdit = (localizacao: LocalizacaoResponse) => {
    setNomeLocal(localizacao.nome);
    setLatitude(localizacao.latitude.toString());
    setLongitude(localizacao.longitude.toString());
    setStatusLocalizacao(localizacao.status);
    setEditingId(localizacao.idLocalizacao);
  };

  const resetForm = () => {
    setNomeLocal('');
    setLatitude('');
    setLongitude('');
    setStatusLocalizacao('ATIVA');
    setEditingId(null);
  };

  if (loading && !isAuthenticated) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Verificando autenticação...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monitoramento de Localização</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {!isAuthenticated ? (
        // --- Formulário de Login/Registro ---
        <View style={styles.authContainer}>
          <Text style={styles.authTitle}>{isRegisterMode ? 'Criar Nova Conta' : 'Acesse Sua Conta'}</Text>
          {isRegisterMode && (
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#6c757d"
              value={registerEmail}
              onChangeText={setRegisterEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Nome de Usuário"
            placeholderTextColor="#6c757d"
            value={isRegisterMode ? registerUsername : loginUsername}
            onChangeText={isRegisterMode ? setRegisterUsername : setLoginUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#6c757d"
            value={isRegisterMode ? registerPassword : loginPassword}
            onChangeText={isRegisterMode ? setRegisterPassword : setLoginPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={[styles.button, styles.authButton]}
            onPress={isRegisterMode ? handleRegister : handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{isRegisterMode ? 'Registrar' : 'Entrar'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsRegisterMode(!isRegisterMode)} style={styles.switchModeButton}>
            <Text style={styles.switchModeText}>
              {isRegisterMode ? 'Já tem conta? Faça login' : 'Não tem conta? Registre-se'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        // --- Conteúdo da Tela de Monitoramento (Após Autenticação) ---
        <>
          <View style={styles.headerAuthenticated}>
            <Text style={styles.loggedInText}>Logado como: {loggedInUsername}</Text>
            <TouchableOpacity
              style={[styles.button, styles.logoutButton]}
              onPress={handleLogout}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
          </View>

          {/* Formulário de Criação/Atualização */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>{editingId ? "Atualizar Localização" : "Criar Nova Localização"}</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do Local"
              placeholderTextColor="#6c757d"
              value={nomeLocal}
              onChangeText={setNomeLocal}
            />
            <TextInput
              style={styles.input}
              placeholder="Latitude"
              placeholderTextColor="#6c757d"
              keyboardType="numeric"
              value={latitude}
              onChangeText={setLatitude}
            />
            <TextInput
              style={styles.input}
              placeholder="Longitude"
              placeholderTextColor="#6c757d"
              keyboardType="numeric"
              value={longitude}
              onChangeText={setLongitude}
            />
            <TextInput
              style={styles.input}
              placeholder="Status (ATIVA, INATIVA, PENDENTE, REMOVIDA, BLOQUEADA)"
              placeholderTextColor="#6c757d"
              value={statusLocalizacao}
              onChangeText={(text) => setStatusLocalizacao(text.toUpperCase() as any)}
              autoCapitalize="characters"
            />

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleCreateOrUpdate}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{editingId ? "Atualizar Localização" : "Criar Localização"}</Text>
            </TouchableOpacity>
            {editingId && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={resetForm}
              >
                <Text style={styles.buttonText}>Cancelar Edição</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.subtitle}>Localizações Registradas:</Text>
          <TouchableOpacity
            style={[styles.button, styles.refreshButton]}
            onPress={fetchLocalizacoes} // <-- CORRIGIDO AQUI!
            disabled={loading}
          >
            <Text style={styles.buttonText}>Recarregar Localizações</Text>
          </TouchableOpacity>

          {loading && localizacoes.length === 0 && (
            <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
          )}

          <FlatList
            data={localizacoes}
            keyExtractor={(item) => item.idLocalizacao?.toString() || Math.random().toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text style={styles.itemText}><Text style={styles.itemLabel}>Local:</Text> {item.nome}</Text>
                <Text style={styles.itemText}><Text style={styles.itemLabel}>Latitude:</Text> {item.latitude}</Text>
                <Text style={styles.itemText}><Text style={styles.itemLabel}>Longitude:</Text> {item.longitude}</Text>
                <Text style={styles.itemText}><Text style={styles.itemLabel}>Status:</Text> {item.status}</Text>
                {item.idUsuario && <Text style={styles.itemText}><Text style={styles.itemLabel}>Usuário ID:</Text> {item.idUsuario}</Text>}
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.editButton]}
                    onPress={() => handleEdit(item)}
                  >
                    <Text style={styles.buttonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => handleDelete(item.idLocalizacao!)}
                  >
                    <Text style={styles.buttonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={!loading && localizacoes.length === 0 ? <Text style={styles.emptyListText}>Nenhuma localização encontrada. Crie uma!</Text> : null}
            style={styles.list}
            contentContainerStyle={localizacoes.length === 0 && !loading ? styles.emptyListContent : null}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eef2f6', // Cor de fundo mais suave
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#2c3e50', // Tom mais escuro para o título
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 15,
    color: '#34495e',
    textAlign: 'center',
  },
  authContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 30, // Aumentado padding
    borderRadius: 15, // Mais arredondado
    elevation: 8, // Sombra mais proeminente
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginBottom: 30,
    alignItems: 'center',
  },
  authTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#34495e',
    textAlign: 'center',
  },
  headerAuthenticated: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  loggedInText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#28a745', // Cor verde para status logado
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    marginBottom: 25,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#34495e',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
    fontSize: 16,
    color: '#343a40',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    minWidth: 120, // Garante um tamanho mínimo para os botões
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  authButton: {
    backgroundColor: '#007bff', // Azul primário para botões de autenticação
    width: '100%', // Ocupa toda a largura do formulário
    marginTop: 20, // Mais espaço acima
  },
  primaryButton: {
    backgroundColor: '#007bff', // Azul primário
  },
  secondaryButton: {
    backgroundColor: '#6c757d', // Cinza secundário
  },
  logoutButton: {
    backgroundColor: '#dc3545', // Vermelho para logout
    minWidth: 80,
  },
  refreshButton: {
    backgroundColor: '#17a2b8', // Azul-claro para recarregar
    alignSelf: 'center',
    marginBottom: 20,
  },
  switchModeButton: {
    marginTop: 20,
    paddingVertical: 10, // Padding para a área clicável
    paddingHorizontal: 10,
  },
  switchModeText: {
    color: '#007bff',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 12,
    width: 'auto',
    borderLeftWidth: 6,
    borderLeftColor: '#28a745',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  itemLabel: {
    fontWeight: 'bold',
    color: '#495057',
  },
  itemText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#343a40',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingHorizontal: 5,
  },
  editButton: {
    backgroundColor: '#ffc107',
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    flex: 1,
  },
  errorText: {
    color: '#dc3545',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: '#ffe0e6',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  list: {
    width: '100%',
    marginTop: 10,
    flex: 1,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 18,
    color: '#777',
    fontStyle: 'italic',
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});