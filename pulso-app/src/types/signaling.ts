export type CallOfferMessage = {
  type: 'call-offer';
  callId: string;
  from: string;
  to: string;
  offer: RTCSessionDescriptionInit;
};

export type CallAnswerMessage = {
  type: 'call-answer';
  callId: string;
  from: string;
  to: string;
  answer: RTCSessionDescriptionInit;
};

export type IceCandidateMessage = {
  type: 'ice-candidate';
  callId: string;
  from: string;
  to: string;
  candidate: RTCIceCandidateInit;
};

export type CallRejectMessage = {
  type: 'call-reject';
  callId: string;
  from: string;
  to: string;
};

export type CallEndMessage = {
  type: 'call-end';
  callId: string;
  from: string;
  to: string;
};

export type RegisterMessage = {
  type: 'register';
  from: string;
};

export type PttMessage = {
  type: 'ptt-start' | 'ptt-stop';
  from: string;
  channelId?: string;
  to?: string;
};

export type ChannelActionMessage = {
  type: 'join-channel' | 'leave-channel';
  from: string;
  channelId: string;
};

export type SignalingMessage =
  | CallOfferMessage
  | CallAnswerMessage
  | IceCandidateMessage
  | CallRejectMessage
  | CallEndMessage
  | RegisterMessage
  | PttMessage
  | ChannelActionMessage;
