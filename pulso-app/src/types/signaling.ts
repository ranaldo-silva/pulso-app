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

export type SignalingMessage =
  | CallOfferMessage
  | CallAnswerMessage
  | IceCandidateMessage
  | CallRejectMessage
  | CallEndMessage;