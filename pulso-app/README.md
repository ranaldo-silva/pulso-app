# PULSO

Aplicativo de comunicação em tempo real inspirado em soluções Push-to-Talk (PTT), com suporte a comunicação por voz, chamadas individuais, contatos e canais.

O projeto está sendo desenvolvido com foco em uma experiência simples, rápida e intuitiva para comunicação por voz em tempo real.

## Status do projeto

🚧 Em desenvolvimento

### Implementado atualmente

* Estrutura inicial do aplicativo
* Navegação com Expo Router
* Tela inicial
* Tela de contatos
* Tela de canais
* Tela de perfil
* Tela de chamada individual
* Componente Push-to-Talk (PTT)
* Teste de acesso ao microfone
* Integração inicial com `react-native-webrtc`
* Estrutura inicial para comunicação WebRTC
* Configuração do EAS Build para Android
* Configuração de Development Build

### Em desenvolvimento

* Comunicação PTT em tempo real
* Chamadas de voz entre usuários
* Sinalização WebRTC
* Comunicação via WebSocket
* Autenticação de usuários
* Cadastro e gerenciamento de contatos
* Canais de comunicação
* Notificações Push
* Backend
* Persistência de dados

---

## Tecnologias

### Mobile

* React Native
* Expo
* Expo Router
* TypeScript
* Expo Audio
* React Native WebRTC
* Zustand
* Expo Notifications

### Backend

Planejado:

* Java 21
* Spring Boot
* Spring Security
* JWT
* WebSocket
* Maven
* Arquitetura Hexagonal
* REST API

### Comunicação em tempo real

* WebRTC
* WebSocket
* STUN/TURN

### Banco de dados

Planejado:

* PostgreSQL

---

## Arquitetura

O projeto será desenvolvido utilizando uma arquitetura separada entre aplicação mobile e backend.

```text
                    PULSO
                      │
          ┌───────────┴───────────┐
          │                       │
       Mobile                   Backend
          │                       │
   React Native              Spring Boot
      Expo                       Java 21
          │                       │
          └───────────┬───────────┘
                      │
             Comunicação em tempo real
                      │
              ┌───────┴────────┐
              │                │
           WebSocket         WebRTC
              │                │
        Sinalização       Áudio em tempo real
```

---

## Estrutura atual

```text
pulso-app/
│
├── src/
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   │
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   │
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   ├── contacts.tsx
│   │   │   ├── channels.tsx
│   │   │   └── profile.tsx
│   │   │
│   │   ├── ptt/
│   │   │   └── [id].tsx
│   │   │
│   │   └── call/
│   │       └── [id].tsx
│   │
│   ├── components/
│   │   ├── UserCard.tsx
│   │   ├── ChannelCard.tsx
│   │   └── PttButton.tsx
│   │
│   └── services/
│       └── webrtc.ts
│
├── assets/
│
├── app.json
├── eas.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## Funcionalidades planejadas

### Push-to-Talk

O usuário poderá pressionar e segurar um botão para transmitir sua voz.

```text
Usuário A
   │
   │ Pressiona PTT
   ▼
Microfone
   │
   ▼
WebRTC
   │
   ▼
Servidor de sinalização
   │
   ▼
WebRTC
   │
   ▼
Usuário B
```

O objetivo é proporcionar uma comunicação semelhante a um rádio comunicador, porém utilizando internet.

---

### Chamadas individuais

Cada usuário poderá realizar chamadas de voz individuais.

Exemplo:

```text
Ronaldo
   │
   │ chamada
   ▼
João
```

A chamada deverá possuir:

* Iniciar chamada
* Receber chamada
* Aceitar chamada
* Recusar chamada
* Encerrar chamada
* Ativar/desativar microfone
* Viva-voz
* Estado da chamada

---

### Contatos

Os usuários poderão:

* Pesquisar usuários
* Adicionar contatos
* Remover contatos
* Visualizar status
* Iniciar chamada
* Iniciar comunicação PTT

Status planejados:

```text
🟢 Online
🟡 Ausente
🔴 Ocupado
⚫ Offline
```

---

### Canais

O PULSO também terá canais de comunicação.

Exemplo:

```text
Equipe Operacional
├── Ronaldo
├── João
├── Carlos
├── Pedro
└── Maria
```

Os canais poderão futuramente possuir:

* Criar canal
* Entrar em canal
* Sair do canal
* Administradores
* Participantes
* PTT em grupo
* Controle de permissões

---

## Backend

O backend será desenvolvido posteriormente utilizando:

```text
Java 21
Spring Boot
Maven
Spring Security
JWT
WebSocket
Arquitetura Hexagonal
```

Responsabilidades previstas:

* Autenticação
* Usuários
* Contatos
* Canais
* Presença online/offline
* Sinalização WebRTC
* Mensagens
* Notificações
* Controle de sessões
* Segurança

---

## WebRTC

O WebRTC será utilizado para comunicação de áudio em tempo real.

O fluxo planejado será:

```text
                 Backend
              WebSocket
            Sinalização
                  │
        ┌─────────┴─────────┐
        │                   │
     Usuário A           Usuário B
        │                   │
        └────── WebRTC ─────┘
              Áudio
```

O WebSocket será utilizado principalmente para sinalização e eventos.

O WebRTC será responsável pelo transporte do áudio em tempo real.

---

## EAS Build

O projeto utiliza Expo Application Services para gerar builds Android.

Build de desenvolvimento:

```bash
eas build --profile development --platform android
```

O build é realizado na infraestrutura da Expo, não sendo necessário utilizar Android Studio para o processo de build em nuvem.

---

## Instalação

Clone o projeto:

```bash
git clone https://github.com/ranaldo-silva/pulso-app.git
```

Entre na pasta:

```bash
cd pulso-app
```

Instale as dependências:

```bash
npm install
```

Inicie o projeto:

```bash
npx expo start
```

---

## Development Build

Como o projeto utiliza módulos nativos como `react-native-webrtc`, o desenvolvimento das funcionalidades WebRTC deverá utilizar um Development Build.

Para gerar:

```bash
eas build --profile development --platform android
```

---

## Git

O projeto utiliza Git para controle de versão.

Branches principais:

```text
main
```

A `main` representa a versão estável do projeto.

Branches de desenvolvimento seguem o padrão:

```text
feature/nome-da-funcionalidade
```

Exemplos:

```text
feature/ptt
feature/calls
feature/auth
feature/contacts
feature/channels
feature/notifications
feature/backend
```

Fluxo:

```text
main
 │
 └── feature/ptt
       │
       ├── desenvolvimento
       ├── testes
       └── merge → main
```

---

## Roadmap

### Fase 1 — Aplicativo

* [x] Estrutura inicial
* [x] Navegação
* [x] Tela inicial
* [x] Contatos
* [x] Canais
* [x] Perfil
* [x] Tela de chamada
* [x] Acesso ao microfone
* [x] Configuração WebRTC inicial
* [x] Configuração EAS

### Fase 2 — PTT

* [ ] Captura de áudio
* [ ] Transmissão PTT
* [ ] Recepção de áudio
* [ ] Estados de transmissão
* [ ] Controle de usuário falando
* [ ] Comunicação em tempo real

### Fase 3 — Chamadas

* [ ] Sinalização
* [ ] Criar oferta WebRTC
* [ ] Criar resposta WebRTC
* [ ] ICE Candidates
* [ ] Chamada recebida
* [ ] Aceitar chamada
* [ ] Recusar chamada
* [ ] Encerrar chamada

### Fase 4 — Backend

* [ ] Criar projeto Spring Boot
* [ ] Arquitetura Hexagonal
* [ ] Banco de dados
* [ ] Autenticação
* [ ] JWT
* [ ] Usuários
* [ ] Contatos
* [ ] WebSocket
* [ ] Sinalização WebRTC

### Fase 5 — Produção

* [ ] Push Notifications
* [ ] STUN/TURN
* [ ] Monitoramento
* [ ] Segurança
* [ ] Testes
* [ ] CI/CD
* [ ] Publicação Android
* [ ] Publicação iOS

---

## Objetivo

O objetivo do PULSO é criar uma plataforma moderna de comunicação por voz em tempo real, combinando a simplicidade de um rádio comunicador com recursos de aplicativos modernos.

O projeto também serve como projeto prático para aplicação de conceitos de:

* React Native
* TypeScript
* Java
* Spring Boot
* WebRTC
* WebSocket
* Segurança
* Arquitetura de software
* APIs REST
* Comunicação em tempo real
* DevOps

---

## Autor

**Ranaldo Silva**

Projeto desenvolvido para estudo, aprendizado e evolução de uma plataforma de comunicação em tempo real.
