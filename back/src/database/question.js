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
    const { question_title , question_type ,question_data} = props
    try{
      const result = await db.run(SQL`INSERT INTO question (question_title,question_type,question_data) VALUES (${question_title},${question_type},${question_data})`);
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
    if (!props || !(props.question_title || props.question_type )) {
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
    const { answer_text,question_id } = props;
    const user_id =1
    try{
      const result = await db.run(SQL`INSERT INTO answer (answer_text,question_id,user_id) VALUES (${answer_text},${question_id},${user_id})`);
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
      throw new Error(`couldn't get the answer ${id}: `+e.message)
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
   const innerQuestionsAnswers = async(orderBy) =>{
    try{
        let statement = `SELECT *
        FROM question
        INNER JOIN answer on answer.question_id = question.question_id;`
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
    innerQuestionsAnswers
}
return controller
}

export default initializeDatabase