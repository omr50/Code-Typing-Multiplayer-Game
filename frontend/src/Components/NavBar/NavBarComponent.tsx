import React, { useEffect, useRef, useState } from 'react';
// import tripLogo from '../../images/tripLogo.png'
// import { useNavigate } from "react-router-dom"
// import LoginComponent from '../loginComponent/LoginComponent'
import { Button, Col, Container, Nav, NavDropdown, Navbar, Row } from 'react-bootstrap';
import './NavbarStyles.css'
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/theme/ThemeContext';
import LoginComponent from '../Login/Login';
import SignupComponent from '../Login/subComponents/signupComponent';
import { useAuth } from '../../contexts/auth/AuthContext';
// import { useAuth } from '../auth/AuthContext';
// import LoginOptions from '../loginComponent/subComponents/LoginOptionsComponent';

interface ChildProp {
  changeComp: (newComp: React.ReactNode, type: String) => void
  closeorOpenForm: () => void;
  formIsOpen: boolean;
}

const overlayStyles: React.CSSProperties = {
  'position': 'fixed',
  'top': 0,
  'left': 0,
  'width': '100%',
  'height': '100%',
  'backgroundColor': 'rgba(0, 0, 0, 0.25)', // Adjust the opacity (0.5 in this case) to control transparency
  'zIndex': 1000, // Set a higher z-index to ensure it appears above other elements
};


const NavigationBar: React.FC<ChildProp>= (props) => {
  const { theme, toggleTheme }= useTheme();
  const navigate = useNavigate()
  // const authContext = useAuth()
  const [pageTitle, setPageTitle] = useState("")
  const intervalRef = useRef<NodeJS.Timer>()
  const [signupComp, setSignupComp] = useState<boolean>(false)
  // const navigate = useNavigate();
  const {username, token, logout} = useAuth();

  useEffect(() => {
    const arr = "Crack Coder".split("");

    intervalRef.current = setInterval(() => {
      if (pageTitle.length === arr.length) {
        clearInterval(intervalRef.current);
        return;  // exit the callback
      }
      setPageTitle(title => title + arr[title.length]);
    }, 350);

    // Cleanup effect by clearing the interval when component is unmounted
    return () => {
      clearInterval(intervalRef.current);
    }
  }, [pageTitle]); 

  const overlayStyles: React.CSSProperties = {
    'position': 'fixed',
    'top': 0,
    'left': 0,
    'width': '100%',
    'height': '100%',
    'zIndex': 1000, // Set a higher z-index to ensure it appears above other elements
  };


  return (
    <div>
      {props.formIsOpen && <div className='form-opacity' style={overlayStyles} onClick={props.closeorOpenForm}/>}
      {(props.formIsOpen) && <LoginComponent closeForm={props.closeorOpenForm} switchSignup={signupComp} />}
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className='nav-head'>
        <Container>
          <img src="data:image/png;base64,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"></img>
          <span className='nav-bar-title' onClick={()=> {navigate('/')}}>{pageTitle}<span className='cursor'></span></span>
        {/* <Navbar.Brand href="#home" className="d-flex justify-content-left m-2 svg-NavLogo"><img src={tripLogo} alt="Trip Advisor Logo" className="svg-home-logo" /> </Navbar.Brand> */}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
          </Nav>
          <span className='right-sided-links'>
          <Nav>
          <Nav.Link href="#features" className='nav-link-style'>              
            &#xa0;leaderboard
          </Nav.Link>
          {token ?
          <>
            <Nav.Link className='nav-link-style' onClick={()=>{navigate('/profile')}}>
              &#xa0;{username}
            </Nav.Link>

            <Nav.Link className='nav-link-style' onClick={logout}>
              &#xa0;logout
            </Nav.Link>
          </>
          :
          <>
          <Nav.Link className='nav-link-style' onClick={()=>{props.closeorOpenForm(); setSignupComp(true) }}>
            &#xa0;signup
          </Nav.Link>
          <Nav.Link className='nav-link-style' onClick={()=> {props.closeorOpenForm(); setSignupComp(false)}}>
            &#xa0;login
          </Nav.Link>
          </>
        }

          <Nav.Link className='theme' onClick={toggleTheme}>
              <span>
                {theme === 'light' && <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABH0lEQVR4nO3VTytEURgH4CeUEgtLhuzkY1iaBQvJF2CF1BSfwkrsKCv2UnwUWVj4t5ZRFmJGp46SzMy9457bLOat3+7ennvf3nNe+tWDNYnxMsEKTnGLobLQVdTRxF5ZaA2NiIYslPWnjR9oM7Y8aU3g+RcaMpwaPvsDDRlLfWTeW8CzKeHdFmjy4bpsAx+khO/awPcYTAW/tYFD1lLB9Q7wY6rpvukAN+McFN7yqwxwyD4GioS3MsIh50W2fRofOfAnrBfV+uMc8HcecIgq5jCKEcxgEfNZ4EqG6c6Tl7h4MlU1Z8tbJazWlbwt38bnP9Dw7oYua6nLtod9vqyAVXmUsfXhmZN4OgqrKWzGm+sar/FuD8vjAjvxI/vVW/UFABDWXHcFkVQAAAAASUVORK5CYII="/>}
                {theme === 'dark' && <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABYUlEQVR4nO2X0UrDMBiFv147vdnais8iqHsBmfgqIt7p9jK9U+ZbFOcEFX2LafV2RgJHCGM1yxadQg/8UOj5z3+SJn9SaPDPYRSNgR9BChRAtsInyKRhtYJRSPwByJcwkCvXSCsYKXAvgWdgJyA3c3KfgG2WRA48SqgEEokPgDHwrrgF+jKdiGuUWzd7QSZKYBc4Bipn6mfjFTgSt4xR/AuJin+o0CWwB2wo9oErvZsCPeVEQ+aM/OQb3qk4L0AnpoGBM3IfhuJexDRwJ1E77T4ciGsXZjDMnLB403NrAY1NcSuPZpCBKsDAlrMjgg3UYaxEu9p96Io7IiL6ErVbzYdrcc9jGkg1pUZbrQ5n4kyAdkwDiTrcVAWGWu0tRdcZueUcxmxEudOKe2oyda14ouLRWnE+5zDqqMmMtD3tDrnRN2/HPIzSmSP114/j4i9cSIp1XskWQXMtN+v+MWnAqvgES5eaf5COkWwAAAAASUVORK5CYII="/>}
              </span>
              {/* {authContext.isAuthenticated ? <img style={{borderRadius: '50%', width: '50%', minWidth: '50px', maxWidth: '60px'}} src='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/f6/e7/3d/default-avatar-2020-55.jpg?w=100&h=-1&s=1'/> : <Button className="signin-button-user-password end" onClick={props.closeorOpenForm}>Sign in</Button>} */}
            </Nav.Link>
          </Nav>
          </span>

        </Navbar.Collapse>
        </Container>
    </Navbar>
</div>
  );
}

export default NavigationBar;