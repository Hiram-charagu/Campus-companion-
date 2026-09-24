document.querySelectorAll('.register').forEach(b=>b.onclick=()=>{b.textContent='Registered ✓';b.disabled=true;toast('Event registration confirmed')});
