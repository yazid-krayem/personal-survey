import React, { Component} from 'react';

class Link extends Component {
state={
 inner:[],
 error_message:''
}
async componentDidMount() {
  await this.innerQuestionsAnswers();
 }
 innerQuestionsAnswers = async order => {
  try {
    const response = await fetch(
      `//localhost:8080/inner`
    );
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
  console.log(this.state)
return(
    <div>
      {this.state.inner.map(x=>(
        <div style={{margin:'0 auto',width:'50%'}}>
          <div style={{backgroundColor:'grey'}}>
        <h4>{x.question_title}</h4>
        </div>
        <p>{x.answer_text}</p>
        </div>
      ))}
    </div>
);
}
}
export default Link;













