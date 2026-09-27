import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'

let socket = null

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
    })
  }
  return socket
}

export const getSocket = () => {
  if (!socket) {
    return initSocket()
  }
  return socket
}

export const connectSocket = () => {
  const socket = getSocket()
  if (!socket.connected) {
    socket.connect()
  }
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
  }
}

export const joinExamRoom = (examId) => {
  const socket = getSocket()
  socket.emit('join-exam', examId)
}

export const leaveExamRoom = (examId) => {
  const socket = getSocket()
  socket.emit('leave-exam', examId)
}

export default {
  initSocket,
  getSocket,
  connectSocket,
  disconnectSocket,
  joinExamRoom,
  leaveExamRoom,
}
