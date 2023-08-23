import React, { useState, useEffect, useRef  } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom"
// import LoginComponent from "../loginComponent/LoginComponent";
import "./WelcomeStyles.css"
import CategoryTab from "./CategoryTab";
import axios from "axios";
import Image from './animal-typing.jpg'
// import { apiClient } from "../api/ApiClient";

function WelcomeComponent() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState(0)
  const [pageWidth, setPageWidth] = useState(window.innerWidth);
  const [left, setLeft] = useState(true)
  const [right, setRight] = useState(true)
  const [scrolled, setScrolled] = useState(0)
  const [suggestedHotels, setSuggestedHotels] = useState([])
  const [search, setSearch] = useState('')
  const [hotelResult, setHotelResult] = useState([])
  const [regionResult, setRegionResult] = useState<string>('')
  const [searchStyles, setSearchStyles] = useState({})
  const [clicked, setClicked] = useState(false)

  // useEffect(()=> {
  //   apiClient.get("/hotels/suggestions")
  //   .then((response)=> {
  //     if (response){
  //       console.log(response.data)
  //       setSuggestedHotels(response.data)
  //     }
  //   })
  //   .catch((error) => {
  //     console.log(error)
  //   })
  // }, [])

  useEffect(() => {
    const handleResize = () => {
      setPageWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(()=> {
    if (containerRef.current){
      if (scroll > containerRef.current.scrollWidth - containerRef.current.clientWidth)
        setScroll(containerRef.current.scrollWidth - containerRef.current.clientWidth)
      }
  }, [pageWidth])

  useEffect(()=> {
    console.log(scrolled)
    if (containerRef.current){

      // if page width is smaller than the scroll left then set it back

      if (scroll >= containerRef.current.scrollWidth - containerRef.current.clientWidth){
        setScroll(containerRef.current.scrollWidth - containerRef.current.clientWidth)
        containerRef.current.scrollLeft = containerRef.current.scrollWidth - containerRef.current.clientWidth
        setRight(false)
      }
      else {
        containerRef.current.scrollLeft = scroll;
        setRight(true)
      }

      if (scroll <= 0){
        setScroll(0)
        containerRef.current.scrollLeft = 0
        setLeft(false)
      }
      else {
        containerRef.current.scrollLeft = scroll;
        setLeft(true)
      }
    }
    console.log("Scroll Left: ", containerRef.current?.scrollLeft)
  }, [scrolled, pageWidth])


  const container = containerRef.current;
  console.log(container)
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
      setScroll(0);
      setLeft(false);
      setRight(true);
    }
  }, []);

  const scrollToLeft = () => {
    const scrollAmount = 200; // Adjust the scroll distance as needed
    if (containerRef.current != null) {
      setScrolled(scrolled+1)
      // containerRef.current.scrollLeft -= scrollAmount;
      setScroll(containerRef.current.scrollLeft - 200)
  }
  };

  const scrollToRight = () => {
    if (containerRef.current) {
      setScrolled(scrolled+1)

      const scrollAmount = 200; // Adjust the scroll distance as needed
      // containerRef.current.scrollLeft += scrollAmount;
      setScroll(containerRef.current.scrollLeft + 200)
    }
  };

  return (
    <div>
    {clicked && <div className="page-white" onClick={(e)=>{setClicked(false)}}></div>}
    <div className="whole-page">
    <div className="home-page" ref={containerRef}>
      {pageWidth < 2992 && right ? <div><div className="svg-background-right"></div><img className="scroll-right" onClick={scrollToRight} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADg0lEQVR4nO2ay08UQRDGfyiyazAiC7hwk6PBqP+ECgqK3FC8afAiEvTq46yeSEj4OzBIIFFDosYngk+eJ5WDEW8uEDRrOn6TdHAfM8POA8KXTHhUdXf1VHV19dcD29i6SAHtwF1gGJgGfgKreszvnyUzOmeAamKCJHABGAP+AFmPz29gFOgCElFMYDdwDVi0jFoBHgE35JmDeuO79FTrf0Z2E3isNk77b0CfXk4oOAUsWAa8Ai4CVT762gdcAl5b/c0DLQQI86YGrQHfAMdL2H8z8NbqfyAI79TLcDPAL+AKsLPUg/Cvz6tAxvJ2ulSdN8rdWWWdQwSPw8CMxpyTDRtCndXhS6CW8FANPNHYC4oKX0ha4fQMqCR8VALPrTDztWYGrXAym11UqLGiwiQAzynWWdhhrAk3ayYjm0x2c73ZOfuEyU5xQa+1+F2F2HVrnwgixfpFOTAp28ykCiKhUsEoHyN+OCnbFot5pcvKEEFhAnjnM52WWZn0XCHFMSmZ2ikoTGmMTz4n0632I/kUUiqrV3wWgG5Rr5TuTCbtY6NcBdby2XlWnT8keOwHPmg8cwBr8Nh+XG3bcgnvSWjOE2HA9sxHj565rXZ3cgmHJTxNeLA9Yybl1jNO9AzlEs5KaE5xYcL2zHtNrhiarLD8D0sSRlFXrfdMfRH9Wul+zyVclbCiSB53dtcgn0kXG7fDE/iayA5taLGeyFKEoZX2GFp1hUJryyz2YQkNAxiVJxpctusolH6dDdGQZ5t6Q2yX0LCFYXpiIyVKa75izCkaDQMY16IxZRWNe/MpjWoAQ2PGtYy/rPYPCimdl5LhYoPCC1Gjfg9WE7Kxs9hG81WKJ4gfWmXbFzfXEH1Snogh+TAl23rcNEhaXK8hlOOCPtk04+VSqEWNMiLHosZRYFk2eb7KGLDegKEto0KdSDljS7+fDpKihbIikqMgsfcoy2X1M7GRtzFtXSuYv8NCCniqsedLceHTaLnWhNkRwlkTcxrTVOUHStVx2gqzjLhXkw5LjXJlp2UrnNyU9Z7XzMC6U1ypbl/LdJUxZfXfH/Tde7Pldoe17/b5FUNKtZN9fJ4t8W1xUe/0WuVMVhWpKa9viXdqUtqu0FOjS6MO6YxbPIFTdvRE9QVEQqz4iI4AXkmGNZ1MO6OaQC5UiYs1p7b7OnP8sD6q+aHSfUg6bYXOE9tgk+Mvs7BwO2/6kC8AAAAASUVORK5CYII="/> </div>: ""}
      {pageWidth < 2992 && left ? <div><div className="svg-background-left"></div><img className="scroll-left" onClick={scrollToLeft} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADiElEQVR4nO2aSWsUURDHf8GYjChqJmbBkx4lon4Jl7jG3OJyU+LFhejV5ayeAgE/hxJDAipx342KS0w8uRxEvRkVlZHCf0OhM5Punl5G8Q8Nmbx6r+p11avtNfzHv4si0AOcAoaB58BH4Kse+/uZxoxmG9BCnaAA7AbGgB9AKeLzHRgFdgHNeWxgHnAYeOuE+gJcBI5KMyv0xufqadH/bOwYcElzgvlvgAG9nEywCXjpBLgD7AEWxVhrMbAXuOvWmwa6SRH2ps44hveAdQmuvwF44NYfSkM7nRLcGHwC9gNzkmbCrzUPAjNO2x1JLb5c6i7J66wkfawCJsVzSjLUhDa34G1gCdmhBbgq3i9lFbFQcOZ0HZhP9pgP3HRmFuvMnHHmZMEuL7Q6qzAHENnFBgc7izMR5szMSCbzbqGDXRAnzDvVCw65wx/KxI64OJGGi42LRmBCstmmqqJZqYIRr6X+sFGyvZ1NK7uch4iDTqUbN0gHDc6T7qhGOCYiy53ibOKp5t8X0zTQLx4jlQiKSqu/xEgAO9wmntUSvEIGSqtvvlWSc7sEuUA0tAOPNdeKqaWkj3Hx21Ju8LQGrZ6IooknGWnC44R4nqQMhjW4lfB5WNaa+N16zlIGLzRoVVwUc8pSEwG63Av8Ax80WAyhiUc5aSLAEvF/Rxl81WATldHgNpHmc4XZA3fQJ4i9kYcZbORyLRuJY1qTOZlWWzXT+mcO+7AGrQMY1f1mrZneau43CIjWPPurA2KPBq1bGAXtOWhmXPw2V0rGgqTROoD1mjQWXdK4sBLRqISxNmYtabxVcmlhn3icr0a0U0RWHBFzMxNq4aSBBtU6JmPfbIHmtQjXU3/YLNlehbmGGHBVXr01Hx5KtgNhJhRcr9cayvWCAecZQ18KdWvSjJpjeWMN8FkyRb7KGHJvwNqWeaFNTTmTZTDOAgW1hUryQnk0sRcAtyTDrVruGduUmAXXCvY7KxSBa+I9ncSFz3KnWjOz1WRzJqbE07LyZUkt3OHMbEa9V3OHSaNR3umzMyfL5RJFwTmAIA3pTjBi21WGrz4H07573+DUHnTt+2N+xVBU7hSkHSWZUpK3xbNq55BLZ0rKSC29Pq6+U5fcdpOeVl0a9Ypm3PUJgrTjQF5fQDSrKz6iEiBqk+GbKtO+vDZQDovUi7Wq7Zzqkvfuo5r3SvPPimZLtXriP/jL8RMhpXAUmuIBHwAAAABJRU5ErkJggg=="/> </div>: ""}
      <CategoryTab text={'Javascript'} language="javascript" img={<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
<path fill="#ffd600" d="M6,42V6h36v36H6z"></path><path fill="#000001" d="M29.538 32.947c.692 1.124 1.444 2.201 3.037 2.201 1.338 0 2.04-.665 2.04-1.585 0-1.101-.726-1.492-2.198-2.133l-.807-.344c-2.329-.988-3.878-2.226-3.878-4.841 0-2.41 1.845-4.244 4.728-4.244 2.053 0 3.528.711 4.592 2.573l-2.514 1.607c-.553-.988-1.151-1.377-2.078-1.377-.946 0-1.545.597-1.545 1.377 0 .964.6 1.354 1.985 1.951l.807.344C36.452 29.645 38 30.839 38 33.523 38 36.415 35.716 38 32.65 38c-2.999 0-4.702-1.505-5.65-3.368L29.538 32.947zM17.952 33.029c.506.906 1.275 1.603 2.381 1.603 1.058 0 1.667-.418 1.667-2.043V22h3.333v11.101c0 3.367-1.953 4.899-4.805 4.899-2.577 0-4.437-1.746-5.195-3.368L17.952 33.029z"></path></svg>}/>
        <CategoryTab text={'Java'} language="java" img={<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
<path fill="#F44336" d="M23.65,24.898c-0.998-1.609-1.722-2.943-2.725-5.455C19.229,15.2,31.24,11.366,26.37,3.999c2.111,5.089-7.577,8.235-8.477,12.473C17.07,20.37,23.645,24.898,23.65,24.898z"></path><path fill="#F44336" d="M23.878,17.27c-0.192,2.516,2.229,3.857,2.299,5.695c0.056,1.496-1.447,2.743-1.447,2.743s2.728-0.536,3.579-2.818c0.945-2.534-1.834-4.269-1.548-6.298c0.267-1.938,6.031-5.543,6.031-5.543S24.311,11.611,23.878,17.27z"></path><g><path fill="#1565C0" d="M32.084 25.055c1.754-.394 3.233.723 3.233 2.01 0 2.901-4.021 5.643-4.021 5.643s6.225-.742 6.225-5.505C37.521 24.053 34.464 23.266 32.084 25.055zM29.129 27.395c0 0 1.941-1.383 2.458-1.902-4.763 1.011-15.638 1.147-15.638.269 0-.809 3.507-1.638 3.507-1.638s-7.773-.112-7.773 2.181C11.683 28.695 21.858 28.866 29.129 27.395z"></path><path fill="#1565C0" d="M27.935,29.571c-4.509,1.499-12.814,1.02-10.354-0.993c-1.198,0-2.974,0.963-2.974,1.889c0,1.857,8.982,3.291,15.63,0.572L27.935,29.571z"></path><path fill="#1565C0" d="M18.686,32.739c-1.636,0-2.695,1.054-2.695,1.822c0,2.391,9.76,2.632,13.627,0.205l-2.458-1.632C24.271,34.404,17.014,34.579,18.686,32.739z"></path><path fill="#1565C0" d="M36.281,36.632c0-0.936-1.055-1.377-1.433-1.588c2.228,5.373-22.317,4.956-22.317,1.784c0-0.721,1.807-1.427,3.477-1.093l-1.42-0.839C11.26,34.374,9,35.837,9,37.017C9,42.52,36.281,42.255,36.281,36.632z"></path><path fill="#1565C0" d="M39,38.604c-4.146,4.095-14.659,5.587-25.231,3.057C24.341,46.164,38.95,43.628,39,38.604z"></path></g></svg>}/>
        <CategoryTab text={'C'} language="c" img={<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
<path fill="#283593" fill-rule="evenodd" d="M22.903,3.286c0.679-0.381,1.515-0.381,2.193,0 c3.355,1.883,13.451,7.551,16.807,9.434C42.582,13.1,43,13.804,43,14.566c0,3.766,0,15.101,0,18.867 c0,0.762-0.418,1.466-1.097,1.847c-3.355,1.883-13.451,7.551-16.807,9.434c-0.679,0.381-1.515,0.381-2.193,0 c-3.355-1.883-13.451-7.551-16.807-9.434C5.418,34.899,5,34.196,5,33.434c0-3.766,0-15.101,0-18.867 c0-0.762,0.418-1.466,1.097-1.847C9.451,10.837,19.549,5.169,22.903,3.286z" clip-rule="evenodd"></path><path fill="#5c6bc0" fill-rule="evenodd" d="M5.304,34.404C5.038,34.048,5,33.71,5,33.255 c0-3.744,0-15.014,0-18.759c0-0.758,0.417-1.458,1.094-1.836c3.343-1.872,13.405-7.507,16.748-9.38 c0.677-0.379,1.594-0.371,2.271,0.008c3.343,1.872,13.371,7.459,16.714,9.331c0.27,0.152,0.476,0.335,0.66,0.576L5.304,34.404z" clip-rule="evenodd"></path><path fill="#fff" fill-rule="evenodd" d="M24,10c7.727,0,14,6.273,14,14s-6.273,14-14,14 s-14-6.273-14-14S16.273,10,24,10z M24,17c3.863,0,7,3.136,7,7c0,3.863-3.137,7-7,7s-7-3.137-7-7C17,20.136,20.136,17,24,17z" clip-rule="evenodd"></path><path fill="#3949ab" fill-rule="evenodd" d="M42.485,13.205c0.516,0.483,0.506,1.211,0.506,1.784 c0,3.795-0.032,14.589,0.009,18.384c0.004,0.396-0.127,0.813-0.323,1.127L23.593,24L42.485,13.205z" clip-rule="evenodd"></path></svg>}/>
        <CategoryTab text={'Go'}  language="go" img={<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
<path fill="#ffcc80" d="M35.547 42.431l-3.182-3.182-2.121 2.121 3.182 3.182c.586.586 1.536.586 2.121 0S36.133 43.017 35.547 42.431zM38.547 24.431l-3.182-3.182-2.121 2.121 3.182 3.182c.586.586 1.536.586 2.121 0S39.133 25.017 38.547 24.431zM12.683 42.431l3.182-3.182 2.121 2.121-3.182 3.182c-.586.586-1.536.586-2.121 0S12.097 43.017 12.683 42.431zM9.433 24.431l3.182-3.182 2.121 2.121-3.182 3.182c-.586.586-1.536.586-2.121 0S8.847 25.017 9.433 24.431z"></path><path fill="#4dd0e1" d="M38 8c0-1.933-1.149-3-3.231-3S31 7.567 31 9.5c0 1 1.923 1.5 3 1.5C36.082 11 38 9.933 38 8zM10 8c0-1.933 1.149-3 3.231-3S17 7.567 17 9.5c0 1-1.923 1.5-3 1.5C11.918 11 10 9.933 10 8z"></path><path fill="#424242" d="M35 7A1 1 0 1 0 35 9 1 1 0 1 0 35 7zM13 7A1 1 0 1 0 13 9 1 1 0 1 0 13 7z"></path><path fill="#4dd0e1" d="M37,34c0,4.774-3.219,10-13.31,10C15.568,44,11,38.774,11,34c0-5,1-5.806,1-10c0-4.688,0-7,0-10 c0-4.774,3.076-11,11.69-11S36,6.991,36,13c0,3-0.237,5.453,0,10C36.186,26.562,37,31,37,34z"></path><g><path fill="#f5f5f5" d="M29 6A4 4 0 1 0 29 14 4 4 0 1 0 29 6zM19 6A4 4 0 1 0 19 14 4 4 0 1 0 19 6z"></path></g><g><path fill="#eee" d="M24 20c0 .552.448 1 1 1s1-.448 1-1v-3h-2V20zM22 20c0 .552.448 1 1 1s1-.448 1-1v-3h-2V20z"></path></g><path fill="#ffcc80" d="M26.5,18c-0.412,0-0.653-0.085-1.011-0.205c-0.975-0.328-2.021-0.326-2.996,0.002 C22.138,17.916,21.91,18,21.5,18c-1.334,0-1.5-1-1.5-1.5c0-1.5,1.5-2.5,3-2.5c0.835,0,1.165,0,2,0c1.5,0,3,1,3,2.5 C28,17,27.834,18,26.5,18z"></path><g><path fill="#424242" d="M27 9A1 1 0 1 0 27 11 1 1 0 1 0 27 9zM17 9A1 1 0 1 0 17 11 1 1 0 1 0 17 9zM24 13A2 1 0 1 0 24 15 2 1 0 1 0 24 13z"></path></g></svg>}/>
        <CategoryTab text={'C++'} language="cpp" img={<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
    <linearGradient id="Ey3AfYdg0JtJGx7I73Eu7a_TpULddJc4gTh_gr1" x1="5" x2="43" y1="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset=".002" stop-color="#427fdb"></stop><stop offset=".397" stop-color="#2668cb"></stop><stop offset=".763" stop-color="#1358bf"></stop><stop offset="1" stop-color="#0c52bb"></stop></linearGradient><path fill="url(#Ey3AfYdg0JtJGx7I73Eu7a_TpULddJc4gTh_gr1)" fill-rule="evenodd" d="M22.903,3.286c0.679-0.381,1.515-0.381,2.193,0	c3.355,1.883,13.451,7.551,16.807,9.434C42.582,13.1,43,13.804,43,14.566c0,3.766,0,15.101,0,18.867	c0,0.762-0.418,1.466-1.097,1.847c-3.355,1.883-13.451,7.551-16.807,9.434c-0.679,0.381-1.515,0.381-2.193,0	c-3.355-1.883-13.451-7.551-16.807-9.434C5.418,34.899,5,34.196,5,33.434c0-3.766,0-15.101,0-18.867	c0-0.762,0.418-1.466,1.097-1.847C9.451,10.837,19.549,5.169,22.903,3.286z" clip-rule="evenodd"></path><linearGradient id="Ey3AfYdg0JtJGx7I73Eu7b_TpULddJc4gTh_gr2" x1="5" x2="42.487" y1="18.702" y2="18.702" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#32bdef"></stop><stop offset="1" stop-color="#1ea2e4"></stop></linearGradient><path fill="url(#Ey3AfYdg0JtJGx7I73Eu7b_TpULddJc4gTh_gr2)" fill-rule="evenodd" d="M5.304,34.404C5.038,34.048,5,33.71,5,33.255c0-3.744,0-15.014,0-18.759c0-0.758,0.417-1.458,1.094-1.836	c3.343-1.872,13.405-7.507,16.748-9.38c0.677-0.379,1.594-0.371,2.271,0.008c3.343,1.872,13.371,7.459,16.714,9.331	c0.27,0.152,0.476,0.335,0.66,0.576L5.304,34.404z" clip-rule="evenodd"></path><path fill="#fff" fill-rule="evenodd" d="M24,10c7.727,0,14,6.273,14,14s-6.273,14-14,14s-14-6.273-14-14	S16.273,10,24,10z M24,17c3.863,0,7,3.136,7,7c0,3.863-3.137,7-7,7s-7-3.137-7-7C17,20.136,20.136,17,24,17z" clip-rule="evenodd"></path><linearGradient id="Ey3AfYdg0JtJGx7I73Eu7c_TpULddJc4gTh_gr3" x1="23.593" x2="43" y1="23.852" y2="23.852" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2aa4f4"></stop><stop offset="1" stop-color="#007ad9"></stop></linearGradient><path fill="url(#Ey3AfYdg0JtJGx7I73Eu7c_TpULddJc4gTh_gr3)" fill-rule="evenodd" d="M42.485,13.205c0.516,0.483,0.506,1.211,0.506,1.784c0,3.795-0.032,14.589,0.009,18.384c0.004,0.396-0.127,0.813-0.323,1.127	L23.593,24L42.485,13.205z" clip-rule="evenodd"></path><g opacity=".05"><path d="M33,21v2h2v2h-2v2h-2v-2h-2v-2h2v-2H33 M34,20h-1h-2h-1v1v1h-1h-1v1v2v1h1h1v1v1h1h2h1v-1v-1h1h1v-1v-2v-1h-1h-1v-1V20 L34,20z"></path><path d="M40,21v2h2v2h-2v2h-2v-2h-2v-2h2v-2H40 M41,20h-1h-2h-1v1v1h-1h-1v1v2v1h1h1v1v1h1h2h1v-1v-1h1h1v-1v-2v-1h-1h-1v-1V20 L41,20z"></path></g><g opacity=".07"><path d="M33,21v2h2v2h-2v2h-2v-2h-2v-2h2v-2H33 M33.5,20.5H33h-2h-0.5V21v1.5H29h-0.5V23v2v0.5H29h1.5V27v0.5H31h2h0.5V27v-1.5H35 h0.5V25v-2v-0.5H35h-1.5V21V20.5L33.5,20.5z"></path><path d="M40,21v2h2v2h-2v2h-2v-2h-2v-2h2v-2H40 M40.5,20.5H40h-2h-0.5V21v1.5H36h-0.5V23v2v0.5H36h1.5V27v0.5H38h2h0.5V27v-1.5H42 h0.5V25v-2v-0.5H42h-1.5V21V20.5L40.5,20.5z"></path></g><polygon fill="#fff" points="33,21 31,21 31,23 29,23 29,25 31,25 31,27 33,27 33,25 35,25 35,23 33,23"></polygon><polygon fill="#fff" points="42,23 40,23 40,21 38,21 38,23 36,23 36,25 38,25 38,27 40,27 40,25 42,25"></polygon><g><path d="M24,10c5.128,0,9.602,2.771,12.041,6.887l-6.073,3.47C28.737,18.347,26.527,17,24,17c-3.864,0-7,3.136-7,7 c0,3.863,3.137,7,7,7c2.57,0,4.812-1.392,6.029-3.459l6.132,3.374C33.75,35.142,29.21,38,24,38c-7.727,0-14-6.273-14-14 S16.273,10,24,10 M24,9C15.729,9,9,15.729,9,24s6.729,15,15,15c5.367,0,10.36-2.908,13.03-7.59l0.503-0.882l-0.89-0.49 l-6.132-3.374l-0.851-0.468l-0.493,0.837C28.09,28.863,26.11,30,24,30c-3.308,0-6-2.692-6-6s2.692-6,6-6 c2.099,0,4.011,1.076,5.115,2.879l0.507,0.828l0.842-0.481l6.073-3.47l0.882-0.504l-0.518-0.874C34.205,11.827,29.262,9,24,9L24,9 z" opacity=".05"></path><path d="M24,10c5.128,0,9.602,2.771,12.041,6.887l-6.073,3.47C28.737,18.347,26.527,17,24,17c-3.864,0-7,3.136-7,7 c0,3.863,3.137,7,7,7c2.57,0,4.812-1.392,6.029-3.459l6.132,3.374C33.75,35.142,29.21,38,24,38c-7.727,0-14-6.273-14-14 S16.273,10,24,10 M24,9.5C16.005,9.5,9.5,16.005,9.5,24S16.005,38.5,24,38.5c5.188,0,10.014-2.812,12.595-7.337l0.252-0.441 l-0.445-0.245l-6.132-3.374l-0.425-0.234l-0.246,0.418C28.431,29.269,26.286,30.5,24,30.5c-3.584,0-6.5-2.916-6.5-6.5 s2.916-6.5,6.5-6.5c2.275,0,4.346,1.166,5.542,3.118l0.253,0.414l0.421-0.241l6.073-3.47l0.441-0.252l-0.259-0.437 C33.864,12.233,29.086,9.5,24,9.5L24,9.5z" opacity=".07"></path></g></svg>}/>
    <CategoryTab text={'Python'} language="python" img={<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
<path fill="#0277BD" d="M24.047,5c-1.555,0.005-2.633,0.142-3.936,0.367c-3.848,0.67-4.549,2.077-4.549,4.67V14h9v2H15.22h-4.35c-2.636,0-4.943,1.242-5.674,4.219c-0.826,3.417-0.863,5.557,0,9.125C5.851,32.005,7.294,34,9.931,34h3.632v-5.104c0-2.966,2.686-5.896,5.764-5.896h7.236c2.523,0,5-1.862,5-4.377v-8.586c0-2.439-1.759-4.263-4.218-4.672C27.406,5.359,25.589,4.994,24.047,5z M19.063,9c0.821,0,1.5,0.677,1.5,1.502c0,0.833-0.679,1.498-1.5,1.498c-0.837,0-1.5-0.664-1.5-1.498C17.563,9.68,18.226,9,19.063,9z"></path><path fill="#FFC107" d="M23.078,43c1.555-0.005,2.633-0.142,3.936-0.367c3.848-0.67,4.549-2.077,4.549-4.67V34h-9v-2h9.343h4.35c2.636,0,4.943-1.242,5.674-4.219c0.826-3.417,0.863-5.557,0-9.125C41.274,15.995,39.831,14,37.194,14h-3.632v5.104c0,2.966-2.686,5.896-5.764,5.896h-7.236c-2.523,0-5,1.862-5,4.377v8.586c0,2.439,1.759,4.263,4.218,4.672C19.719,42.641,21.536,43.006,23.078,43z M28.063,39c-0.821,0-1.5-0.677-1.5-1.502c0-0.833,0.679-1.498,1.5-1.498c0.837,0,1.5,0.664,1.5,1.498C29.563,38.32,28.899,39,28.063,39z"></path></svg>}/>
    <CategoryTab text={'Typescript'} language="typescript" img={<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
<rect width="36" height="36" x="6" y="6" fill="#1976d2"></rect><polygon fill="#fff" points="27.49,22 14.227,22 14.227,25.264 18.984,25.264 18.984,40 22.753,40 22.753,25.264 27.49,25.264"></polygon><path fill="#fff" d="M39.194,26.084c0,0-1.787-1.192-3.807-1.192s-2.747,0.96-2.747,1.986 c0,2.648,7.381,2.383,7.381,7.712c0,8.209-11.254,4.568-11.254,4.568V35.22c0,0,2.152,1.622,4.733,1.622s2.483-1.688,2.483-1.92 c0-2.449-7.315-2.449-7.315-7.878c0-7.381,10.658-4.469,10.658-4.469L39.194,26.084z"></path></svg>}/>
<CategoryTab text={'HTML'} language="html" img={<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
<path fill="#E65100" d="M41,5H7l3,34l14,4l14-4L41,5L41,5z"></path><path fill="#FF6D00" d="M24 8L24 39.9 35.2 36.7 37.7 8z"></path><path fill="#FFF" d="M24,25v-4h8.6l-0.7,11.5L24,35.1v-4.2l4.1-1.4l0.3-4.5H24z M32.9,17l0.3-4H24v4H32.9z"></path><path fill="#EEE" d="M24,30.9v4.2l-7.9-2.6L15.7,27h4l0.2,2.5L24,30.9z M19.1,17H24v-4h-9.1l0.7,12H24v-4h-4.6L19.1,17z"></path></svg>}/>
    <CategoryTab text={'C#'} language="csharp" img={<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
<path fill="#37474f" fill-rule="evenodd" d="M22.903,3.286c0.679-0.381,1.515-0.381,2.193,0 c3.355,1.883,13.451,7.551,16.807,9.434C42.582,13.1,43,13.804,43,14.566c0,3.766,0,15.101,0,18.867 c0,0.762-0.418,1.466-1.097,1.847c-3.355,1.883-13.451,7.551-16.807,9.434c-0.679,0.381-1.515,0.381-2.193,0 c-3.355-1.883-13.451-7.551-16.807-9.434C5.418,34.899,5,34.196,5,33.434c0-3.766,0-15.101,0-18.867 c0-0.762,0.418-1.466,1.097-1.847C9.451,10.837,19.549,5.169,22.903,3.286z" clip-rule="evenodd"></path><path fill="#546e7a" fill-rule="evenodd" d="M5.304,34.404C5.038,34.048,5,33.71,5,33.255 c0-3.744,0-15.014,0-18.759c0-0.758,0.417-1.458,1.094-1.836c3.343-1.872,13.405-7.507,16.748-9.38 c0.677-0.379,1.594-0.371,2.271,0.008c3.343,1.872,13.371,7.459,16.714,9.331c0.27,0.152,0.476,0.335,0.66,0.576L5.304,34.404z" clip-rule="evenodd"></path><path fill="#fff" fill-rule="evenodd" d="M24,10c7.727,0,14,6.273,14,14s-6.273,14-14,14 s-14-6.273-14-14S16.273,10,24,10z M24,17c3.863,0,7,3.136,7,7c0,3.863-3.137,7-7,7s-7-3.137-7-7C17,20.136,20.136,17,24,17z" clip-rule="evenodd"></path><path fill="#455a64" fill-rule="evenodd" d="M42.485,13.205c0.516,0.483,0.506,1.211,0.506,1.784 c0,3.795-0.032,14.589,0.009,18.384c0.004,0.396-0.127,0.813-0.323,1.127L23.593,24L42.485,13.205z" clip-rule="evenodd"></path><path fill="#fff" fill-rule="evenodd" d="M34 20H35V28H34zM37 20H38V28H37z" clip-rule="evenodd"></path><path fill="#fff" fill-rule="evenodd" d="M32 25H40V26H32zM32 22H40V23H32z" clip-rule="evenodd"></path></svg>}/>
<CategoryTab text={'Kotlin'} language="kotlin" img={<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
<polygon fill="#0d91d6" points="24,6 17.99,12.35 11.97,18.69 6,25 6,6"></polygon><polygon fill="#f88909" points="24,6 23.96,6 17.97,12.33 11.96,18.68 6,24.97 6,25 6,25.09 6,42 14.69,33.31 20.87,27.13 27.06,20.94 33.25,14.75 42,6"></polygon><polygon fill="#c757bc" points="14.69,33.31 6,42 6,25.09"></polygon><polygon fill="#d3638f" points="20.87,27.13 14.69,33.31 6,25.09 6,25 11.97,18.69"></polygon><polygon fill="#e07063" points="27.06,20.94 20.87,27.13 11.97,18.69 17.99,12.35"></polygon><polygon fill="#ec7d36" points="33.25,14.75 27.06,20.94 17.99,12.35 24,6"></polygon><polygon fill="#f88909" points="42,6 33.25,14.75 24,6"></polygon><polygon fill="#0095d5" points="11.51,19.15 7.99,22.88 6,21 6,13.94"></polygon><polygon fill="#2b88da" points="15.03,15.42 11.51,19.15 6,13.94 6,6.87"></polygon><polygon fill="#557bde" points="18.56,11.7 15.03,15.42 6,6.87 6,6 12.53,6"></polygon><polygon fill="#806ee3" points="22.08,7.97 18.56,11.7 12.53,6 24,6"></polygon><polygon fill="#0095d5" points="23,25 6,42 9.35,42 17.52,42 40,42"></polygon><polygon fill="#2b88da" points="25.68,42 17.52,42 11.76,36.25 15.84,32.17"></polygon><polygon fill="#557bde" points="33.86,42 25.68,42 15.84,32.17 19.92,28.09"></polygon><polygon fill="#806ee3" points="42,42 33.86,42 19.92,28.09 24,24"></polygon></svg>}/>

</div>
    <div className="search-container">
      <div className="img-container">
        <img className='home-search-img' src={Image}></img>
        <div className="play-multiplayer-text">Race against other players!</div>
        <Button className="play-multiplayer-button" onClick={()=>{navigate('/multiplayer')}}>Play Now</Button>
        {/* <form>
          <input placeholder="Where to?" style={searchStyles} className="search-bar" onClick={()=>{setClicked(true)}}></input>
          <svg viewBox="0 0 24 24" width="1em" height="1em" className="search-svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.74 3.75a5.99 5.99 0 100 11.98 5.99 5.99 0 000-11.98zM2.25 9.74a7.49 7.49 0 1113.3 4.728l5.44 5.442-1.06 1.06-5.44-5.439A7.49 7.49 0 012.25 9.74z"></path></svg>
        </form> */}
      </div>
      </div>
      </div>
      </div>
  )
}

export default WelcomeComponent;