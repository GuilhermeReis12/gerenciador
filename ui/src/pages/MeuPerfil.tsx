import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../utils/axios';
import { Form } from 'informed';
import Row from '../components/StoryBook/Row/Row';
import InputText from '../components/InputText';
import { useTheme } from '@mui/material/styles';
import {
  CamPerfil,
  ContainerPerfilImage,
  FileInput,
  Information,
  NameInformation,
  NamesInformation,
  PerfilImage
} from '../components/StoryBook/DropDown/DropdownStyle';
import { Label } from '../components/Typography/Label';
import { faCamera } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { get } from 'lodash';
import { toast } from 'react-toastify';
import { handleUpload } from '../upload/service_upload';
import axios from 'axios';

const MeuPerfilPage: React.FC = () => {
  const theme = useTheme();
  const [perfil, setPerfil] = useState<any>();
  const [files, setFiles] = useState(null);
  const [errorMsg, setErrorMsg] = useState<any>([]);
  const fileInputRef = useRef<any>(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const renderPerfil = useCallback(async () => {
    try {
      return await api.get(`/me`).then((res) => {
        setPerfil(res?.data[0]);
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchPassword = (formValues: any) => {
    try {
      const params = {
        password: formValues?.values?.new_password,
        confirm_password: formValues?.values?.confirm_password
      };
      return axios
        .post(
          `${process.env.REACT_APP_API_HOST || 'http://localhost:8000'
          }api/validate_password`,
          params
        )
        .then((res) => {
          handleSubmit(formValues);
        })
        .catch((err) => {
          setErrorMsg(err?.response.data);
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (formValues: any) => {
    const params = {
      ...formValues?.values,
      password: formValues?.values?.confirm_password,
      username: perfil?.username,
      user_image: files || perfil?.user_image,
      name: perfil?.username
    };
    api
      .patch(`/users/${perfil?.id}/update_user`, { ...params })
      .then((response) => {
        toast.success('Perfil Atualizado com sucesso');
        renderPerfil();
        setErrorMsg([]);
      })
      .catch((err) => {
        setErrorMsg(err?.response.data);
        Object.keys(err?.response.data).forEach((field) => { });
        console.error(err);
      });
  };

  useEffect(() => {
    renderPerfil();
  }, [renderPerfil, files]);

  const handleUploadImg = async (event: any) => {
    const file = get(event, 'target.files.0');
    event.target.value = null;
    toast.loading('O arquivo está sendo enviado, por favor aguarde!');
    if (file) {
      await handleUpload(file, 'foto-perfil', perfil?.id)
        .then((response) => {
          toast.dismiss();
          toast.success('Upload Concluido');
          setFiles(response?.key);
        })
        .catch((e) => {
          toast.dismiss();
          toast.error('Erro ao fazer upload');
        });
    }
  };

  return (
    <Form
      onSubmit={fetchPassword}
      initialValues={perfil}
      style={{ marginTop: '2rem' }}
    >
      <>
        <Row
          direction="column"
          style={{
            marginTop: '1.5rem'
          }}
        >
          <h1
            style={{
              color: theme.color?.primary.main,
              marginBottom: '0.3rem'
            }}
          >
            Meu perfil
          </h1>
          <span>Edite suas informações aqui</span>
          <hr
            style={{
              width: '100%',
              border: '1px solid #dfdfdf',
              marginTop: '2rem'
            }}
          />
        </Row>

        <Row
          style={{
            width: '100%',
            marginTop: '1.3rem',
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1fr',
            alignItems: 'center'
          }}
        >
          <Row
            direction="column"
            alignItems="center"
            lg="70%"
            md="100%"
            xs="100%"
          >
            <ContainerPerfilImage>
              <CamPerfil onClick={handleClick}>
                <FontAwesomeIcon
                  style={{ height: 16, width: 16 }}
                  icon={faCamera}
                  color="white"
                />
              </CamPerfil>
              <FileInput
                type="file"
                ref={fileInputRef}
                onChange={handleUploadImg}
              />
              <PerfilImage>
                {perfil?.link_img && (
                  <img
                    src={perfil?.link_img || files}
                    style={{ height: '100px' }}
                    alt=""
                  />
                )}
              </PerfilImage>
            </ContainerPerfilImage>
            <NamesInformation>
              <NameInformation>{perfil?.name}</NameInformation>
              <Information>{perfil?.username}</Information>
            </NamesInformation>
          </Row>
          <Row direction="column" lg="90%" md="100%" xs="100%">
            <h2>Dados pessoais</h2>
            <InputText
              required={false}
              label="Nome"
              placeholder="Digite seu nome"
              field="username"
              onChange={undefined}
              errorMessage={errorMsg?.username}
            />
            <InputText
              required={false}
              label="E-mail"
              placeholder="Digite seu e-mail"
              field="email"
              onChange={undefined}
              errorMessage={errorMsg?.email}
            />
          </Row>
          <Row direction="column" lg="100%" md="100%" xs="100%">
            <h2>Privacidade</h2>
            <InputText
              required={false}
              label="Nova senha"
              placeholder="Digite sua nova senha"
              field="new_password"
              type="password"
              onChange={() => setErrorMsg({ password: [] })}
              errorMessage={errorMsg?.password || errorMsg?.non_field_errors}
            />
            <InputText
              required={false}
              label="Confirmar nova senha"
              placeholder="Confirme sua nova senha"
              field="confirm_password"
              type="password"
              onChange={() => setErrorMsg({ confirm_password: [] })}
              errorMessage={
                errorMsg?.confirm_password || errorMsg?.non_field_errors
              }
            />
          </Row>
        </Row>
        <Row justifyContent="flex-end">
          <button
            style={{
              marginTop: '1.5rem',
              padding: '12px 16px 12px 16px',
              borderRadius: '8px',
              border: `1.5px solid ${theme.color?.primary.main}`,
              // height: '43px',

              cursor: 'pointer',
              backgroundColor: `${theme.color?.primary.main}`
            }}
            type="submit"
          >
            <Label
              label="Salvar Alterações"
              style={{
                fontFamily: 'Inter',
                fontSize: '16px',
                color: theme.color?.textColor.white,
                textAlign: 'center',
                fontWeight: 700
              }}
            />
          </button>
        </Row>
      </>
    </Form>
  );
};

export default MeuPerfilPage;
