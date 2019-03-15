import React from 'react';


export default class DataCollection extends React.Component {
  
  
  renderViewMode() {
    
    const { question_id, question_title,answer_text } = this.props;


    return (
      <div>

        <div >
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
      
