const chatContent = document.createElement('section');
chatContent.classList.add('card',"mt-3");
chatContent.id = 'chat-content';
chatContent.innerHTML = ` 
<section class="card" role="region" aria-labelledby="hdr_backend" id="profile-backend">
    <div class="card-header text-bg-primary">
        <h3 id="hdr_backend" class="card-title">Chat en vivo</h3>
    </div>
  
    <div class="card-body">
       <iframe src="http://localhost:3000/chat" height="600px" width="100%"></iframe>
    </div>
</section>
`
if(!document.getElementById('chat-content')) {
    document.querySelector('#profile > div.col-lg-5').appendChild(chatContent);
}