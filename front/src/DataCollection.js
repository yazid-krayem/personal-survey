import React from 'react';


export default class DataCollection extends React.Component {
  
  
  renderViewMode() {
    
    const { question_id, question_title,answer_text,survey_name } = this.props;
      console.log('data',this.props)

    return (
      <div>

        <div >
          <h3>{survey_name}</h3>
        <span>
          {question_id} - {question_title} < br />
          {answer_text}
        </span>
         

       
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
      
