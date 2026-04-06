import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Booking } from '../types'
import apiClient from '../../../core/api/client'

export const useBookingStore = defineStore('booking', () => {
  const bookings = ref<Booking[]>([])
  const currentBooking = ref<Booking | null>(null)
  const loading = ref(false)

  async function fetchBookings() {
    loading.value = true
    try {
      const response = await apiClient.get<{ data: Booking[] }>('/bookings')
      bookings.value = response.data.data
    } catch (error) {
      console.error('Failed to fetch bookings', error)
    } finally {
      loading.value = false
    }
  }

  async function createBooking(bookingData: Partial<Booking>) {
    try {
      const response = await apiClient.post<{ data: Booking }>('/bookings', bookingData)
      bookings.value.push(response.data.data)
      return response.data.data
    } catch (error) {
      console.error('Failed to create booking', error)
      throw error
    }
  }

  async function fetchBooking(id: number) {
    try {
      const response = await apiClient.get<{ data: Booking }>(`/bookings/${id}`)
      currentBooking.value = response.data.data
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch booking', error)
      throw error
    }
  }

  async function updateBooking(id: number, bookingData: Partial<Booking>) {
    try {
      const response = await apiClient.put<{ data: Booking }>(`/bookings/${id}`, bookingData)
      const index = bookings.value.findIndex(b => b.id === id)
      if (index !== -1) {
        bookings.value[index] = response.data.data
      }
      return response.data.data
    } catch (error) {
      console.error('Failed to update booking', error)
      throw error
    }
  }

  async function deleteBooking(id: number) {
    try {
      await apiClient.delete(`/bookings/${id}`)
      bookings.value = bookings.value.filter(b => b.id !== id)
    } catch (error) {
      console.error('Failed to delete booking', error)
      throw error
    }
  }

  return {
    bookings,
    currentBooking,
    loading,
    fetchBookings,
    createBooking,
    fetchBooking,
    updateBooking,
    deleteBooking
  }
})
