import sqlite from 'sqlite'
import SQL from 'sql-template-strings';

const initializeDatabase = async () =>{

    const db = await sqlite.open("./jad.db");


    /**
   * creates a question
   * @param {object} props an object with keys `question_title`,`question_type`, `question_data`
   * @returns {number} the id of the created question (or an error if things went wrong) 
   */
  

  const createQuestion = async (props) => {
    if(!props ){
      throw new Error(`you must provide a name and an type`)
    }
    
    const { question_title , question_type ,question_data, auth0_sub,survey_id} = props;

    try{
      const result = await db.run(SQL`INSERT INTO question (question_title,question_type,question_data,auth0_sub,survey_id) VALUES (${question_title},${question_type},${question_data}, ${auth0_sub},${survey_id})`);
      const id = result.stmt.lastID
      return id
    }catch(e){
      throw new Error(`couldn't insert this combination: `+e.message)
    }
  }

/**
   * deletes a question
   * @param {number} id the id of the question to delete
   * @returns {boolean} `true` if the question was deleted, an error otherwise 
   */
        const deleteQuestion = async (id) =>{
            try{
                const result = await db.run(SQL `DELETE FROM question WHERE question_id =${id}`)
                if(result.stmt.changes === 0){
                 throw new Error (`question "${id}" does not exist`)
                }
                return true    
            }catch(e){
                throw new Error (`couldn't delete the question "${id}": `+e.message)
            }
        }

        /**
   * Edits a question
   * @param {number} question_id the id of the question to edit
   * @param {object} props an object with at least one of ``
   */

  const updateQuestion = async (question_id, props) => {
    if (!props || !(props.question_title || props.question_type||props.question_data )) {
      throw new Error(`you must provide a question`);
    }
    const { question_title,question_type,question_data } = props;
    try {
      let statement = "";
      if (question_title && question_type&& question_data ) {
        statement = SQL`UPDATE question SET question_title=${question_title}, question_type=${question_type},question_data=${question_data} WHERE question_id = ${question_id}`;
      } 
      const result = await db.run(statement);
      if (result.stmt.changes === 0) {
        throw new Error(`no changes were made`);
      }
      return true;
    } catch (e) {
      throw new Error(`couldn't update the question ${question_id}: ` + e.message);
    }
  }

        /**
   * Retrieves a question
   * @param {number} id the id of the question
   * @returns {object} an object with `question_title`, `question_type`,`question_data and `question_id`, representing a question, or an error 
   */
  const getQuestion = async (id) => {
    try{
      const question_List = await db.all(SQL`SELECT * FROM question WHERE question_id = ${id}`);
      const question = question_List[0]
      if(!question){
        throw new Error(`question ${id} not found`)
      }
      return question
    }catch(e){
      throw new Error(`couldn't get the question ${id}: `+e.message)
    }
  }

     /**
   * retrieves the questions from the database
   * @param {string} orderBy an optional string that is either "title_question"
   * @returns {array} the list of questions
   */

   const getQuestionList = async(orderBy) =>{
       try{
           let statement = `SELECT question_id AS id , question_title , question_type,question_data FROM question `
           switch(orderBy){
            case 'question_title': statement+= ` ORDER BY question_title`; break;
            default: break
        }
        const rows = await db.all(statement)
      if(!rows.length){
        throw new Error(`no rows found`)
       }
       return rows
    }catch(e){
      throw new Error(`couldn't retrieve questions: `+e.message)
   }
   }
   ////////////////////////////////////////////////////////////////////
   ///////////////////////////////////////////////////////
   ///////////////////////////////////////////////
     /**
   * creates a answer
   * @param {object} props an object with keys `answer_id` and `answer_text`
   * @returns {number} the id of the created an answer (or an error if things went wrong) 
   */

  const createAnswer = async (props) => {
    if(!props  ){
      throw new Error(`you must provide a answer`)
    }
    const { answer_text,question_id,auth0_sub } = props;
    try{
      const result = await db.run(SQL`INSERT INTO answer (answer_text,question_id,auth0_sub) VALUES (${answer_text},${question_id},${auth0_sub})`);
      const id = result.stmt.lastID
      return id
    }catch(e){
      throw new Error(`couldn't insert this combination: `+e.message)
    }
  }

/**
   * deletes an answer
   * @param {number} id the id of the answer to delete
   * @returns {boolean} `true` if the answer was deleted, an error otherwise 
   */
        const deleteAnswer = async (id) =>{
            try{
                const result = await db.run(SQL `DELETE FROM answer WHERE answer_id =${id}`)
                if(result.stmt.changes === 0){
                 throw new Error (`answer "${id}" does not exist`)
                }
                return true    
            }catch(e){
                throw new Error (`couldn't delete the answer "${id}": `+e.message)
            }
        }

        /**
   * Edits a answer
   * @param {number} id the id of the answer to edit
   * @param {object} props an object with at least one of `answer_text`
   */

        const updateAnswer = async (id,props) =>{
            if(!props || !props.answer){
                throw new Error (`you must provide an answer`);
            }
            const {answer_text} = props
            try{
                let statement = '';
                if(answer){
                    statement = SQL`UPDATE answer SET answer_text${answer_text}, WHERE answer_id =${id}`
                }
                const result = await db.run(statement)
                if(result.stmt.changes === 0 ){
                    throw new Error(`no changes were made`)
                }
                return true
            }catch(e) {
                throw new Error (`couldn't update the answer ${id}:` + e.message)
            }
        }
        /**
   * Retrieves a answer
   * @param {number} id the id of the answer
   * @returns {object} an object with `answer_text`, and `answer_id`, representing an answer, or an error 
   */
  const getAnswer = async (id) => {
    try{
      const answerList = await db.all(SQL`SELECT answer_id AS id, answer_text FROM answer WHERE answer_id = ${id}`);
      const answer = answerList[0]
      if(!answer){
        throw new Error(`answer ${id} not found`)
      }
      return answer
    }catch(e){
      throw new ErgetSurveyQuestionsror(`couldn't get the answer ${id}: `+e.message)
    }
  }
     /**
   * retrieves the answers from the database
   * @param {string} orderBy an optional string that is either "answer"
   * @returns {array} the list of answers
   */

   const getAnswerList = async(orderBy) =>{
       try{
           let statement = `SELECT answer_id AS id , answer_text,question_id,user_id FROM answer `
           switch(orderBy){
            case 'answer_text': statement+= ` ORDER BY answer_text`; break;
            default: break
        }
        const rows = await db.all(statement)
      if(!rows.length){
        throw new Error(`no rows found`)
       }
       return rows
    }catch(e){
      throw new Error(`couldn't retrieve answer: `+e.message)
   }
   }
   const createUserIfNotExists = async props => {
    const { auth0_sub, user_name } = props;
    const answer = await db.get(
      SQL`SELECT user_id FROM user WHERE auth0_sub = ${auth0_sub}`
    );
    if (!answer) {
      await createUser(props);
      return { ...props, firstTime: true };
    }
    return props;
  };

  const getUserIdentities = async user_name => {
    const user = await db.all(
      SQL`SELECT * FROM user WHERE user_name = ${user_name}`
    );
    const providers = user.map(user => {
      const { auth0_sub } = user;
      const [providerType, _1] = auth0_sub.split("|");
      const [providerName, _2] = providerType.split("-");
      return {
        name: providerName,
        sub: auth0_sub
      };
    });
    return providers;
  };


   const innerQuestionsAnswers = async survey_id =>{
     try{
       let statement = `SELECT *
       FROM question
       INNER JOIN answer on answer.question_id = question.question_id WHERE survey_id=${survey_id}`
       
        
        const rows = await db.all(statement)
        if(!rows.length){
          throw new Error(`no rows found`)
        }
    return rows
 }catch(e){
   throw new Error(`couldn't retrieve questions: `+e.message)
}
}
//inner between surveys and questions
const innerSurveysandQuestions = async(orderBy) =>{
  try{
      let statement = `SELECT *
      FROM survey
      INNER JOIN question on question.survey_id = survey.survey_id`
      switch(orderBy){
       case 'survey_id': statement+= ` ORDER BY survey_id`; break;
       default: break
   }
   const rows = await db.all(statement)
 if(!rows.length){
   throw new Error(`no rows found`)
  }
  return rows
}catch(e){
 throw new Error(`couldn't retrieve questions: `+e.message)
}
}
const innerSurveysandUsers = async(auth0_sub) =>{
  try{
      let statement = `SELECT *
      FROM user
      INNER JOIN survey on survey.auth0_sub = user.auth0_sub where user.auth0_sub=${auth0_sub}`
     
   
   const rows = await db.all(statement)
 if(!rows.length){
   throw new Error(`no rows found`)
  }
  return rows
}catch(e){
 throw new Error(`couldn't retrieve questions: `+e.message)
}
}
//CREATE USERS
const createUser = async (props) => {
  if(!props  ){
    throw new Error(` usersssss`)
  }
  const { user_name,auth0_sub } = props;
  try{
    const result = await db.run(SQL`INSERT INTO user (user_name,auth0_sub) VALUES (${user_name},${auth0_sub})`);
    const id = result.stmt.lastID
    return id
  }catch(e){
    throw new Error(`couldn't insert this combination: `+e.message)
  }
}
//create a survey 
const createSurvey = async (props) => {
  if(!props ){
    throw new Error(`you must provide a Title`)
  }
  const { survey_name, auth0_sub} = props
  try{
    const result = await db.run(SQL`INSERT INTO survey (survey_name,auth0_sub) VALUES (${survey_name}, ${auth0_sub})`);
    const id = result.stmt.lastID
    return id
  }catch(e){
    throw new Error(`couldn't insert this combination: `+e.message)
  }
}
// all surveys
const getSurveysList = async(orderBy) =>{
  try{
      let statement = `SELECT survey_id AS id , survey_name , auth0_sub FROM survey `
      switch(orderBy){
       case 'survey_name': statement+= ` ORDER BY survey_name`; break;
       default: break
   }
   const rows = await db.all(statement)
 if(!rows.length){
   throw new Error(`no rows found`)
  }
  return rows
}catch(e){
 throw new Error(`couldn't retrieve users: `+e.message)
}
}
// all useres
const getUsersList = async(orderBy) =>{
  try{
      let statement = `SELECT user_id AS id , user_name , auth0_sub FROM user `
      switch(orderBy){
       case 'user_name': statement+= ` ORDER BY user_name`; break;
       default: break
   }
   const rows = await db.all(statement)
 if(!rows.length){
   throw new Error(`no rows found`)
  }
  return rows
}catch(e){
 throw new Error(`couldn't retrieve users: `+e.message)
}
}
//get questions by surveys
     /**
   * Retrieves a answer
   * @param {number} id the id of the question
   * @returns {object} an object with `question_title`,`question_text`, `question_data` and `question_id`, representing an answer, or an error 
   */
  const getQuestionsBySurvey = async (id) => {
    try{
      const answerList = await db.all(SQL`SELECT * FROM question WHERE survey_id= ${id};`);
      const answer = answerList
      if(!answer){
        throw new Error(`answer ${id} not found`)
      }
      return answer
    }catch(e){
      throw new Error(`couldn't get the answer ${id}: `+e.message)
    }
  }
const controller = {
    getQuestionList,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestion,
    getAnswer,
    getAnswerList,
    createAnswer,
    updateAnswer,
    deleteAnswer,
    innerQuestionsAnswers,
    createUserIfNotExists,
    getUserIdentities,
    createUser,
    getUsersList,
    createSurvey,
    getSurveysList,
    innerSurveysandQuestions,
    getQuestionsBySurvey,
    innerSurveysandUsers
}
return controller
}

export default initializeDatabase