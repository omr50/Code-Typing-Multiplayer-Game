import { BrowserRouter, Route, Routes} from 'react-router-dom'
import { ReactNode, useState } from 'react'
import NavigationBar from './NavBar/NavBarComponent';
import WelcomeComponent from './Welcome/Welcome';
import SinglePlayerGame from './SinglePlayerGame/SinglePlayerGame';
import { useTheme } from '../contexts/theme/ThemeContext';
import MultiplayerGame from './MultiplayerGame/MultiplayerGame';
import AuthProvider from '../contexts/auth/AuthContext';
import Profile from './Profile/Profile';
// import { useAuth } from './auth/AuthContext';
// import { Navigate } from 'react-router-dom'
// import AuthProvider from './auth/AuthContext';
// import WelcomeComponent from './welcome/WelcomeComponent';
// import LoginComponent from './loginComponent/LoginComponent';
// import SignupComponent from './SignupComponent';
// import NavigationBar from './NavbarComponent/NavbarComponent';
// import LoginOptions from './loginComponent/subComponents/LoginOptionsComponent';

// function AuthenticatedRoute(props: MyComponentProps) {
//     const authContext = useAuth()
//     if (authContext.isAuthenticated)
//         return props.children
    
//         return <Navigate to="/login" />
// }
interface elementProp {
}

const AppStructure = () => {

    interface ChildProp {
        changeComp: ((newComp: React.ReactNode, type: String) => void) | null;
        closeComp: () => void;
    }
    // const [component, setComponent] = useState<React.ReactNode>(<LoginOptions changeComp={changeComponent} closeForm={closeComp}/>)
    const [componentType, setComponentType] = useState<String>('LoginOption')
    const [signup, setSignup] = useState<boolean>(false)

    function changeComponent(newComponent: React.ReactNode, type: String) {
        // setComponent(newComponent)
        setComponentType(type)
      }
    
    function closeComp() {
        setSignup(!signup);
    }

    return (
        <div className=''>
        {/* <AuthProvider> */}
            <BrowserRouter>
            <AuthProvider>
                <NavigationBar changeComp={changeComponent} closeorOpenForm={closeComp} formIsOpen={signup}/>
                <Routes>
                        <Route path='' element={<WelcomeComponent/>}/>
                        <Route path='/game/:language' element={<SinglePlayerGame/>}/>
                        <Route path='/multiplayer' element={<MultiplayerGame/>}/>
                        <Route path='/profile' element={<Profile/>}/>
                        {/* <Route path='/signup' element={<SignupComponent changeComp={changeComponent} closeForm={closeComp}/>}/> */}
                </Routes>
                {/* <FooterComponent/> */}
            </AuthProvider>
            </BrowserRouter>
        {/* </AuthProvider> */}
        </div>
    )
}











export default AppStructure;