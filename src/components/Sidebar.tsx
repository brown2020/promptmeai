"use client";

import { deleteChat, updateChatName } from '@/services/chatService';
import { useChatSideBarStore } from '@/zustand/useChatSideBarStore';
import { useChatStore } from '@/zustand/useChatStore';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useRef, useState } from 'react';
import Spinner from './Spinner';

const Sidebar = () => {
  const { activeChatId, chats, isLoadingChat, setActiveChatId, setChats } = useChatSideBarStore();
  const { setMessages, setIsLoading } = useChatStore((state) => state);
  const { user } = useUser();
  const [editDialog, setEditDialog] = useState<{
    name: string | undefined,
    id: string,
    open: boolean
  }>({ name: undefined, id: '', open: false });
  const [deleteDialog, setDeleteDialog] = useState<{
    name: string | undefined,
    id: string,
    open: boolean
  }>({ name: undefined, id: '', open: false });

  // Refs for dialog boxes
  const editDialogRef = useRef<HTMLDivElement>(null);
  const deleteDialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (editDialog.open && editDialogRef.current && !editDialogRef.current.contains(event.target as Node)) ||
        (deleteDialog.open && deleteDialogRef.current && !deleteDialogRef.current.contains(event.target as Node))
      ) {
        setEditDialog(prev => ({ ...prev, open: false }));
        setDeleteDialog(prev => ({ ...prev, open: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editDialog.open, deleteDialog.open]);

  const addNewChat = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    setActiveChatId(undefined);
    setMessages([]);
  };

  const openEditModal = (chatId: string, chatName: string | undefined) => {
    setEditDialog({ name: chatName, id: chatId, open: true });
  };

  const handleSaveName = async () => {
    if (editDialog?.id) {
      const chatUpdated = await updateChatName(user, editDialog?.id || '', editDialog?.name || '');
      if (chatUpdated) {
        setEditDialog({ name: undefined, id: '', open: false });
        setChats(chats.map((chat) => (chat.id === editDialog?.id ? { ...chat, name: editDialog?.name } : chat)));
      }
    }
  };

  const handleDeleteChat = async () => {
    if (deleteDialog?.id) {
      const chatDeleted = await deleteChat(user, deleteDialog?.id || '');
      if (chatDeleted) {
        setDeleteDialog({ name: undefined, id: '', open: false });
        setChats(chats.filter((chat) => chat.id !== deleteDialog?.id));
      }
      if (activeChatId === deleteDialog?.id) {
        setMessages([]);
        setActiveChatId(undefined);
      }
    }
  };

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 w-64 h-full bg-gray-900 text-white shadow-lg z-40">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Chats</h2>
          <ul className="space-y-2">
            <li
              className={`p-2 hover:bg-gray-700 rounded cursor-pointer ${activeChatId === undefined ? 'bg-gray-600' : ''}`}
              onClick={addNewChat}
            >
              Add New Chat
            </li>
            {!isLoadingChat ? chats.map((chat) => (
              <li
                key={chat.id}
                className={`p-2 hover:bg-gray-700 rounded cursor-pointer ${activeChatId === chat.id ? 'bg-gray-600' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setIsLoading?.(true);
                  setActiveChatId(chat.id);
                }}
              >
                <div className="flex justify-between items-center">
                <span className="w-full overflow-hidden whitespace-nowrap text-ellipsis">{chat.name}</span>
                  <div className="relative group">
                    <button className="text-gray-400 hover:text-white">
                      •••
                    </button>
                    <div className="absolute right-0 w-32 bg-gray-800 text-white rounded shadow-lg hidden group-hover:block z-50">
                      <div
                        className="flex items-center p-2 hover:bg-gray-700 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(chat.id, chat.name);
                        }}
                      >
                        ✎ Edit
                      </div>
                      <div
                        className="flex items-center p-2 hover:bg-gray-700 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteDialog({
                            name: chat.name,
                            id: chat.id,
                            open: true
                          });
                        }}
                      >
                        🗑️ Delete
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )) : <Spinner />}
          </ul>
        </div>
      </div>

      {/* Edit Modal */}
      {editDialog.open && (
        <div
          className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded shadow-lg w-80 z-50"
          ref={editDialogRef}
        >
          <h3 className="text-lg font-semibold mb-4">Edit Chat Name</h3>
          <input
            type="text"
            value={editDialog?.name || ''}
            onChange={(e) => setEditDialog({
              ...editDialog,
              name: e.target.value
            })}
            className="border border-gray-300 p-2 w-full rounded mb-4"
          />
          <div className="flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              onClick={handleSaveName}
            >
              Save
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setEditDialog({ name: undefined, id: '', open: false })}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialog.open && (
        <div
          className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded shadow-lg w-80 z-50"
          ref={deleteDialogRef}
        >
          <h3 className="text-lg font-semibold mb-4">Delete Chat</h3>
          <p>Are you sure you want to delete <span className="font-bold">"{deleteDialog?.name}"</span>?</p>
          <p>This action cannot be undone.</p>
          <div className="flex justify-end mt-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              onClick={handleDeleteChat}
            >
              Delete
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setDeleteDialog({ name: '', id: '', open: false })}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
