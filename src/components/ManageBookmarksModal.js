import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ColorPicker from 'react-native-wheel-color-picker';
import { useBookmark } from '../context/BookmarkContext';

export default function ManageBookmarksModal({ visible, onClose, bookmarkToEdit }) {
  const { createBookmark, updateBookmark } = useBookmark();
  const [description, setDescription] = useState('');
  const [hexColor, setHexColor] = useState('#1599E4');

  const isEditing = !!bookmarkToEdit;

  useEffect(() => {
    if (isEditing) {
      setDescription(bookmarkToEdit.description);
      setHexColor(bookmarkToEdit.hexColor);
    } else {
      // Reseta para o estado inicial ao abrir para criar
      setDescription('');
      setHexColor('#1599E4');
    }
  }, [bookmarkToEdit, visible]);

  const handleSave = async () => {
    if (!description.trim()) {
      Alert.alert("Atenção", "A descrição do marcador não pode ser vazia.");
      return;
    }

    if (isEditing) {
      await updateBookmark(bookmarkToEdit.id, { description, hexColor });
    } else {
      await createBookmark(description, hexColor);
    }

    onClose(); // Fecha o modal após salvar
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>{isEditing ? 'Editar Marcador' : 'Novo Marcador'}</Text>
              <TouchableOpacity onPress={onClose}>
                <MaterialIcons name="close" size={28} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Selecione uma cor</Text>
            <View style={styles.colorPickerContainer}>
              <ColorPicker
                color={hexColor}
                onColorChangeComplete={setHexColor}
                thumbSize={30}
                sliderSize={30}
                noSnap={true}
                row={false}
              />
            </View>

            <Text style={styles.label}>Descrição do Marcador</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Lendo Atualmente"
              placeholderTextColor="#888"
              value={description}
              onChangeText={setDescription}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Salvar Marcador</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: '#222',
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
  },
  colorPickerContainer: {
    height: 250,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1C1C1C',
    borderRadius: 8,
    paddingHorizontal: 15,
    color: 'white',
    height: 50,
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#1599E4',
    height: 54,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Poppins',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});