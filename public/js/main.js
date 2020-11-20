const chatForm = document.getElementById('chat-form');

const socket = io();

socket.on('message', message => {
    console.log(message);
    const decryptedData = crypto.privateDecrypt(
        {
            key: message.privateKey,
            // In order to decrypt the data, we need to specify the
            // same hashing function and padding scheme that we used to
            // encrypt the data in the previous step
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        message.message
    )
    
    // The decrypted data is of the Buffer type, which we can convert to a
    // string to reveal the original data
    console.log("decrypted data: ", decryptedData.toString())
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    socket.emit('chatMessage', e.target.elements.msg.value);
})
