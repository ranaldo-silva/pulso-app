import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices,
} from 'react-native-webrtc';

const configuration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
};

export async function createPeerConnection() {
  const peerConnection = new RTCPeerConnection(
    configuration
  );

  const stream =
    await mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

  stream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream);
  });

  return {
    peerConnection,
    stream,
  };
}

export async function createOffer(
  peerConnection: RTCPeerConnection
) {
  const offer =
    await peerConnection.createOffer();

  await peerConnection.setLocalDescription(
    offer
  );

  return offer;
}

export async function setRemoteOffer(
  peerConnection: RTCPeerConnection,
  offer: RTCSessionDescription
) {
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(offer)
  );
}

export async function createAnswer(
  peerConnection: RTCPeerConnection
) {
  const answer =
    await peerConnection.createAnswer();

  await peerConnection.setLocalDescription(
    answer
  );

  return answer;
}

export async function setRemoteAnswer(
  peerConnection: RTCPeerConnection,
  answer: RTCSessionDescription
) {
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(answer)
  );
}

export async function addIceCandidate(
  peerConnection: RTCPeerConnection,
  candidate: RTCIceCandidate
) {
  await peerConnection.addIceCandidate(
    new RTCIceCandidate(candidate)
  );
}