let events: any = {};

const EventEmitter = {
  on: (event: string, listener: (args: any) => void) => {
    // console.log(`EventEmitter,  : event ${event} on: `, listener);
    if (!events[event]) {
      events[event] = [];
    }
    events[event].push(listener);
  },
  emit(event: string, payload?: any) {
    // console.log(`EventEmitter,  : event ${event} payload: `, payload);
    if (events[event]) {
      events[event].forEach((listener: (args: any) => void) => {
        listener(payload);
      });
    }
  },
  removeListener(event: string) {
    if (events[event]) {
      delete events[event];
    }
  },
  removeAllListener() {
    events = {};
  },
};

export default EventEmitter;
