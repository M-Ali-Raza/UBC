//set date and day
const d=new Date()
let months=['January','Faburary','March','April','May','June','July','August','September',
'October','November','December']
let dayname=['Sunday','Monday','Teusday','Wednesday','Thursday','Friday','Saturday']
let year=d.getFullYear()
let month=months[d.getMonth()]
let date=d.getDate()
let day=dayname[d.getDay()]
let date_box=document.getElementById("date-box")
let day_box=document.getElementById("day-box")
let date_box2=document.getElementById("date-box2")
let day_box2=document.getElementById("day-box2")
let dateFormat=`${date} ${month} ${year}`
date_box.innerHTML=dateFormat
day_box.innerHTML=day
date_box2.innerHTML=dateFormat
day_box2.innerHTML=day
//create function to add 0 in time
function addZero(i){
    if(i<10){i="0"+i}
    return i
}
//create function to convert 24 hour format to 12 hour format
function hourFormat(hour){
    if(hour>0 && hour<=12){
        hour=""+hour
    }
    else if(hour>12){
        hour=""+(hour-12)
    }
    else if(hour==0){
        hour="12"
    }
    return hour
}
//create function to set time
setInterval(()=>{
    let time=new Date()
    let time_box=document.getElementById("time-box")
    let time_box2=document.getElementById("time-box2")
    let hr=addZero(time.getHours())
    let newhr=hourFormat(hr)
    let min=addZero(time.getMinutes())
    if(hr<12){
        time_box.innerHTML=`${newhr}:${min} AM`
        time_box2.innerHTML=`${newhr}:${min} AM`
    }
    else{
        time_box.innerHTML=`${newhr}:${min} PM`
        time_box2.innerHTML=`${newhr}:${min} PM`
    }
}, 1000)
// Declare Variables
let signUp=document.querySelector(".account")
let container=document.querySelectorAll(".container")
let modal=document.querySelectorAll(".modal")
let signup_container=document.querySelector(".signup_container")
let btn_white=document.querySelectorAll(".btn-white")
let btn_blue=document.querySelectorAll(".btn-blue")
let btn_submit=document.querySelectorAll(".btn-submit")
let add_btn=document.querySelector(".add-btn")
let additem_container=document.querySelector(".additem_container")
let store_btn=document.querySelector(".store-btn")
let table=document.querySelector("table")
let change_btn=document.querySelector(".change-btn")
let edit_price=document.getElementById("edit-price")
let itemArray=[]
let value_price=document.querySelector(".value-price")
let sum=0
let login_container=document.querySelector(".login_container")
let login=document.querySelector(".login")
let amount=document.getElementById("amount")
let rem_price=document.querySelector(".rem-price")
let help_btn=document.querySelector(".help-btn")
let help_box=document.querySelector(".help-box")
let more=document.querySelector(".more")
let newItem_name=document.getElementById("newItem-name")
let realRem_amount=document.getElementById("realRem-amount")
let calculate_btn=document.querySelector(".calculate-btn")
let text=document.querySelector(".text")
let delete_btn=document.querySelector(".delete-btn")
let delete_container=document.querySelector(".delete_container")
let pass=document.getElementById("pass")
let pass2=document.getElementById("pass2")
let edit=document.querySelectorAll(".edit")
let edit_container=document.querySelector(".edit_container")
let disable_btn=document.querySelector(".disable-btn")
let price2=document.getElementById("price2")
let save_btn=document.querySelector(".save-btn")
let notify=document.querySelector(".notify")
let x=window.matchMedia("(max-width: 607px)")
let view=document.querySelectorAll('.view')
let gray_btn=document.querySelectorAll('.gray-btn')
let burger_icon=document.querySelector(".burger-icon")
let menu=document.querySelector(".menu")
let body=document.querySelector("body")
// Add icons in buttons on small screen
if(x.matches){
    if((edit && gray_btn) || (view && gray_btn)){
        for(i=0;il=edit.length,i<il;i++){
            if(edit){
                let span1=document.createElement("span")
                span1.classList.add("material-symbols-outlined")
                span1.innerHTML="Edit"
                edit[i].innerHTML=""
                edit[i].appendChild(span1)
                let span2=document.createElement("span")
                span2.classList.add("material-symbols-outlined")
                span2.innerHTML="Delete"
                gray_btn[i].innerHTML=""
                gray_btn[i].appendChild(span2)
            }
        }
    }
    if(view && gray_btn){
        for(i=0;il=view.length,i<il;i++){
            if(view){
                let span3=document.createElement("span")
                span3.classList.add("material-symbols-outlined")
                span3.innerHTML="Visibility"
                view[i].innerHTML=""
                view[i].appendChild(span3)
                let span2=document.createElement("span")
                span2.classList.add("material-symbols-outlined")
                span2.innerHTML="Delete"
                gray_btn[i].innerHTML=""
                gray_btn[i].appendChild(span2)
            }
        }
    }
}
// add click event listner in burger icon
if(burger_icon && menu){
    burger_icon.addEventListener('click',()=>{
        menu.classList.toggle('naturalHeight')
    })
}
// page scroll down when text is appear
if(text){
    scrollToBottom()
}
// notify me when bill save
if(notify){
    notify.addEventListener("click",()=>{
        alert("Your bill save successfully!")
    })
}
// scroll down when length of table exceeded from screen viewport 
if(table){
    scrollToBottom()
}
// Disable some buttons until "Enter" is pressed in total amount input field
if(amount){
    amount.addEventListener("keyup",({key})=>{
        if(key!=="Enter"){
            if(add_btn){
                window.removeEventListener("click",clickHandler)
                add_btn.classList.add("disable-btn")
            }
            if(help_btn){
                help_btn.classList.add("disable-help")
            }
        }
    })
}
// show edit items form automatically on edit page when edit items form fields are not empty
if(price2 && price2.value!==""){
    edit_container.style.display="flex"
}
// create function to check either password match with confirm password or not
function matchPassword(){
    if(pass.value!=pass2.value){
        alert("Your password does not match!")
        return false
    }
}
// create a function to scroll down page automatically
function scrollToBottom() {
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    window.scrollTo({
        top: documentHeight,
        behavior: 'auto'
    });
}
// create a function to give it click event listener
const clickHandler=(event)=>{
    // Show signup form
    if(event.target==signUp){
        signup_container.style.display="flex"
    }
    // Show add items form
    else if(event.target==add_btn){
        additem_container.style.display="flex"
    }
    // Show login form
    else if(event.target==login){
        login_container.style.display="flex"
    }
    // Collaps helping tool section
    else if(event.target==help_btn){
        help_box.classList.toggle("open")
        if(more.innerHTML=="Expand_More"){
            more.innerHTML="Expand_Less"
        }
        else{
            more.innerHTML="Expand_More"
        }
        scrollToBottom()
    }
    // Show delete account form
    else if(event.target==delete_btn){
        delete_container.style.display="flex"
    }
    // Close menu when other than burger-icon clicked
    else if(event.target!=burger_icon){
        if(menu){
            menu.classList.remove('naturalHeight')
        }
    }
    // Disappear forms when user click on cancel button or outside of form
    for(var i=0;il=container.length,i<il;i++){
        if(event.target==modal[i] || event.target==btn_white[i] || event.target==btn_blue[i]){
            if(event.target==btn_submit[i]){
                break
            }
            container[i].style.display="none"
        }
    }
}
// Add click event listener on a function
window.addEventListener("click",clickHandler)