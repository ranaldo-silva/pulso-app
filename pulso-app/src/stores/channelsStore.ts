import { create } from 'zustand';
import type { Channel } from '../types';
import { api } from '../services/api';

type ChannelsState = {
  channels: Channel[];
  isLoading: boolean;

  fetchChannels: () => Promise<void>;

  addChannel: (channel: Channel) => void;

  removeChannel: (id: string) => void;

  getChannelById: (
    id: string
  ) => Channel | undefined;
};

export const useChannelsStore =
  create<ChannelsState>((set, get) => ({
    channels: [],
    isLoading: false,

    fetchChannels: async () => {
      set({ isLoading: true });
      const res = await api.getChannels();
      if (res.data) {
        set({ channels: res.data, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    },

    addChannel: (channel) => {
      set((state) => ({
        channels: [
          ...state.channels,
          channel,
        ],
      }));
    },

    removeChannel: (id) => {
      set((state) => ({
        channels: state.channels.filter(
          (c) => c.id !== id
        ),
      }));
    },

    getChannelById: (id) => {
      return get().channels.find(
        (c) => c.id === id
      );
    },
  }));
