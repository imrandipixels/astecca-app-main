import React, {useState, createContext} from 'react';

export const SocketContext = createContext(null);

export const SocketProvider = (props) => {
  const [socket, setSocket] = useState(null);

  return (
    <SocketContext.Provider value={[socket, setSocket]}>
      {props.children}
    </SocketContext.Provider>
  );
};
