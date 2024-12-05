const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
const btnPopup = document.querySelector(".btnLogin-popup");
const homeButton= document.querySelector("#homeButton");
const aboutButton= document.querySelector("#aboutButton");
const contactButton= document.querySelector("#contactButton");

let countLoginClick = 0;

registerLink.addEventListener('click', (event)=> 
{
    event.preventDefault(); 
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', (event)=> 
{
    event.preventDefault(); 
    wrapper.classList.remove('active');
});

btnPopup.addEventListener('click', ()=>   
{
    countLoginClick++;
    if(countLoginClick === 2){
        wrapper.classList.remove('active-popup');
        countLoginClick = 0;
    } else {
        wrapper.classList.add('active-popup');
    }
});
homeButton.addEventListener('click', ()=>
{
    wrapper.classList.remove('active-popup');
});
aboutButton.addEventListener('click', ()=>
{
    wrapper.classList.remove('active-popup');
});
contactButton.addEventListener('click', ()=>
{
    wrapper.classList.remove('active-popup');
});