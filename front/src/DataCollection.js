import React from 'react';
import './datacollection.css'


export default class DataCollection extends React.Component {
  
  
  renderViewMode() {
    
    const { question_id, question_title, answer } = this.props;
    console.log(this.props)
     console.log('data',answer)

    return (
      <div>

        <div >
<hr />
<div className="datacollection">
        <span>
          <h1>{question_title}</h1> < br />
          {answer.map(a =>(<h3>{a.answer_text}</h3>))}
        </span>
         

        </div>
        </div>
      </div>
    );
  }
  
  
 
    render() {
      return(
          <div>
           {this.renderViewMode()}
          </div>
      );
      }
    }
      

