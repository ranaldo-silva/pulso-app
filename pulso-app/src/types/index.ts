export type UserStatus = 'online' | 'away' | 'busy' | 'offline';

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: UserStatus;
};

export type Contact = User & {
  addedAt: string;
};

export type Channel = {
  id: string;
  name: string;
  description: string;
  icon: string;
  members: string[];
  createdBy: string;
  createdAt: string;
};

export type CallStatus =
  | 'ringing'
  | 'connecting'
  | 'active'
  | 'ended';

export type Call = {
  id: string;
  callerId: string;
  calleeId: string;
  status: CallStatus;
  startedAt: string;
  endedAt?: string;
};
