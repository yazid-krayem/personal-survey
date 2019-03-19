import React from 'react';
import * as auth0Client from '../auth';
import { withRouter } from 'react-router-dom';


export default class Profile extends React.Component {
  
  
  
  renderViewMode() {
    const { user_name,survey_name,survey_id } = this.props;
    
    return (
      <div>
        <br />
        <br />
      <div className="col-xs-12
      col-sm-8
      col-md-6
      col-lg-4 
      ">


       <button>{survey_id}-{survey_name}</button>
       
       
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
      
