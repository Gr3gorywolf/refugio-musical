document.addEventListener('DOMContentLoaded', () => {

    const chatContent = document.createElement('section');
    chatContent.classList.add('card');
    chatContent.id = 'chat-content';
    chatContent.innerHTML = ` 
    <section class="card" role="region" aria-labelledby="hdr_backend" id="profile-backend">
        <div class="card-body">
        <iframe src="http://localhost:3000/chat" height="400px" width="100%"></iframe>
        </div>
    </section>
`
    if (!document.getElementById('chat-content')) {
        setTimeout(() => {
            document.querySelector('#public-radio-player > div > div').appendChild(chatContent);
        }, 2000);
    }
})