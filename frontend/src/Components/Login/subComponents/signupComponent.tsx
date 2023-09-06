import React, { useState } from "react";
import { Button, Form } from "react-bootstrap"
import { Link, useNavigate, useParams } from "react-router-dom"
import { signUpService } from "../../../contexts/auth/AuthenticationApiService";
import LoginUserPassword from "./loginUserPassword";
import LoginOptions from "./loginOptionsComponent";
import '../LoginStyles.css'
import { useAuth } from "../../../contexts/auth/AuthContext";
interface Error {
        [key: string]: any;
    };

interface ChildProp {
    changeComp: (newComp: React.ReactNode, type: String) => void;
    closeForm: () => void;
}

const SignupComponent: React.FC<ChildProp> = (props) => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [userExists, setUserExists] = useState(false)
    const [error, setError] = useState<Error>({})
    const navigate = useNavigate()
    const { setSignup } = useAuth();

    function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setUsername(event.target.value)
      }
    

    function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value)
    }
    
    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value)
    }
    function handlePassword2Change(event: React.ChangeEvent<HTMLInputElement>) {
      setPassword2(event.target.value)
      }

    function handleSubmit() {
        console.log('works')
        let newError: Error = {}
        if (email == '') {
            newError.email = "Enter a valid email!";
        } 
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            newError.email = "Invalid Email";
        }
        if (username.length < 3) {
            newError.username = "Username must be greater than 3 characters!";
        }
        if (password.length < 6 ) {
            newError.password = "Password must be at least 6 characters!";
        }
        if (password != password2) {
          newError.password = "Passwords must match!";
        }
        setError(newError)
        console.log("The Errors:", error)
        if (Object.keys(newError).length === 0){
          console.log("RUNNING SIGNUP SERVICE")
        signUpService(username, email, password)
        .then(response=> {
            // user successfully stored in db.
            // redirect to login page (add message some how)
            console.log("DATA", response.data)
            if (response.status === 201) {
              console.log('a', response)

              // props.closeForm();
              // redirect to login page and 
              // tell them the user creation
              // is successful.

              // set signup from the auth context is set
              // to true so that once we transfer to the
              // login component use sees that successful 
              // signup was done.
              setSignup(true)
              props.changeComp(<LoginUserPassword changeComp={props.changeComp} closeForm={props.closeForm}/>, 'LoginUserPassword')
            }
            // if there is a conflict let the user know.
            else if (response.status === 409) {
              newError.serverError = response.data;
            }
            setError(newError)
        })
        .catch(error =>{
            if (error.response && error.response.status === 409){
              if (error.response.data === 'Username already exists!') {
                setUsername('')
              }
              else if (error.response.data === 'Email already exists!') {
                setEmail('')
              }

              // if either user or email is not unique
              // then set the error to the returned error
              // message
              newError.serverError = error.response.data;
              // setUserExists(true)
            }
            else {
              newError.serverError = "Server Error.";
            }
            setError(newError)
        } )
    }

    }

        
    return (
        <div className="outer-div" style={{'display':'flex', 'flexDirection':'column', 'alignItems':'center'}}>
        {/* {userExists? <div className="alert alert-danger mt-3">Username Already Exists.</div> : ""} */}
        {Object.values(error).map((err: String)=> {
            return <div className="alert alert-danger mt-3 fs-6">{err}</div>
        })}
        <Form className="form-container form-style">
            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <Form.Group controlId="username" className="form-group">
            <Form.Label>Email</Form.Label>
            <Form.Control
                type="text"
                value={email}
                onChange={handleEmailChange}
                placeholder="Email"
            />
            </Form.Group>

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

            <Form.Group controlId="password2" className="form-group">
            <Form.Label>Password</Form.Label>
            <Form.Control
                type="password"
                value={password2}
                onChange={handlePassword2Change}
                placeholder="Re-Enter Password"
            />
            </Form.Group>

            <div className="form-group">
            <a className="forgot-link" href="/">Forgot Password?</a>
            </div>
            </div>
            <div className="button-align">
            <Button onClick={handleSubmit} className="login-button">
            Sign Up
            </Button>

            <div className="bottom-line">
            <span className="lines">&#x2015;&#x2015;&#x2015;&#x2015;&#x2015;</span>Already a member?<span className="lines">&#x2015;&#x2015;&#x2015;&#x2015;&#x2015;</span>
            </div>
            </div>
            <div className="join-text"><b className="join-link" onClick={()=>{props.changeComp(<LoginUserPassword changeComp={props.changeComp} closeForm={props.closeForm}/>, 'LoginUserPassword')}}>Sign in</b> using your Code Racer account.</div>

        </Form>
      </div>
    )
    }

export default SignupComponent;