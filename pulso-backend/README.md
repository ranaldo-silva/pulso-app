# PULSO Backend (Spring Boot 3 + Java 17)

Backend em tempo real para o aplicativo **PULSO** (Push-to-Talk e Chamadas de Voz WebRTC).

---

## 🛠️ Tecnologias
- **Java 17** (LTS)
- **Spring Boot 3.3.5**
- **Spring WebSocket** (Sinalização WebRTC & PTT Broadcast)
- **Spring Security & JJWT** (Autenticação Stateless)
- **Spring Data JPA & H2 Database** (Pronto para execução imediata em memória, configurável para PostgreSQL)
- **Docker & Docker Compose**

---

## 📡 Endpoints da API

### Autenticação (`/api/auth`)
| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/auth/register` | Cadastrar novo usuário |
| `POST` | `/api/auth/login` | Login com email/username e senha (retorna JWT) |

### Usuários & Contatos (`/api/users`)
| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/users` | Listar todos os usuários/contatos |
| `GET` | `/api/users/me` | Obter dados do usuário logado |
| `PATCH` | `/api/users/me/status` | Atualizar status (`online`, `away`, `busy`, `offline`) |

### Canais (`/api/channels`)
| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/channels` | Listar canais |
| `GET` | `/api/channels/{key}` | Detalhes do canal |
| `POST` | `/api/channels` | Criar canal |
| `POST` | `/api/channels/{key}/join` | Entrar no canal |
| `POST` | `/api/channels/{key}/leave` | Sair do canal |

---

## ⚡ WebSocket & Sinalização WebRTC (`/ws/signaling`)

Endpoint de WebSocket para troca de mensagens em tempo real:
- **URL**: `ws://SEU_IP:8080/ws/signaling`

### Tipos de mensagens suportadas:
1. `register`: Registra a sessão do usuário (`{ "type": "register", "from": "ronaldo" }`)
2. `call-offer`: Envia oferta WebRTC para outro peer
3. `call-answer`: Envia resposta WebRTC
4. `ice-candidate`: Troca candidatos de rede ICE
5. `call-reject` / `call-end`: Encerramento da chamada
6. `join-channel` / `leave-channel`: Ingressar e sair de um canal
7. `ptt-start` / `ptt-stop`: Notificação de quem está transmitindo áudio no canal ou 1-para-1

---

## 🚀 Como Executar

### Opção 1: Via Docker (Recomendado)
```bash
docker compose up --build
```

### Opção 2: Via Maven / Script Local
```powershell
.\run.ps1
```
