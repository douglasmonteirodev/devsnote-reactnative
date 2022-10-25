import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  Container,
  TitleInput,
  BodyInput,
  SaveButton,
  SaveButtonImage,
  CloseButton,
  CloseButtonImage,
  DeleteButton,
  DeleteButtonText,
} from './styles';

import {useDispatch, useSelector} from 'react-redux';

import {useNavigation, useRoute} from '@react-navigation/native';

export default () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();

  const list = useSelector(state => state.notes.list);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('new');

  useEffect(() => {
    if (route.params?.key != undefined && list[route.params.key]) {
      setStatus('edit');
      setTitle(list[route.params.key].title);
      setBody(list[route.params.key].body);
    }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: status == 'new' ? 'Nova Anotação' : 'Editar Anotação',
      headerLeft: () => (
        <CloseButton underlayColor="transparent" onPress={handleCloseButton}>
          <CloseButtonImage source={require('../../assets/close.png')} />
        </CloseButton>
      ),
      headerRight: () => (
        <SaveButton underlayColor="transparent" onPress={handleSaveButton}>
          <SaveButtonImage source={require('../../assets/save.png')} />
        </SaveButton>
      ),
    });
  }, [status, title, body]);

  const handleCloseButton = () => {
    navigation.goBack();
  };

  const handleSaveButton = () => {
    if (title != '' && body != '') {
      if (status == 'edit') {
        dispatch({
          type: 'EDIT_NOTE',
          payload: {
            key: route.params.key,
            title,
            body,
          },
        });
      } else {
        dispatch({
          type: 'ADD_NOTE',
          payload: {title, body},
        });
      }

      navigation.goBack();
    } else {
      alert('Preencha título e corpo');
    }
  };

  const handleDeleteNoteButton = () => {
    dispatch({
      type: 'DEL_NOTE',
      payload: {
        key: route.params.key,
      },
    });

    navigation.goBack();
  };

  return (
    <Container>
      <TitleInput
        value={title}
        onChangeText={e => setTitle(e)}
        placeholder="Digite o titulo da anotação"
        placeholderTextColor="#ccc"
        autoFocus={true}
      />
      <BodyInput
        value={body}
        onChangeText={e => setBody(e)}
        placeholder="Digite o corpo da anotação"
        placeholderTextColor="#ccc"
        multiline={true}
        textAlignVertical="top"
      />
      {status == 'edit' && (
        <DeleteButton underlayColor="#f00" onPress={handleDeleteNoteButton}>
          <DeleteButtonText>Excluir Nota</DeleteButtonText>
        </DeleteButton>
      )}
    </Container>
  );
};
