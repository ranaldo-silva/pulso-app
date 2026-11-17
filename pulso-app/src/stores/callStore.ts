import { create } from 'zustand';
import type { CallStatus } from '../types';

type CallState = {
  callId: string | null;
  contactId: string | null;
  contactName: string | null;
  status: CallStatus | null;
  muted: boolean;
  speaker: boolean;
  startTime: number | null;

  startCall: (
    contactId: string,
    contactName: string
  ) => void;

  setStatus: (status: CallStatus) => void;

  toggleMute: () => void;

  toggleSpeaker: () => void;

  endCall: () => void;
};

export const useCallStore =
  create<CallState>((set) => ({
    callId: null,
    contactId: null,
    contactName: null,
    status: null,
    muted: false,
    speaker: false,
    startTime: null,

    startCall: (contactId, contactName) => {
      set({
        callId: `call-${Date.now()}`,
        contactId,
        contactName,
        status: 'connecting',
        muted: false,
        speaker: false,
        startTime: null,
      });
    },

    setStatus: (status) => {
      set((state) => ({
        status,
        startTime:
          status === 'active'
            ? Date.now()
            : state.startTime,
      }));
    },

    toggleMute: () => {
      set((state) => ({
        muted: !state.muted,
      }));
    },

    toggleSpeaker: () => {
      set((state) => ({
        speaker: !state.speaker,
      }));
    },

    endCall: () => {
      set({
        callId: null,
        contactId: null,
        contactName: null,
        status: null,
        muted: false,
        speaker: false,
        startTime: null,
      });
    },
  }));
