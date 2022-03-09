import './HomeCard.css'
import { select } from '../../index'

function HomeCard() {
  return (
    <div className="HomeCardLayout">
      <div className="HomeCardHeader">
        <div className="HomeCardTitle"> Welcome back, {select(state => state.user.username)} </div>
      </div>
      <div style={{ gridArea: "left", padding: "0.75rem" }}>Analytics soon</div>
      <div style={{ gridArea: "right", padding: "0.75rem" }}>u madman</div>
    </div>
  );
}

export const homePage = () => <HomeCard />

export default HomeCard;
