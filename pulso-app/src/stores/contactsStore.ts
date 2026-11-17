import { create } from 'zustand';
import type { Contact, UserStatus } from '../types';
import { api } from '../services/api';

type ContactsState = {
  contacts: Contact[];
  isLoading: boolean;
  search: string;

  fetchContacts: () => Promise<void>;

  setSearch: (value: string) => void;

  addContact: (contact: Contact) => void;

  removeContact: (id: string) => void;

  updateContactStatus: (
    id: string,
    status: UserStatus
  ) => void;

  getFilteredContacts: () => Contact[];

  getOnlineContacts: () => Contact[];
};

export const useContactsStore =
  create<ContactsState>((set, get) => ({
    contacts: [],
    isLoading: false,
    search: '',

    fetchContacts: async () => {
      set({ isLoading: true });
      const res = await api.getUsers();
      if (res.data) {
        const mapped: Contact[] = res.data.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          status: (u.status as UserStatus) || 'offline',
          addedAt: new Date().toISOString(),
        }));
        set({ contacts: mapped, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    },

    setSearch: (value) => {
      set({ search: value });
    },

    addContact: (contact) => {
      set((state) => ({
        contacts: [
          ...state.contacts,
          contact,
        ],
      }));
    },

    removeContact: (id) => {
      set((state) => ({
        contacts: state.contacts.filter(
          (c) => c.id !== id
        ),
      }));
    },

    updateContactStatus: (id, status) => {
      set((state) => ({
        contacts: state.contacts.map((c) =>
          c.id === id ? { ...c, status } : c
        ),
      }));
    },

    getFilteredContacts: () => {
      const { contacts, search } = get();
      const value = search
        .trim()
        .toLowerCase();

      if (!value) {
        return contacts;
      }

      return contacts.filter((contact) =>
        contact.name
          .toLowerCase()
          .includes(value)
      );
    },

    getOnlineContacts: () => {
      const { contacts } = get();
      return contacts.filter(
        (c) => c.status !== 'offline'
      );
    },
  }));
