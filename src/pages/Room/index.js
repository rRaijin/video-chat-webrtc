import {useParams} from 'react-router';
import useWebRTC, {LOCAL_VIDEO} from '../../hooks/useWebRTC';

function layout(clientsNumber = 1) {
  const pairs = Array.from({length: clientsNumber})
    .reduce((acc, next, index, arr) => {
      if (index % 2 === 0) {
        acc.push(arr.slice(index, index + 2));
      }

      return acc;
    }, []);

  const rowsNumber = pairs.length;
  // const height = `${100 / rowsNumber}%`;
  const height = `${80 / rowsNumber}%`;

  return pairs.map((row, index, arr) => {

    if (index === arr.length - 1 && row.length === 1) {
      return [{
        width: '80%',
        height,
      }];
    }

    return row.map(() => ({
      width: '40%',
      height,
    }));
  }).flat();
}

export default function Room() {
  const {id: roomID, uId: userId} = useParams();
  const {
    clients, provideMediaRef, selfMicStatus, selfVideoStatus, screenShareStatus, 
    updateVideo, updateMic, screenShare
  } = useWebRTC(roomID, userId);
  const videoLayout = layout(clients.length);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      height: '100vh',
    }}>
      {clients.map((c, index) => {
        return (
          <div key={c.clientId} style={videoLayout[index]} id={c.clientId}>
            <h3>{c.userId}</h3>
            <video
              width='100%'
              height='100%'
              ref={instance => {
                provideMediaRef(c.clientId, instance);
              }}
              autoPlay
              playsInline
              muted={c.clientId === LOCAL_VIDEO}
            />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {
                userId === c.userId ?
                <button onClick={updateVideo}>
                  Video: {selfVideoStatus ? 'ON' : 'OFF'}
                </button> :
                <p>{c.videoStatus ? 'ON' : 'OFF'}</p>
              }
              {
                userId === c.userId ?
                <button onClick={updateMic}>
                  Audio: {selfMicStatus ? 'ON' : 'OFF'}
                </button> :
                <p>{c.audioStatus ? 'ON' : 'OFF'}</p>
              }
              {
                userId === c.userId ?
                <button onClick={screenShare}>
                  Share: {screenShareStatus ? 'ON' : 'OFF'}
                </button> :
                <p></p>
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}
