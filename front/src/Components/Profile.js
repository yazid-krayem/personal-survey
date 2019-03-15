import React, { Component} from 'react';
import { pause, makeRequestUrl } from "../utils.js";


const makeUrl = (path, params) =>
  makeRequestUrl(`http://localhost:8080/${path}`, params);

class Profile extends Component {
state={
 inner:[],
 error_message:''
}
async componentDidMount() {
  await this.innerSurveyAndQuestions();
 }
  
 innerSurveyAndQuestions = async order => {
  try {
    const url = makeUrl('inner/survey')
    const response = await fetch(url);
    const answer = await response.json();
    if (answer.success) {
      const inner = answer.result;
      this.setState({ inner });
    } else {
      this.setState({ error_message: answer.message });
    }
    
  } catch (err) {
    this.setState({ error_message: err.message });
  }
};

render() {
return(
    <div>
      {this.state.inner.map(x=>(
        <div style={{margin:'0 auto',width:'50%'}}>
          <div style={{backgroundColor:'grey'}}>
        <h4>{x.question_title}</h4>
        </div>
        <p>{x.survey_name}</p>
        </div>
      ))}
    </div>
);
}
}
export default Profile;













