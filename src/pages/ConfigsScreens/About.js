import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import GradientBackground from '../../components/GradientBackground';

const teamMembers = [
  { role: 'Análista de Qualidade', name: 'Arthur Gilmar Colussi Biolchi', id: '1137267' },
  { role: 'Designer UX/UI e Gestor de projeto', name: 'Bernardo Antunes Heckler', id: '1137118' },
  { role: 'Análista de Qualidade', name: 'Dionatha Zanotto Diniz', id: '1137190' },
  { role: 'Analista de Requisitos', name: 'Caio Eivor Buss', id: '1138241' },
  { role: 'Designer', name: 'Felipe Roberto Bacchi', id: '1136359' },
  { role: 'Engenheiro de Qualidade', name: 'Gustavo Francisco de Quadros Maciel', id: '1137279' },
  { role: 'Líder e Desenvolvedor Back End', name: 'Pedro Tronco', id: '1136278' },
  { role: 'Desenvolvedor Front End', name: 'Samuel Barquel Nunes', id: '1136923' },
];

export default function About() {
  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <Image source={require('../../../assets/logo.png')} style={styles.logo} />
          <Text style={styles.appName}>TreE-Book</Text>

          <Text style={styles.sectionTitle}>Equipe</Text>
          <View style={styles.glassPanel}>
            {teamMembers.map((member, index) => (
              <View key={index} style={styles.memberContainer}>
                <Text style={styles.memberRole}>{member.role}</Text>
                <Text style={styles.memberName}>{member.name}, {member.id}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Informações</Text>
          <View style={styles.glassPanel}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Versão:</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Link do App:</Text>
              <Text style={styles.infoValue}>www.exemplo.ios.android</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Direitos Autorais:</Text>
              <Text style={styles.infoValue}>© 2025 TreE-Book</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  appName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  glassPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  memberContainer: {
    marginBottom: 15,
  },
  memberRole: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberName: {
    color: '#ccc',
    fontSize: 14,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoValue: {
    color: '#ccc',
    fontSize: 16,
  },
});