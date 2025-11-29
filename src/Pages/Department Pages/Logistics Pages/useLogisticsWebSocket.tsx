// useLogisticsWebSocket.ts

import { useEffect, useRef } from 'react'
import { socket } from "../../../lib/socket"
import { queryClient } from '../../../QueryClient/queryClient';

interface LocationUpdate {
  shipmentId: string;
  latitude: number;
  longitude: number;
  updatedAt: string;
  shipmentStatus: string;
  vehicleDetails?: any;
  shipmentNumber?: string;
  timestamp: string;
}

interface TrackingStarted {
  shipmentId: string;
  trackingId: string;
  shipmentNumber: string;
  vehicleDetails: any;
  destination?: any;
  timestamp: string;
}

interface TrackingStopped {
  shipmentId: string;
  shipmentNumber: string;
  status: string;
  finalLocation?: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
}

interface UseLogisticsWebSocketProps {
  organizationId: string;
  enabled?: boolean;
  onLocationUpdate?: (data: LocationUpdate) => void;
  onTrackingStarted?: (data: TrackingStarted) => void;
  onTrackingStopped?: (data: TrackingStopped) => void;
}

export const useLogisticsWebSocket = ({
  organizationId,
  enabled = true,
  onLocationUpdate,
  onTrackingStarted,
  onTrackingStopped
}: UseLogisticsWebSocketProps) => {
const hasJoinedRoom = useRef(false);

  useEffect(() => {
    if (!enabled || !organizationId) return;

    // Join organization room when socket connects
    const joinOrganizationRoom = () => {
      if (!hasJoinedRoom.current) {
        console.log('📡 Joining organization room:', organizationId);
        socket.emit('join_organization', { organizationId });
        hasJoinedRoom.current = true;
      }
    };

    // If already connected, join immediately
    if (socket.connected) {
      joinOrganizationRoom();
    }

    // Listen for connection event
    socket.on('connect', joinOrganizationRoom);

    // ============================================
    // 📍 Location Update Handler
    // ============================================
    const handleLocationUpdate = (data: LocationUpdate) => {
      console.log('📍 Location update received:', data);

      // Update React Query cache for single shipment
      queryClient.setQueryData(
        ['logistics', 'shipment', data.shipmentId],
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            currentLocation: {
              latitude: data.latitude,
              longitude: data.longitude,
              updatedAt: data.updatedAt
            },
            lastLocationUpdate: data.updatedAt
          };
        }
      );

      // Update React Query cache for active shipments list
      queryClient.setQueryData(
        ['logistics', 'active-shipments', organizationId],
        (oldData: any) => {
          if (!oldData) return oldData;

          return oldData.map((shipment: any) =>
            shipment._id === data.shipmentId
              ? {
                  ...shipment,
                  currentLocation: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    updatedAt: data.updatedAt
                  },
                  lastLocationUpdate: data.updatedAt
                }
              : shipment
          );
        }
      );

      // Call custom callback
      onLocationUpdate?.(data);
    };

    // ============================================
    // 🚀 Tracking Started Handler
    // ============================================
    const handleTrackingStarted = (data: TrackingStarted) => {
      console.log('🚀 Tracking started:', data);

      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ 
        queryKey: ['logistics', 'active-shipments', organizationId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['logistics', 'shipment', data.shipmentId] 
      });

      onTrackingStarted?.(data);
    };

    // ============================================
    // 🛑 Tracking Stopped Handler
    // ============================================
    const handleTrackingStopped = (data: TrackingStopped) => {
      console.log('🛑 Tracking stopped:', data);

      // Remove from active shipments cache
      queryClient.setQueryData(
        ['logistics', 'active-shipments', organizationId],
        (oldData: any) => {
          if (!oldData) return oldData;
          return oldData.filter((shipment: any) => shipment._id !== data.shipmentId);
        }
      );

      // Invalidate single shipment to refetch updated status
      queryClient.invalidateQueries({ 
        queryKey: ['logistics', 'shipment', data.shipmentId] 
      });

      // Invalidate all shipments list
      queryClient.invalidateQueries({ 
        queryKey: ['logistics', 'shipments', organizationId] 
      });

      onTrackingStopped?.(data);
    };

    // ============================================
    // 📦 Bulk Location Update Handler
    // ============================================
    const handleBulkLocationUpdate = (data: any) => {
      console.log('📦 Bulk location update received:', data.count, 'shipments');

      // Update all shipments at once
      queryClient.setQueryData(
        ['logistics', 'active-shipments', organizationId],
        () => data.shipments
      );
    };

    // Register event listeners
    socket.on('location_update', handleLocationUpdate);
    socket.on('tracking_started', handleTrackingStarted);
    socket.on('tracking_stopped', handleTrackingStopped);
    socket.on('bulk_location_update', handleBulkLocationUpdate);

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up logistics WebSocket listeners');
      socket.off('location_update', handleLocationUpdate);
      socket.off('tracking_started', handleTrackingStarted);
      socket.off('tracking_stopped', handleTrackingStopped);
      socket.off('bulk_location_update', handleBulkLocationUpdate);
      socket.off('connect', joinOrganizationRoom);
      hasJoinedRoom.current = false;
    };
  }, [organizationId, enabled, onLocationUpdate, onTrackingStarted, onTrackingStopped]);

  return {
    socket,
    isConnected: socket.connected
  };
};