const socket = io('/')
const myPeer = new Peer(undefined, {
    
    host: '/',
    port: '5000'
})

const peers = {}

const myVideo = document.createElement('video')
myVideo.muted = true

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on("newuser", userID => {
        connectToNewUser(userID, stream)
    })
})

socket.on('user-disconnected', userID => {
    if(peers[userID]){ 
        peers[userID].close()
    }
})

myPeer.on('open', id =>{
    socket.emit('user-connected', id)
})

const videoGrid = document.getElementById('video-grid')

function connectToNewUser(userID, stream){
    let call = myPeer.call(userID, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })
    peers[userID] = call
}

function addVideoStream(video, stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}