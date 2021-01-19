const socket = io('/')
const myVideoGrid = document.getElementById('video-style')
const mPeer = new Peer(undefined,{
    host: '/',
    port: '3001' 
})
const myVideo = document.createElement('video')
myVideo.muted = true

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream => {
    addVideoStream(myVideo,stream)

    mPeer.on('call',call=>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideOStream => {
            addVideoStream(video,userVideOStream)
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(stream,userId)
    })
})

function connectToNewUser(stream,userId){
    const call = mPeer.call(userId,stream)
    const myVide = document.createElement('video')
    call.on('stream', addVideo => {
        addVideoStream(myVide,addVideo)
    })
    call.on('close',()=>{
        myVide.remove()
    })
}

mPeer.on('open',id=>{
    socket.emit('join-room', ROOM_ID, id)
})



function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', ()=> {
        video.play()
    })
    myVideoGrid.append(video)
}