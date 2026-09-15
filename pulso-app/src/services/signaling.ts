import type { SignalingMessage } from '../types/signaling';

class SignalingService {
  private socket: WebSocket | null = null;

  connect(url: string) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket conectado');
    };

    this.socket.onclose = () => {
      console.log('WebSocket desconectado');
    };

    this.socket.onerror = (error) => {
      console.error(
        'Erro no WebSocket:',
        error
      );
    };

    this.socket.onmessage = (event) => {
      console.log(
        'Mensagem recebida:',
        event.data
      );
    };
  }

  send(message: SignalingMessage) {
    if (!this.socket) {
      console.warn(
        'WebSocket não conectado'
      );
      return;
    }

    if (
      this.socket.readyState !==
      WebSocket.OPEN
    ) {
      console.warn(
        'WebSocket ainda não está aberto'
      );
      return;
    }

    this.socket.send(
      JSON.stringify(message)
    );
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }
}

export const signalingService =
  new SignalingService();
