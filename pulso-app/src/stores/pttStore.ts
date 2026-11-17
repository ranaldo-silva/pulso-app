import { create } from 'zustand';

type PttState = {
  channelId: string | null;
  contactId: string | null;
  transmitting: boolean;
  speakerId: string | null;

  startTransmission: (
    target:
      | { channelId: string }
      | { contactId: string }
  ) => void;

  stopTransmission: () => void;

  setSpeaker: (
    userId: string | null
  ) => void;

  reset: () => void;
};

export const usePttStore = create<PttState>(
  (set) => ({
    channelId: null,
    contactId: null,
    transmitting: false,
    speakerId: null,

    startTransmission: (target) => {
      if ('channelId' in target) {
        set({
          channelId: target.channelId,
          contactId: null,
          transmitting: true,
        });
      } else {
        set({
          channelId: null,
          contactId: target.contactId,
          transmitting: true,
        });
      }
    },

    stopTransmission: () => {
      set({
        transmitting: false,
      });
    },

    setSpeaker: (userId) => {
      set({ speakerId: userId });
    },

    reset: () => {
      set({
        channelId: null,
        contactId: null,
        transmitting: false,
        speakerId: null,
      });
    },
  })
);
