import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { Button, Form } from "react-bootstrap";
import { useAuth } from "../../../contexts/auth/AuthContext";
import '../LoginStyles.css'
import SignupComponent from "./signupComponent";

interface ChildProp {
  changeComp: (newComp: React.ReactNode, type: String) => void
  closeForm: () => void;
}

const LoginUserPassword: React.FC<ChildProp> = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const {successfulSignup, setSignup} = useAuth();

  useEffect(()=> {
    if (successfulSignup) {
      setTimeout(()=>setSignup(false), 5000)
    }
  }, [successfulSignup])


  const navigate = useNavigate()
  const authContext = useAuth()

  function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value)
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value)
  }

  async function handleSubmit() {
    if (await authContext.login(username, password)) {
      props.closeForm();
    } else {
      setShowErrorMessage(true)
    }
  }
    return (
      <div>
        {showErrorMessage && (
        <div className="errorMessage alert bg-danger text-white" style={{ fontSize: '15px', textAlign: 'center', margin: '10px' }}>
          Authentication Failed. Check credentials or refresh the page
        </div>
      )}

        {successfulSignup && (
        <div className="errorMessage alert bg-success text-white" style={{ fontSize: '15px', textAlign: 'center', margin: '10px' }}>
          Successful Signup
        </div>
        )}
      <Form className="form-container">
      <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        <Form.Group controlId="username" className="form-group">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Username"
          />
        </Form.Group>

        <Form.Group controlId="password" className="form-group">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
          />
        </Form.Group>
        <div className="form-group">
          <a className="forgot-link" href="/">Forgot Password?</a>
        </div>
        </div>
        <div className="button-align">
          <Button onClick={handleSubmit} className="login-button">
            Login
          </Button>

          <div className="bottom-line">
            <span className="lines">&#x2015;&#x2015;&#x2015;&#x2015;&#x2015;</span>Not a member?<span className="lines">&#x2015;&#x2015;&#x2015;&#x2015;&#x2015;</span>
          </div>
        </div>
        <div className="join-text"><b className="join-link" onClick={()=>{props.changeComp(<SignupComponent changeComp={props.changeComp} closeForm={props.closeForm}/>, 'SignupComponent')}}>Join</b> to unlock the best of Code Racer.</div>

      </Form>
      </div>

    )
}

export default LoginUserPassword;