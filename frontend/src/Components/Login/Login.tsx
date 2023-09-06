import { useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"
import { useAuth } from "../../contexts/auth/AuthContext"
import { Button, Form } from "react-bootstrap"
import './LoginStyles.css'
import LoginOptions from "./subComponents/loginOptionsComponent"
import SignupComponent from "./subComponents/signupComponent"
import LoginUserPassword from "./subComponents/loginUserPassword"

interface ChildProp {
  closeForm: () => void;
  switchSignup: boolean;
}

const LoginComponent: React.FC<ChildProp> = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [component, setComponent] = useState<React.ReactNode | null>(<LoginUserPassword changeComp={changeComponent} closeForm={props.closeForm}/>)
  const [componentType, setComponentType] = useState<String>('LoginUserPassword')

  useEffect(() => {
    console.log("not null", props.switchSignup)
    if (props.switchSignup) {
      setComponent(<SignupComponent changeComp={changeComponent} closeForm={props.closeForm}/>);
      setComponentType('SignupComponent')
    }

}, []);

  const navigate = useNavigate()
  const authContext = useAuth()
  function changeComponent(newComponent: React.ReactNode, type: String) {
    setComponent(newComponent)
    setComponentType(type)
  }
  function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value)
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value)
  }

  async function handleSubmit() {
    if (await authContext.login(username, password)) {
      navigate(`/welcome/${username}`)
    } else {
      setShowErrorMessage(true)
    }
  }

  return (
    <div className="Login">
      <h1 className="close-button" onClick={props.closeForm}>
        &#x2715;
      </h1>
      {(componentType == 'LoginUserPassword' ||componentType == 'SignupComponent') ? <h1 className="back-button" onClick={()=> {changeComponent(<LoginOptions changeComp={changeComponent} closeForm={props.closeForm}/>, 'LoginOptions')}}>&#x2039;</h1> : ''}
      <div style={{margin: '10px'}}></div>
      {/* <img src={TripLogo} alt="Trip Advisor Logo" className="svg-logo" /> */}
      {component}
    </div>
  )
}

export default LoginComponent

// import { useNavigate } from "react-router-dom"
// import React, { useState } from "react"
// import { useAuth } from "../auth/AuthContext"
// import { Button } from "react-bootstrap"
// import TripLogo from '../../images/tripLogo.png'
// import { Form, FormGroup } from "react-bootstrap"
// import './loginComponentStyles.css'
// interface ChildProp {
//   closeForm: () => void
// };

// const LoginComponent: React.FC<ChildProp> = (props) => {
//     const [username, setUsername] = useState('')
//     const [password, setPassword] = useState('')
//     const [showErrorMessage, setShowErrorMessage] = useState(false)
//     const [isHovered, setIsHovered] = React.useState(false);

//     const handleMouseEnter = () => {
//       setIsHovered(true);
//     };

//     const handleMouseLeave = () => {
//       setIsHovered(false);
//     };

//     const navigate = useNavigate()

//     const authContext = useAuth()

//     function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
//         setUsername(event.target.value);
//     }
//     function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
//         setPassword(event.target.value);
//     }
//     async function handleSubmit() {
//         if (await authContext.login(username, password)){
//             // if the user is actually correct then we will
//             // set that isAuthenticated is true in the context
//             navigate(`/welcome/${username}`)
//         }

//         else{
//             setShowErrorMessage(true)
//         }
//     }
//     return (
//       <div className="Login">
//             <h1 
//               className="close-button"
//               onMouseEnter={handleMouseEnter}
//               onMouseLeave={handleMouseLeave}
//               onClick={props.closeForm}
//             >
//               &#x2715;
//             </h1>
//           <img src={TripLogo} alt="Trip Advisor Logo" className="svg-logo" />
//           {showErrorMessage && (
//             <div className="errorMessage alert bg-warning text-white" style={{fontSize:'15px', textAlign:'center', margin:'10px'}}>
//               Authentication Failed. Check credentials or refresh the page
//             </div>
//           )}

//         <Form>
//           <div className="signup-text">
//             <Form.Label>Sign in to unlock the best of Tripadvisor.</Form.Label>
//           </div>
//           <div className="input-header">
//             <Form.Label>Username</Form.Label>
//           </div>
//           <Form.Group controlId="username" className='form-input'>
//             <Form.Control
//               type="text"
//               value={username}
//               onChange={handleUsernameChange}
//               className="input-bar"
//               placeholder="Username"
//             />
//           </Form.Group>
          
//           <div className="input-header">
//             <Form.Label>Password</Form.Label>
//           </div>
//           <div className="form-group-div">
//           <Form.Group className="form-group-box" controlId="password" style={{paddingTop:'8px'}}>
//             <Form.Control
//               type="password"
//               value={password}
//               onChange={handlePasswordChange}
//               className="input-bar"
//               placeholder="Password"
//             />
//           </Form.Group>
//           </div>

//           <div className="input-header">
//             <a href="/">Forgot Password?</a>
//           </div>
//           <br />
//           <div style={{textAlign: 'center'}}>
//           <Button
//             onClick={handleSubmit}
//             className="login-button"
//           >
//             Login
//           </Button>
//           </div>
//         </Form>
//       </div>
//     );
// }

// export default LoginComponent;