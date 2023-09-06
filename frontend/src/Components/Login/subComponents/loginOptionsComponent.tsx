import { Button } from "react-bootstrap";
import LoginUserPassword from "./loginUserPassword";
import SignupComponent from "./signupComponent";
interface ChildProp {
  changeComp: (newComp: React.ReactNode, type: String) => void
  closeForm: () => void;
}
const LoginOptions: React.FC<ChildProp>= (props) => {

  return (
    <div className="signin-buttons">
      <div>
        <div className="subtext-div">Sign in to get stats & match history!</div>
          {/*  log in with username */}
          <Button className="signin-button button2-margin" onClick={()=>{props.changeComp(<LoginUserPassword changeComp={props.changeComp} closeForm={props.closeForm}/>, 'LoginUserPassword')}}><img className="mail-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAsTAAALEwEAmpwYAAABMklEQVR4nO3aQYrCQBSE4QJzjM5y8CyDxxwXkhGz80LjdsB4gZJAB4ZBFy39nqX9fqil6KchaggQRVEUvV89gD2ACwA6b37OA4C1J/b3CdD/m19D8gDvBbDLBg/wRQC6bPIAU2wBrh3FZh7FFuDaUWzmUWwBrh3FZh7FJgc+5h/588YWwOnPYzsAu5bAFmjzWLgxI63QcmAC+L6BXgH4elcwDdGyYBqhpcE0QBe3AXASeEe7B7+ni/sROoRSa+DeA/xZiH75Q9r7pDXcOWltvU5apSlhpcGDAVYWPBhhJcFja38ekiFWHty1cAHgmNF9K5d4aLwA145iM49iC3DtKDbzKLYA145iM49ia+rGtLMH+CAAXTbfBmneWujm0g84lfJVjOkJ0Cl/sm7YKIqiCE5dAbq7K3/lRP8VAAAAAElFTkSuQmCC"></img>Login to your account!</Button>
        </div>
        <div>
          {/* remain as guest */}
          <Button className="signin-button" onClick={()=>{props.changeComp(<SignupComponent changeComp={props.changeComp} closeForm={props.closeForm}/>, 'SignupComponent')}}><img className="google-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADuUlEQVR4nO2a20tVQRTGf9bJC1l28VIUUY9hlAU9RkRRRvcLgfVc+pKZEL2l9BQWBUb/SCXVS1FgFyvNLl7SirKe8rEy0Tgx8Q0Muvc5Z188HskPNh5Ys9bMt9fMmrXWFmbx/+EZ8IQcRwI4BuxIMSapxw97ZcPYyjoKgFrggxb5PSSRPOCH5IPAKdnOCrYCH50F9gL7InjkgGzYcYbQFqYQRcA14I8mfAUcAeak0UtHBNk4CnRrrJnjquaMFYuBdk0yBlwC8jPUzYSIRQI4D4xKpwMoJSasBN45bq8KqB+EiMVG5/y9BVYQEeXAJxnsApaFsBGGiMFyZ6sZUmWExDzgoQw9BkpC2glLxGAR8FT6D7SmwLghA1+ACsIjChG0C4Zk4zoBsV2KI8BmoiEqEXtmfsrONgJEjtdSOkd0xEEERbOkAk9GW6zRuegyDbHZIJIP9MtWfSbe+KrB1cSDuIgY7HHO7VxS4JAG9igPyjUiOHdaqrSIuxp0mvgQN5Gzsnfbb8ACYFzpgYnfuUpkidZoUqVirwG7NKHJqchhIjiXpGcddFFCkxDmOpHLstnsJbwj4f4ZQOSgbLZ5CbskDJrdTgeRTbL50kto8xmTtuc6kVWy+dlL+EvCohlApEg2zZonwVZlQdOSR8AL1S5BiZRLN2i7qEA2f3sJhyVcGtBoh/Te+JDxI1IuHVvSBkFpqu7NewnXBjTqLsiLjBeRdDrpUCndPi9hm4SmPRMUZU7q36sy1Y/IxLFhyufD0r/pJbwi4QXCwe8tu0SiesKiWTZaSHHJ3Cc8vDxjicThCQvbSzDtVs/e1bgiQZSkceJbt0Ti8MTEpHEhPrinyU4SDe7bd5+onjCoS5WeWJzQIBPbo8L1TByeQMVep+zVkAKFwDcNNGl9VJiFP9cTlYRb6g5l0rW3zYfOdHVxlpFwOo9pmw/WK4NSOEPuoFFr6g/yDWW3k5StZ/pRpWahWdPOsC3T/hD5V5woAwa0ltYwBgp1SJOqkeeTfRTrY2pSfwuivI0+J0MN3doPefG1O99lojTS/2GN41qzzTaQnTMxoDlNVr46LsMVzjYzAaBhij4nJxSdRpztFMf9M+nM2ABgP4aa6BYH8nTZdTv2W6f6U3W143bbyahV0hnmHNQ5aUdSWylwiI3inQanc59URmrS6yY1wysVtvP1mN/rVBQ1aaztE9i0oz6b/zDgwkx6XM29cY9sN90zpiy2ZroIeKFErX5Ttd1Syj6stz6q3z0qT1s01reemAUzHH8B30NgGV5tQXcAAAAASUVORK5CYII="></img>Sign up with Username and Password</Button>
        </div>

        <div>
          {/* remain as guest */}
          <Button className="signin-button" onClick={()=>{props.closeForm()}}><img className="google-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADI0lEQVR4nO2aXWjNcRjHP2f2ZjJvU7tT3sJCiZCSvJS3kZA2N8oFLbK8XylXWi6EKRdehlBuSCFEWMpLbrCGUMzLZJNkWNOOnvqeelrH2s7Z2fn/1/nU/+J5Or/n9zz/3/N7fi//Az1LFjAT2AvcA14DP4E/wGfgOrAPmEFA6QeUA3VAtIvPc2AtECEgjAQeOQc/ANXAUmA0MADor9+tAg4BTe73d4FR6Q5iOfDdBbAByO1CuzxgI9Cstl+BWaSJFUCbHLkCFEmfqzQ7D7wBWvQ8A2qAJUpF1OaGbPzW/OpVJso5c+Cky/My4F0X5scLYIHaZAOnpG8ERvRWEOb0fXV8WY7YGz7uHH0KVADjgAJgIDAN2AG80m/agT2ylwPclP5abwVS5vJ6iHTV0v3SPOmsElngO11aWjCxNGuWrjTVQWQp76OarMZqya3A/G7YWqZg2l27CtmyNSilzFVHX/Rm84G30m1JwN5uta1XeuZrVNpVulPGfnV8VPJKyXUKrLvkaPU3G4ulOyy5khRSq05ssTPOSt6ahM3YqJzokKpWqlNGozqZILleckkSNqe7SodSyuTHpJBWdVIo+YdkK6+JUiQbNjeMoZKtTKeMhjiL2/skbQ6THXspxuAestspi9SBD2JhkjanytZLyeMlPyFk7JLj59wezuRLhIhsV35tx2AckWzbmdAQK70ftWvOc5VxEiGh1O23YqOxTrId1AKP7de2uSCOST8I+CTdGgLOFOCBq3o12qbYbvmCdLeCdI6PR6UbhW/AejkccXu4piCc3zujyo3CaWC49AWSo7oymk2A2eROhJudfp4rvTZCcwgwJbpUMGe3u1E440bIdtRjCThX3S1LRPdbd6Rr0Ykw0BPbmCyH29wbjx2aGrSnCgVVcvqiZDvD/NUFhZXh0PBQgdj9rnFA8kFCRETl1BwfI92zDqfLUFDoqpJNcJRSrQleUqSNYhdIjKi+kYSK4kwgASMzIkGjz4xIrvsQ5J9QHGE7Uq5b+6i7OQzsZ+kMGTIkzu04VcuOtaEj+p8ndETjLIiZQNJJn0mt2jhBpOyPAP8AV9Qt7SOl3tkAAAAASUVORK5CYII="></img>Remain as guest</Button>
        </div>
    </div>
  )
}

export default LoginOptions;