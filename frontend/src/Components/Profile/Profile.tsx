import { useAuth } from "../../contexts/auth/AuthContext";
import './ProfileStyles.css'

const Profile = () => {

  const { username } = useAuth();

  return (
    <div className="profile-container">
      {/* this part is centered because the profile-container has text-align
          and  margin left and right auto */}
      <div>{username}'s Profile</div>

      {/* retrieve their match history (date, wpm, accuracy, mistakes) and 
          show it in some kind of list.*/}
      
      {/* Next to it on the right should be a chart. We can put the chart of the
          users mistakes over time, wpm over time, and they can change the chart
          type between them. (Either load the data all at once or they can have the
          weekly option, daily, or all time.) */}

      {/* on a row on the bottom by itself the user can edit their details, name, password, or 
          even delete their account.*/}
    
    </div>
  )
}


export default Profile;