import React, { useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import app, { usersRef } from "../firebase/firebase"
import swal from 'sweetalert';
// import bcrypt from 'bcrypt'
import { addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs'


const auth = getAuth(app);
// const phoneNumber = getPhoneNumberFromUserInput();


const Signup = () => {
    const [form,setForm]=useState({
            name:"",
            mobile:"",
            password:""
        }
    );
    const[loader,setLoader]=useState(false);
    const[otpSend,setOtpSend]=useState(false);
    const[OTP,setOTP]=useState("");

    const navigate=useNavigate();

    const generateRecaptha = () => {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          onSignInsubmit();
          // ...
        },
        
      });
    }
  
    const onSignInsubmit = () => {
      setLoader(true);
      generateRecaptha();
      const phoneNumber = "+91" + form.mobile;
      const appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        swal({
          text: "OTP Sent",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        // ...
        setOtpSend(true);
        setLoader(false)
      }).catch((error) => {
        // Error; SMS not sent
          console.log(error)
        // ...
      });
    }
    const verifyOtp= ()=>{
      try{
        setLoader(true);
        uploadData();
        window.confirmationResult.confirm(OTP).then((result) => {
         swal({
            text:"Successfully Registered",
            icon:'success',
            buttons:false,
            timer:3000
          });
          navigate('/login')
          setLoader(false);
        })
      }catch(error){
        console.log(error)
      }
    }

   const uploadData =async ()=>{
    try{
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(form.password, salt);
    addDoc(usersRef,{

      // form
      name:form.name,
      password:hash,
      mobile:form.mobile
      
    })
  }catch(error){
    console.log(error)
  }
   }

  return (
    <div className="w-full mt-12 sm:mt-32 md:mt-36 flex flex-col items-center">
     <h1 className="text-xl font-bold">Sign Up</h1>
      {otpSend?
        <>

        <div class="p-2 w-full md:w-1/3">
        <div class="relative">
          <label for="otp" class="leading-7 text-sm text-gray-300">
            Enter OTF
          </label>
          <input
           
            id="otp"
            name="otp"
            value={OTP}
            onChange={(e) => setOTP(e.target.value)}
            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
      </div>
      <button
      onClick={verifyOtp}
        
        class="flex mx-auto my-4 text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg"
      >
        {loader ? <TailSpin height={25} color="white" /> : "Confirm OTP"}
      </button>
      </> 
      :
     <>
     
      
      <div class="p-2 w-full md:w-1/3">
        <div class="relative">
          <label for="name" class="leading-7 text-sm text-gray-300">
            Name
          </label>
          <input
           
            id="name"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
      </div>
      
      <div class="p-2 w-full md:w-1/3">
        <div class="relative">
          <label for="mobile" class="leading-7 text-sm text-gray-300">
            Mobile No.
          </label>
          <input
            type={"number"}
            id="mobile"
            name="mobile"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
      </div>
      <div class="p-2 w-full md:w-1/3">
        <div class="relative">
          <label for="password" class="leading-7 text-sm text-gray-300">
            Password
          </label>
          <input
            type={'password'}
            id="password"
            name="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
      </div>
      <div class="p-2 w-full">
        <button
        onClick={onSignInsubmit}
        
          class="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg"
        >
          {loader ? <TailSpin height={25} color="white" /> : "Request OTP"}
        </button>
      </div>
      </>
      }
      <div>
        <p>Already have an account? <Link to={'/login'}><span className="text-blue-500">Login Here</span></Link></p>
      <div id='recaptcha-container'></div>
      </div>
    </div>
           
             

           
              
          
  )
}

export default Signup
