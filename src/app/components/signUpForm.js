import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { useNavigate } from "react-router-dom";
import validateInput from '../../../server/shared/validations/signup';
import { login } from './loginForm.js';
import axios from 'axios';
import base64url from 'base64url';
import { userAtom } from '../app.js';
import { flashMsgListAtom } from '../app.js';
import { isAuthAtom, firstnameAtom, lastnameAtom, roomnameAtom, usernameAtom, emailAtom, identifierAtom, passwordAtom, confirmpassAtom, mtgTypesAtom, signingUpAtom } from '../app.js'; 
import { nanoid } from 'nanoid';
import "./styles/header.scss";

function SignUpForm() {
  const [firstname, setFirstname] = useAtom(firstnameAtom);
  const [lastname, setLastname] = useAtom(lastnameAtom);
  const [roomname] = useAtom(roomnameAtom);
  const [username, setUsername] = useAtom(usernameAtom);
	const [email, setEmail] = useAtom(emailAtom);
	const [identifier, setIdentifier] = useAtom(identifierAtom);
	const [password, setPassword] = useAtom(passwordAtom);
	const [confirmpass, setConfirmpass] = useAtom(confirmpassAtom);
  const [mtgTypes, setMtgTypes] = useAtom(mtgTypesAtom);	
	const [user, setUser] = useAtom(userAtom);
	const [signingUp, setSigningUp] = useAtom(signingUpAtom);

	const [errors, setErrors] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);
	const [invalid, setInvalid] = useState(false);
	const [selectedOption, setSelectedOption] = ('is_student');
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthAtom);

	const [flashMsgList, setFlashMsgList] = useAtom(flashMsgListAtom);
  const addFlashMessage = ({type, text}) => {
    setFlashMsgList([
      ...flashMsgList,
        {
          id: nanoid(),
          type: type,
          text: text
        }
    ])  
  };  
  
	const handleFirstnameChange = (e) => {
  	setFirstname(e.target.value);
  }
	const handleLastnameChange = (e) => {
  	setLastname(e.target.value);
  }
	const handleUsernameChange = (e) => {
  	setUsername(e.target.value);
  }
	const handleEmailChange = (e) => {
  	setEmail(e.target.value);
  }
	const handlePasswordChange = (e) => {
  	setPassword(e.target.value);
  }
	const handleConfirmpassChange = (e) => {
  	setConfirmpass(e.target.value);
  }
	const handleMtgTypesChange = (e) => {
  	setMtgTypes(e.target.value);
  }
  const handleOptionChange = (e) => {
      setSelectedOption(event.target.value);
  }
	
	let signUpData = {firstname, lastname, username, email, identifier, password, confirmpass, mtgTypes};
  
	const isValid = () => {
  	const {errors, isValid } = validateInput(signUpData);
  	if (!isValid) {
  		setErrors(errors);
  	}
    return isValid;
  }

  const isUserExists = (identifier) => {
    return axios.get(`/api/users/${identifier}`);
  }

	const checkUserExists = (e) => {
  	const field = e.target.name;
   	const val = e.target.value;
   	if (val !== '') {
   		isUserExists(val).then(res => {
				console.log("isUserExists res: ", res);
   			let checkUserErrors = errors;
   			let invalidEntry;
   			if (res.data.user.length != 0) {
					console.log("res.data: ", res.data);
   				checkUserErrors[field] = 'Someone has already chosen that ' + field;
           invalidEntry = true;
        } else {
   				checkUserErrors[field] = '';
   				invalidEntry = false;
   			}
   			setErrors(checkUserErrors); 
				setInvalid(invalidEntry) });
   		};
  }

  const userSignUpRequest = async (userData) => {
		console.log("userSignUpRequest userData: ", userData);
    let res = await axios.post('/api/users', userData);
  }

  const onSubmit = (e) => {
    e.preventDefault();
	  let signUpData = {firstname, lastname, username, email, identifier: username, password, confirmpass, mtgTypes};
    if (isValid()) {
			setErrors({}); 
			setIsLoading(true);
		setIdentifier(username);
		const loginData = signUpData;
  	userSignUpRequest(signUpData)
			.then(res => {
      	  const dataString = '{"user":"' + username + '", "mtg_types":"' + mtgTypes + '"}';
      	  axios.post('/api/uploadMtgTypes', JSON.parse(dataString))
            .then((result) => {
      	  		console.log("result in handleMtgTypesClick: ", result);
            })
			})
		  .then(function (returned) {
			    login(loginData)
    	      .then(person => {
                addFlashMessage({
                  type: 'success',
                  text: 'You signed up successfully. Welcome!'
                }) 
							  setIsAuthenticated(true);
                setUser({firstname:person.firstname, lastname:person.lastname, roomname:person.roomname, username:person.username, mtgTypes:person.mtgTypes});
				  		  setUsername(person.username);
							  setSigningUp(true);
				  			navigate('/mtgScheduler/userPage');
						})
        })  
    	  .catch((error) => {
    	    console.log("signUpForm.js userSignUpRequest error: ", error);
    	    setErrors(error); 
					setIsLoading(false);
					console.log("sign up failure isAuthenticated: ", isAuthenticated);
					addFlashMessage({
            type: 'fail',
            text: 'Username not found. Please try again or sign up if you are a new user.'
          }); 
    	  });
	 } // <- closes   if (isValid())
	}  // <- closes   onSubmit

		return (
			<form onSubmit={onSubmit} className='loginForm'>
			{ <p className='<errorMsg'>{errors.firstname}</p>} 
			  <input
			    value={firstname} 
			    onChange={handleFirstnameChange}
			    type='text' 
			    name='firstname' 
			    placeholder='First Name' 
          className='usernameInput'
			  />

			  { errors.lastname && 
					 <p className='errorMsg'>{errors.lastname}</p>} 
			  <input
			    value={lastname} 
			    onChange={handleLastnameChange}
			    type='text' 
			    name='lastname' 
			    placeholder='Last Name' 
          className='usernameInput'
			  />
			
			  { errors.username && 
					 <p className='errorMsg'>{errors.username}</p>} 
			  <input 
			    value={username} 
			    onChange={handleUsernameChange}
			    onBlur={checkUserExists}
			    type='text' 
			    name='username' 
			    placeholder='Username/Nickname' 
          className='usernameInput'
			  />
			
			  { errors.email && 
					 <p className='errorMsg'>{errors.email}</p>} 
			  <input 
			    value={email} 
			    onChange={handleEmailChange}
			    onBlur={checkUserExists}
			    type='text' 
			    name='email' 
			    placeholder='Email' 
          className='usernameInput'
			  />

			  { errors.password && 
					 <p className='errorMsg'>{errors.password }</p>} 
			  <input 
			    value={password} 
			    onChange={handlePasswordChange}
			    type='password' 
			    name='password' 
			    placeholder='Password' 
			    className='passwordInput'
			  />

			  { errors.confirmpass && 
					 <p className='errorMsg'>{errors.confirmpass }</p>} 
			  <input 
			    value={confirmpass} 
			    onChange={handleConfirmpassChange}
			    name='confirmpass' 
			    type='password' 
			    placeholder='Password once more' 
			    className='passwordInput'
			  />
        <div className='vSpace10px'/>

			<React.Fragment>
        <div className='centeredText'>Here you can optionally list meeting types you commonly attend to be displayed with your info (you can change this later):</div>
			  <div className='vSpace10px'/>
			  <input
			    value={mtgTypes} 
			    onChange={handleMtgTypesChange}
			    type='text' 
			    name='mtgTypes' 
			    placeholder='Meetings' 
          className='input500'
			  />
			</React.Fragment>

			  <button className='signUpButton' disabled={isLoading || invalid }>Sign Up</button>

			</form>
		);
}

export default SignUpForm;

