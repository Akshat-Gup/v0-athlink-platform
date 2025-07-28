// Simple event emitter for sponsorship updates
class SponsorshipEventEmitter {
  private listeners: { [event: string]: Function[] } = {}

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback)
    }
  }

  emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data))
    }
  }
}

export const sponsorshipEvents = new SponsorshipEventEmitter()

// Event types
export const SPONSORSHIP_EVENTS = {
  REQUEST_APPROVED: 'request_approved',
  REQUEST_REJECTED: 'request_rejected', 
  REQUEST_SUBMITTED: 'request_submitted',
  CONTRIBUTION_UPDATED: 'contribution_updated'
} as const
