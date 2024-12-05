const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
const btnPopup = document.querySelector(".btnLogin-popup");
const homeButton= document.querySelector("#homeButton");
const aboutButton= document.querySelector("#aboutButton");
const contactButton= document.querySelector("#contactButton");


const scrollToSection = (sectionId) => {
    const section = document.querySelector(sectionId);
    if (section) {
        window.scrollTo({
            top: section.offsetTop,
            behavior: "smooth"
        });
    }
};

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
homeButton.addEventListener('click', (event)=>
{   
    event.preventDefault();
    wrapper.classList.remove('active-popup');
    scrollToSection("#home");
});
aboutButton.addEventListener('click', (event)=>
{
    wrapper.classList.remove('active-popup');
    event.preventDefault();
    scrollToSection("#about");
});
contactButton.addEventListener('click', (event)=>
{
    wrapper.classList.remove('active-popup');
    event.preventDefault();
    scrollToSection("#contact");
});