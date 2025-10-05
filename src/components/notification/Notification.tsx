"use client";

import React from "react";
import { useEffect, useState, useCallback } from "react";
import socket from "@/lib/socketClient";

//third-party
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons/faBell";
import { NotificationType } from "./types";

const MAX_NOTIFICATIONS = 20;

const Notification = ({
  userId,
  isAdmin = false,
}: {
  userId: string;
  isAdmin?: boolean;
}) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleNewNotification = useCallback((data: NotificationType) => {
    setNotifications((prev) => [data, ...prev].slice(0, MAX_NOTIFICATIONS));
  }, []);

  useEffect(() => {
    if (!showDropdown) return;

    const room = isAdmin ? "admin" : `user-${userId}`;
    socket.emit("joinRoom", room);

    socket.on("newNotification", handleNewNotification);
    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [showDropdown, userId, isAdmin, handleNewNotification]);

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        className="hidden relative h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center border hover:shadow transition lg:flex"
        onClick={() => setShowDropdown((prev) => !prev)}
        aria-label="Notifications"
        aria-expanded={showDropdown}
        aria-haspopup="menu"
      >
        <FontAwesomeIcon icon={faBell} />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="absolute right-0 mt-2 w-72 bg-white shadow-lg border rounded-lg z-20"
          role="menu"
        >
          <div className="p-3 font-semibold border-b">Notifications</div>
          {notifications.length > 0 ? (
            <ul className="max-h-64 overflow-y-auto">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  role="menuitem"
                  className="p-3 border-b last:border-none text-sm hover:bg-gray-50"
                >
                  <p>{n.message}</p>
                  {n.createdAt && (
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-sm text-gray-500 text-center">
              No notifications
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default React.memo(Notification);
