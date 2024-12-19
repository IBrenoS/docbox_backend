# DOCBOX - Back-End

### Sumário
- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Endpoints Principais](#endpoints-principais)
- [Estrutura de Dados](#estrutura-de-dados)
- [Segurança](#segurança)
- [Como Contribuir](#como-contribuir)
- [Licença](#licença)

---

## Sobre o Projeto
O **DOCBOX** é uma carteira digital para o gerenciamento seguro de documentos pessoais, oferecendo uma plataforma onde os usuários podem digitalizar, armazenar e organizar documentos essenciais, como RG, CNH, certidões e contratos, com acesso seguro em dispositivos móveis.

O back-end do projeto é responsável por:
- Processamento de imagens e extração de dados.
- Autenticação e segurança dos dados.
- Gerenciamento seguro de documentos em nuvem.

## Arquitetura do Projeto
O projeto utiliza uma arquitetura baseada em APIs RESTful para garantir escalabilidade e flexibilidade. A comunicação é realizada via JSON, com autenticação baseada em tokens JWT.

### Estrutura Geral:
- **Node.js com Express**: para o desenvolvimento da API.
- **MongoDB**: armazenamento de dados de usuários, documentos e logs de auditoria.
- **AWS S3 ou Google Cloud Storage**: para armazenar documentos com alta disponibilidade.
- **OCR (Tesseract OCR)**: biblioteca para extração de dados de documentos.

## Tecnologias Utilizadas
- **Backend**: Node.js, Express
- **Banco de Dados**: MongoDB
- **Armazenamento em Nuvem**: AWS S3 ou Google Cloud Storage
- **Autenticação**: JWT, com suporte a PIN e biometria
- **Criptografia**: AES para dados em repouso e HTTPS para dados em trânsito

## Endpoints Principais

### Autenticação
- `POST /login`: Autentica o usuário e retorna um token JWT.
- `POST /verify-pin`: Valida o PIN de segurança do usuário.
- `POST /setup-biometrics`: Configura a autenticação biométrica.
- `POST /logout`: Invalida o token JWT, encerrando a sessão.

### Gerenciamento de Documentos
- `POST /upload-document`: Recebe uma imagem de documento, realiza OCR e armazena os dados.
- `GET /get-document`: Retorna dados e a URL do documento.
- `PUT /update-document`: Atualiza um documento existente.
- `DELETE /delete-document`: Exclui um documento e remove seus dados.

### Auditoria e Logs
- `GET /get-audit-log`: Permite que administradores consultem logs de auditoria.

### Manutenção de Sessão
- `POST /session-timeout`: Configura o tempo limite de inatividade.
- `POST /revoke-token`: Revoga um token JWT específico.

## Estrutura de Dados
As principais coleções do MongoDB são:

- **Usuários**:
    ```json
    {
      "user_id": "ID único do usuário",
      "name": "Nome completo",
      "email": "Email",
      "password_hash": "Hash da senha",
      "pin": "Hash do PIN",
      "biometric_enabled": true,
      "created_at": "Data de criação",
      "last_login": "Último login"
    }
    ```

- **Documentos**:
    ```json
    {
      "document_id": "ID do documento",
      "user_id": "ID do usuário associado",
      "file_url": "URL do arquivo",
      "photo_url": "URL da foto do documento",
      "type": "Tipo de documento",
      "data_extracted": {
          "full_name": "Nome completo",
          "cpf": "CPF",
          "birth_date": "Data de nascimento",
          "mother_name": "Nome da mãe",
          "father_name": "Nome do pai"
      },
      "created_at": "Data de criação",
      "last_accessed": "Última data de acesso"
    }
    ```

- **Logs de Auditoria**:
    ```json
    {
      "log_id": "ID único do log",
      "user_id": "ID do usuário",
      "action": "Ação realizada",
      "document_id": "ID do documento",
      "timestamp": "Data e hora",
      "ip_address": "Endereço IP do usuário"
    }
    ```

## Segurança
A aplicação segue práticas rigorosas de segurança:
- **Autenticação e Criptografia**: Uso de tokens JWT, criptografia AES e SSL/TLS.
- **PIN e Biometria**: Segurança adicional com PIN e autenticação biométrica.
- **Proteção Contra Injeções**: Validação rigorosa para evitar SQL Injection e XSS.
- **2FA Opcional**: Autenticação em duas etapas para segurança avançada.

## Como Contribuir
1. Faça um fork do projeto.
2. Crie uma nova branch: `git checkout -b feature/nome_da_sua_feature`.
3. Realize suas modificações e faça commit: `git commit -m 'Adiciona nova feature'`.
4. Envie para o repositório remoto: `git push origin feature/nome_da_sua_feature`.
5. Abra um Pull Request para revisão.

## Licença
Esse projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
