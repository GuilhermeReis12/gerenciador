import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from 'api/client';
import { Form } from 'informed';
import Row from '../components/StoryBook/Row/Row';
import InputText from '../components/InputText';
import { Button } from '@mui/material';
import {
  CamPerfil,
  ContainerPerfilImage,
  FileInput,
  Information,
  NameInformation,
  NamesInformation,
  PerfilImage
} from '../components/StoryBook/DropDown/DropdownStyle';
import { faCamera } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { get } from 'lodash';
import { toast } from 'react-toastify';
import { handleUpload } from '../upload/service_upload';
import { parseApiError } from 'utils/apiError';
import { PageContainer } from 'components/layout/PageContainer';
import { PageHeader } from 'components/layout/PageHeader';
import { ContentCard } from 'components/ui/ContentCard';

const MeuPerfilPage: React.FC = () => {
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
    const newPassword = formValues?.values?.new_password;
    const confirmPassword = formValues?.values?.confirm_password;

    if (newPassword || confirmPassword) {
      const params = {
        password: newPassword,
        confirm_password: confirmPassword
      };
      return api
        .post(`/validate_password`, params)
        .then(() => {
          handleSubmit(formValues);
        })
        .catch((err) => {
          setErrorMsg(err?.response?.data || parseApiError(err).fieldErrors);
        });
    }

    handleSubmit(formValues);
  };

  const handleSubmit = (formValues: any) => {
    const params: Record<string, unknown> = {
      username: formValues?.values?.username || perfil?.username,
      email: formValues?.values?.email || perfil?.email,
      name: formValues?.values?.name || perfil?.name,
      user_image: files || perfil?.user_image
    };

    const newPassword = formValues?.values?.new_password;
    if (newPassword) {
      params.password = newPassword;
    }

    api
      .patch(`/users/${perfil?.id}/update_user`, params)
      .then(() => {
        toast.success('Perfil atualizado com sucesso.');
        renderPerfil();
        setErrorMsg([]);
      })
      .catch((err) => {
        const parsed = parseApiError(err);
        setErrorMsg(err?.response?.data || parsed.fieldErrors);
        toast.error(parsed.message);
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
    <PageContainer>
      <PageHeader title="Meu perfil" description="Edite suas informações pessoais e credenciais de acesso." />
      <ContentCard>
    <Form
      onSubmit={fetchPassword}
      initialValues={perfil}
    >
      <>
        <Row
          direction="column"
          style={{
            marginTop: '0.5rem'
          }}
        >
          <hr
            style={{
              width: '100%',
              border: '1px solid #e2e8f0',
              marginTop: '0.5rem',
              marginBottom: '1rem'
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
              field="name"
              onChange={undefined}
              errorMessage={errorMsg?.name}
            />
            <InputText
              required={false}
              label="Usuário"
              placeholder="Digite seu usuário"
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
          <Button variant="contained" type="submit" sx={{ mt: 2 }}>
            Salvar alterações
          </Button>
        </Row>
      </>
    </Form>
      </ContentCard>
    </PageContainer>
  );
};

export default MeuPerfilPage;
