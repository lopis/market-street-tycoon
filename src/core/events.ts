export const on = (eventName : string, callback : EventListenerOrEventListenerObject) => {
  document.addEventListener(eventName, callback);
};

export const off = (eventName : string, callback : EventListenerOrEventListenerObject) => {
  document.removeEventListener(eventName, callback);
};

export const trigger = (eventName: string) => {
  document.dispatchEvent(new Event(eventName));
};