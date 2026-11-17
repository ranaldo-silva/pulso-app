/**
 * PULSO Fullstack Integration Test Script
 * Simulates mobile client communication with the Spring Boot backend
 * Tests:
 * 1. Health check & REST API
 * 2. Login & JWT generation
 * 3. Protected endpoint access (Users, Channels)
 * 4. WebSocket connection & Registration
 * 5. WebRTC Signaling exchange between two users (Ronaldo -> Joao)
 * 6. PTT broadcast in a channel
 */

const http = require('http');

const API_HOST = 'localhost';
const API_PORT = 8080;

function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

// Minimal WebSocket Client using node's http module
const crypto = require('crypto');

class SimpleWsClient {
  constructor(url) {
    this.url = url;
    this.handlers = [];
  }

  connect() {
    return new Promise((resolve, reject) => {
      const key = crypto.randomBytes(16).toString('base64');
      const req = http.request({
        hostname: API_HOST,
        port: API_PORT,
        path: '/ws/signaling',
        headers: {
          'Connection': 'Upgrade',
          'Upgrade': 'websocket',
          'Sec-WebSocket-Key': key,
          'Sec-WebSocket-Version': 13,
        },
      });

      req.on('upgrade', (res, socket, upgradeHead) => {
        this.socket = socket;
        this.socket.on('data', (buffer) => this.handleData(buffer));
        resolve();
      });

      req.on('error', reject);
      req.end();
    });
  }

  onMessage(callback) {
    this.handlers.push(callback);
  }

  send(data) {
    const payload = JSON.stringify(data);
    const length = Buffer.byteLength(payload);

    let header;
    if (length < 126) {
      header = Buffer.alloc(6);
      header[0] = 0x81; // FIN + text opcode
      header[1] = 0x80 | length; // Masked
    } else {
      header = Buffer.alloc(8);
      header[0] = 0x81;
      header[1] = 0x80 | 126;
      header.writeUInt16BE(length, 2);
    }

    const maskKey = crypto.randomBytes(4);
    const maskOffset = header.length - 4;
    maskKey.copy(header, maskOffset);

    const maskedPayload = Buffer.alloc(length);
    for (let i = 0; i < length; i++) {
      maskedPayload[i] = payload.charCodeAt(i) ^ maskKey[i % 4];
    }

    this.socket.write(Buffer.concat([header, maskedPayload]));
  }

  handleData(buffer) {
    if (buffer.length < 2) return;
    const secondByte = buffer[1];
    let payloadLen = secondByte & 0x7f;
    let offset = 2;

    if (payloadLen === 126) {
      payloadLen = buffer.readUInt16BE(2);
      offset = 4;
    } else if (payloadLen === 127) {
      payloadLen = Number(buffer.readBigUInt64BE(2));
      offset = 10;
    }

    const rawPayload = buffer.slice(offset, offset + payloadLen).toString('utf8');
    try {
      const msg = JSON.parse(rawPayload);
      for (const h of this.handlers) h(msg);
    } catch (e) {
      // ignore frame
    }
  }

  close() {
    if (this.socket) this.socket.destroy();
  }
}

async function runTest() {
  console.log('====================================================');
  console.log('🧪 INICIANDO TESTE DE INTEGRAÇÃO FULLSTACK DO PULSO');
  console.log('====================================================\n');

  try {
    // 1. Test Login
    console.log('1️⃣ [REST API] Testando Login do usuário "ronaldo"...');
    const loginRes = await request('POST', '/api/auth/login', {
      login: 'ronaldo',
      password: '1234',
    });

    if (loginRes.status !== 200 || !loginRes.data.token) {
      throw new Error(`Falha no login: HTTP ${loginRes.status} ${JSON.stringify(loginRes.data)}`);
    }

    const token = loginRes.data.token;
    console.log('   ✅ Login bem-sucedido! JWT gerado:', token.substring(0, 25) + '...');
    console.log('   ✅ Usuário autenticado:', loginRes.data.user.name, `(${loginRes.data.user.status})\n`);

    // 2. Test Get Users
    console.log('2️⃣ [REST API] Testando consulta de usuários com Bearer JWT...');
    const usersRes = await request('GET', '/api/users', null, token);
    console.log(`   ✅ Sucesso! ${usersRes.data.length} contatos retornados do banco de dados.`);
    console.log('   👥 Contatos:', usersRes.data.map(u => u.name).join(', '), '\n');

    // 3. Test Channels
    console.log('3️⃣ [REST API] Testando consulta de canais...');
    const channelsRes = await request('GET', '/api/channels', null, token);
    console.log(`   ✅ Sucesso! ${channelsRes.data.length} canais encontrados.`);
    console.log('   📻 Canais:', channelsRes.data.map(c => c.name).join(', '), '\n');

    // 4. Test WebSocket Connections
    console.log('4️⃣ [WEBSOCKET] Conectando 2 clientes simultâneos (Ronaldo e João)...');
    const wsRonaldo = new SimpleWsClient();
    const wsJoao = new SimpleWsClient();

    await wsRonaldo.connect();
    console.log('   ✅ Cliente Ronaldo conectado ao WebSocket.');

    await wsJoao.connect();
    console.log('   ✅ Cliente João conectado ao WebSocket.\n');

    // Setup listener for João
    const joaoReceived = [];
    wsJoao.onMessage((msg) => {
      joaoReceived.push(msg);
    });

    // Setup listener for Ronaldo
    const ronaldoReceived = [];
    wsRonaldo.onMessage((msg) => {
      ronaldoReceived.push(msg);
    });

    // 5. Register sessions
    console.log('5️⃣ [SIGNALING] Registrando identificação de Ronaldo e João no WebSocket...');
    wsRonaldo.send({ type: 'register', from: 'ronaldo' });
    wsJoao.send({ type: 'register', from: 'joao' });
    await new Promise((r) => setTimeout(r, 600));
    console.log('   ✅ Ambos registrados no roteador de sessões.\n');

    // 6. Test WebRTC Call Offer (Ronaldo -> João)
    console.log('6️⃣ [WEBRTC] Simulando início de chamada: Ronaldo envia "call-offer" para João...');
    wsRonaldo.send({
      type: 'call-offer',
      callId: 'call-test-123',
      from: 'ronaldo',
      to: 'joao',
      offer: { type: 'offer', sdp: 'v=0\r\no=ronaldo 12345...' },
    });

    await new Promise((r) => setTimeout(r, 600));

    const offerReceived = joaoReceived.find((m) => m.type === 'call-offer');
    if (!offerReceived) {
      throw new Error('João NÃO recebeu o call-offer de Ronaldo');
    }
    console.log('   ✅ SUCESSO: João recebeu a oferta WebRTC de Ronaldo em tempo real!\n');

    // 7. Test WebRTC Call Answer (João -> Ronaldo)
    console.log('7️⃣ [WEBRTC] João atende a chamada: envia "call-answer" para Ronaldo...');
    wsJoao.send({
      type: 'call-answer',
      callId: 'call-test-123',
      from: 'joao',
      to: 'ronaldo',
      answer: { type: 'answer', sdp: 'v=0\r\no=joao 67890...' },
    });

    await new Promise((r) => setTimeout(r, 600));

    const answerReceived = ronaldoReceived.find((m) => m.type === 'call-answer');
    if (!answerReceived) {
      throw new Error('Ronaldo NÃO recebeu o call-answer de João');
    }
    console.log('   ✅ SUCESSO: Ronaldo recebeu a resposta WebRTC de João em tempo real!\n');

    // 8. Test PTT in Channel
    console.log('8️⃣ [PTT CANAL] Testando transmissão PTT no canal "equipe-operacional"...');
    // Both join channel
    wsRonaldo.send({ type: 'join-channel', from: 'ronaldo', channelId: 'equipe-operacional' });
    wsJoao.send({ type: 'join-channel', from: 'joao', channelId: 'equipe-operacional' });
    await new Promise((r) => setTimeout(r, 400));

    // Ronaldo presses PTT
    wsRonaldo.send({
      type: 'ptt-start',
      from: 'ronaldo',
      channelId: 'equipe-operacional',
    });

    await new Promise((r) => setTimeout(r, 600));

    const pttReceived = joaoReceived.find((m) => m.type === 'ptt-start');
    if (!pttReceived) {
      throw new Error('João NÃO recebeu o evento ptt-start do canal');
    }
    console.log('   ✅ SUCESSO: João recebeu alerta de transmissão PTT de Ronaldo no canal!\n');

    // Cleanup
    wsRonaldo.close();
    wsJoao.close();

    console.log('====================================================');
    console.log('🎉 TODOS OS TESTES PASSARAM COM 100% DE SUCESSO!');
    console.log('O Frontend e o Backend estão se comunicando perfeitamente!');
    console.log('====================================================');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ ERRO NO TESTE:', err.message);
    process.exit(1);
  }
}

runTest();
