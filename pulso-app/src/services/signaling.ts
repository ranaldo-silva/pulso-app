import type { SignalingMessage } from '../types/signaling';

type MessageHandler = (
  message: SignalingMessage
) => void;

class SignalingService {
  private socket: WebSocket | null = null;

  private messageHandler:
    MessageHandler | null = null;

  connect(url: string) {
    if (this.socket) {
      return;
    }

    console.log(
      'Conectando ao servidor de sinalização...'
    );

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log(
        'WebSocket conectado'
      );
    };

    this.socket.onclose = () => {
      console.log(
        'WebSocket desconectado'
      );

      this.socket = null;
    };

    this.socket.onerror = (error) => {
      console.error(
        'Erro no WebSocket:',
        error
      );
    };

    this.socket.onmessage = (event) => {
      try {
        const message =
          JSON.parse(
            event.data
          ) as SignalingMessage;

        console.log(
          'Mensagem de sinalização recebida:',
          message
        );

        this.messageHandler?.(
          message
        );
      } catch (error) {
        console.error(
          'Erro ao processar mensagem:',
          error
        );
      }
    };
  }

  onMessage(
    handler: MessageHandler
  ) {
    this.messageHandler =
      handler;

    return () => {
      if (
        this.messageHandler ===
        handler
      ) {
        this.messageHandler =
          null;
      }
    };
  }

  send(
    message: SignalingMessage
  ) {
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
    this.messageHandler = null;
  }
}

export const signalingService =
  new SignalingService();