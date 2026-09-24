document.querySelectorAll('.join').forEach(b=>b.onclick=()=>{b.textContent='Joined ✓';b.disabled=true;toast('Welcome to the club!')});
