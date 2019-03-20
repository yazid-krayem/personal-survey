import React from 'react';
import './datacollection.css'


export default class DataCollection extends React.Component {
  
  
  renderViewMode() {
    
    const { question_id, question_title,answer_text,survey_name } = this.props;
      console.log('data',this.props)

    return (
      <div>

        <div >
        {/* <h2 className="survey_name">{survey_name}</h2> */}
<hr />
<div className="datacollection">
        <span>
          <h3>{question_title}</h3> < br />
          {answer_text}
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
      
